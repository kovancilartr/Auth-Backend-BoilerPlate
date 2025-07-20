import { prisma } from "../lib/prisma";
import { hashPassword, comparePassword } from "../lib/bcrypt";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../lib/jwt";
import { generateRandomToken } from "../utils/crypto";
import { emailService } from "../lib/email";
import { ApiError } from "../utils/ApiError";

interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  register: async (data: RegisterData) => {
    const { email, password, name } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(409, "User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ id: user.id });

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return { user, accessToken, refreshToken };
  },

  login: async (data: LoginData) => {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(401, "Maalesef böyle bir kullanıcı yok.");
    }
    if (!user.isActive) {
      throw new ApiError(401, "Üzgünüz, bu hesap aktif değil.");
    }

    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      throw new ApiError(401, "Üzgünüz, parola hatalı.");
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({ id: user.id });

    // Store refresh token in database
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  },

  refreshToken: async (refreshToken: string) => {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new ApiError(401, "Invalid or expired refresh token");
      }

      if (!storedToken.user.isActive) {
        throw new ApiError(401, "User account is inactive");
      }

      // Generate new tokens
      const newAccessToken = generateAccessToken({
        id: storedToken.user.id,
        email: storedToken.user.email,
        role: storedToken.user.role,
      });
      const newRefreshToken = generateRefreshToken({ id: storedToken.user.id });

      // Replace old refresh token with new one
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: {
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: storedToken.user.id,
          email: storedToken.user.email,
          name: storedToken.user.name,
          role: storedToken.user.role,
        },
      };
    } catch (error) {
      throw new ApiError(401, "Invalid refresh token");
    }
  },

  logout: async (refreshToken: string) => {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  },

  logoutAll: async (userId: string) => {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  },

  forgotPassword: async (email: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Security: Don't reveal if email exists
      return { message: "If email exists, reset link has been sent" };
    }

    const resetToken = generateRandomToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordReset.create({
      data: {
        email,
        token: resetToken,
        expiresAt,
      },
    });

    await emailService.sendPasswordResetEmail(email, resetToken);

    return { message: "If email exists, reset link has been sent" };
  },

  resetPassword: async (token: string, newPassword: string) => {
    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (
      !resetRecord ||
      resetRecord.used ||
      resetRecord.expiresAt < new Date()
    ) {
      throw new ApiError(400, "Invalid or expired reset token");
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { email: resetRecord.email },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true },
    });

    // Logout from all devices
    await prisma.refreshToken.deleteMany({
      where: { userId: resetRecord.user.id },
    });

    return { message: "Password reset successfully" };
  },

  sendVerificationEmail: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (user.isVerified) {
      throw new ApiError(400, "Email already verified");
    }

    const verificationToken = generateRandomToken();

    // Store verification token in password_resets table (reusing for simplicity)
    await prisma.passwordReset.create({
      data: {
        email: user.email,
        token: verificationToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    await emailService.sendVerificationEmail(user.email, verificationToken);

    return { message: "Verification email sent" };
  },

  verifyEmail: async (token: string) => {
    const verificationRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true },
    });

    if (
      !verificationRecord ||
      verificationRecord.used ||
      verificationRecord.expiresAt < new Date()
    ) {
      throw new ApiError(400, "Invalid or expired verification token");
    }

    await prisma.user.update({
      where: { email: verificationRecord.email },
      data: { isVerified: true },
    });

    await prisma.passwordReset.update({
      where: { id: verificationRecord.id },
      data: { used: true },
    });

    return { message: "Email verified successfully" };
  },

  getProfile: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, "Maalesef bu kullanıcı yok.");
    }

    return user;
  },

  updateProfile: async (userId: string, data: { name?: string }) => {
    const { name } = data;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  },

  changePassword: async (
    userId: string,
    currentPassword: string,
    newPassword: string
  ) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isValidPassword = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isValidPassword) {
      throw new ApiError(400, "Mevcut şifreniz yanlış.");
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Log out from all devices after password change for security
    await prisma.refreshToken.deleteMany({
      where: { userId: user.id },
    });

    return { message: "Şifreniz başarıyla güncellendi." };
  },
};
