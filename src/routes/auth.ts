import express from "express";
import { authController } from "../controllers/authController";
import {
  validate,
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
} from "../middleware/validation";
import { authenticate } from "../middleware/auth";
import { auditLog } from "../middleware/auditLog";

const router = express.Router();

router.post("/register", validate(registerSchema), auditLog('USER_REGISTERED', 'Auth'), authController.register);
router.post("/login", validate(loginSchema), auditLog('USER_LOGIN', 'Auth'), authController.login);
router.post("/refresh-token", validate(refreshTokenSchema), auditLog('TOKEN_REFRESHED', 'Auth'), authController.refreshToken);
router.post("/logout", auditLog('USER_LOGOUT', 'Auth'), authController.logout);
router.post("/logout-all", authenticate, auditLog('USER_LOGOUT_ALL', 'Auth'), authController.logoutAll);
router.post("/forgot-password", validate(forgotPasswordSchema), auditLog('PASSWORD_RESET_REQUESTED', 'Auth'), authController.forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), auditLog('PASSWORD_RESET_COMPLETED', 'Auth'), authController.resetPassword);
router.post("/send-verification", authenticate, auditLog('VERIFICATION_EMAIL_SENT', 'Auth'), authController.sendVerificationEmail);
router.post("/verify-email", validate(verifyEmailSchema), auditLog('EMAIL_VERIFIED', 'Auth'), authController.verifyEmail);
router.get("/me", authenticate, auditLog('PROFILE_VIEWED', 'Auth'), authController.getProfile);
router.patch("/me", authenticate, auditLog('PROFILE_UPDATED', 'Auth'), authController.updateProfile);
router.post("/change-password", authenticate, validate(changePasswordSchema), auditLog('PASSWORD_UPDATED', 'Auth'), authController.changePassword);

export default router;
