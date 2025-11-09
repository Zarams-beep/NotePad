import express from "express";
import { 
  loginUser, 
  registerUser, 
  userProfile,
  changePassword,
  getEmailOTP,
  verifyEmailOTP
} from "../controller/authController.js";
import { 
  registrationValidator, 
  loginValidator,
  changePasswordValidator,
  otpRequestValidator,
  otpVerifyValidator
} from "../utils/Validators.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", validationMiddleware(registrationValidator), registerUser);
router.post("/login", validationMiddleware(loginValidator), loginUser);
router.post("/send-otp", validationMiddleware(otpRequestValidator), getEmailOTP);
router.post("/verify-otp", validationMiddleware(otpVerifyValidator), verifyEmailOTP);

// Protected routes
router.get("/profile", authMiddleware, userProfile);
router.post("/change-password", authMiddleware, validationMiddleware(changePasswordValidator), changePassword);

export default router;