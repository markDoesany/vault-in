import express from "express";
import {
        handleRegistration, 
        handleOTPVerification, 
        handleResendOTP, 
        handleLogin, 
        handleForgotPasswordRequest,
        handleForgotPasswordOTPVerification,
        handleForgotPasswordReset,
        handleLogout   
    } from "../controllers/authController.js";
import { otpResendLimiter } from "../middleware/rateLimiter.js";
import {sessionGuard} from "../middleware/sessionGuard.js";


const router = express.Router();

router.post("/register", handleRegistration);
router.post("/verify-otp", handleOTPVerification);  
router.post("/resend-otp", otpResendLimiter, handleResendOTP);
router.post("/login", handleLogin);
router.post("/forgot-password/request", handleForgotPasswordRequest);
router.post("/forgot-password/verify",  handleForgotPasswordOTPVerification);
router.post("/forgot-password/reset", handleForgotPasswordReset);

router.post("/logout", sessionGuard, handleLogout)

export default router;
