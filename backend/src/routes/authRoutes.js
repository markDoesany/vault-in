import express from "express";
import {handleRegistration, handleOTPVerification, handleResendOTP, handleLogin} from "../controllers/authController.js";
import { otpResendLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/register", handleRegistration);
router.post("/verify-otp", handleOTPVerification);
router.post("/resend-otp", otpResendLimiter, handleResendOTP);
router.post("/login", handleLogin);

export default router;
