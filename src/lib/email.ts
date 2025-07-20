// Simple email service - production'da gerçek email service kullanın
export const emailService = {
  sendPasswordResetEmail: async (email: string, resetToken: string) => {
    // Production'da gerçek email gönderimi yapılacak
    console.log(`Password reset email sent to ${email}`);
    console.log(`Reset link: http://localhost:3000/reset-password?token=${resetToken}`);
    return true;
  },

  sendVerificationEmail: async (email: string, verificationToken: string) => {
    // Production'da gerçek email gönderimi yapılacak
    console.log(`Verification email sent to ${email}`);
    console.log(`Verification link: http://localhost:3000/verify-email?token=${verificationToken}`);
    return true;
  }
};