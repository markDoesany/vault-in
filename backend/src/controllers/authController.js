import { registerUser, 
         loginStep1, 
         loginStep2, 
         resetUserPassword, 
         requestPasswordReset,
         logoutUser
      } from "../services/authServices.js";
import { generateAndSendOTP, verifyOTP } from "../services/otpService.js";

async function handleRegistration(req, res, next){
    try {
        const {username, email, password} = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({error: "All fields are required"});
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const userId = await registerUser({username, email, password});

        if (!userId) {
            return res.status(500).json({error: "Failed to register user"});
        }

        await generateAndSendOTP(userId, 'registration', email);

        res.status(201).json({
            message: "User registered successfully, OTP sent to your email",
            userId,
        })
    } catch (error) {
        if(error.code === "ER_DUP_ENTRY"){
            return res.status(409).json({error: "Email or username already exists"});
        }
        next(error);
    }
}

async function handleOTPVerification(req, res, next){
    try {
        const {userId, otp, type} = req.body;

        if (!userId || !otp || !type) {
            return res.status(400).json({error: "User ID and OTP are required"});
        }

        const result = await verifyOTP(userId, type, otp);

        if (!result.success) {
            return res.status(400).json({error: result.message});
        }

        res.status(200).json({message: "OTP verified successfully"});
    } catch (error) {
        next(error);
    }
}

async function handleResendOTP(req, res, next) {
    try {
      const { userId, email, type } = req.body;
  
      if (!userId || !email || !type) {
        return res.status(400).json({ error: 'User ID and email are required.' });
      }
  
      await generateAndSendOTP(userId, type, email);
  
      res.status(200).json({ message: 'New OTP sent to your email.' });
    } catch (error) {
      next(error);
    }
  }

async function handleLogin(req, res, next) {
    const { email, password, otp } = req.body;
    try {
      if (!otp) {
        // STEP 1: credentials → send OTP
        const result = await loginStep1({ email, password });
        if (!result.success) {
          return res.status(401).json({ error: result.message });
        }
        return res.status(200).json({
          status: 'otp_sent',
          message: 'Check your email for the 6-digit code.'
        });
      }
  
      // STEP 2: credentials + otp → issue token + aesKey + session
      const ip = req.ip || req.headers['x-forwarded-for'];
      const userAgent = req.headers['user-agent'];
  
      const result2 = await loginStep2({ email, password, otp, ip, userAgent});
      if (!result2.success) {
        return res.status(401).json({ error: result2.message });
      }
      
      return res.status(200).json({
        message: 'Login successful.',
        token: result2.token,
        aesKey: result2.aesKey
      });
    } catch (err) {
      next(err);
    }
  }

async function handleForgotPasswordRequest(req, res, next) {
  try {
    const { email } = req.body;
    if (!email){
      return res.status(400).json({ error: "Email is required"})
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }
    const ip = req.ip || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];
    
    const result = await requestPasswordReset(email, ip, userAgent);
    if (!result.success) {
      return res.status(400).json({ error: result.message });
    }

    return res.status(200).json({ message: 'Reset password OTP sent to your email' });
  } catch (error) {
    next(error);
  }
}
  
async function handleForgotPasswordOTPVerification(req, res, next){
  try {
    const {userId, otp} = req.body;
    if (!userId || !otp){
      return res.status(400).json({error: "User ID and OTP are required"});
    }
    const result = await verifyOTP(userId, 'reset_password', otp);
    if (!result.success){
      return res.status(400).json({error: result.message});
    }
  
    return res.status(200).json({message: "OTP verified successfully. You may now reset your password."});
  } catch (error) {
    next(error);
  }
}

async function handleForgotPasswordReset(req, res, next){
  try {
    const {userId, newPassword} = req.body;
  
    if (!userId || !newPassword){
      return res.status(400).json({error: "User ID and password are required"});
    }
    const ip = req.ip || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];

    const result = await resetUserPassword(userId, newPassword, ip, userAgent);

    if (!result.success){
      return res.status(400).json({error: result.message});
    }

    return res.status(200).json({message: "Password reset successfully. Vault entries have been purged"})
  } catch (error) {
    next(error);
  }
}


async function handleLogout(req, res, next){
  try {
    const { id: userId, email} =  req.user;
    const ip = req.ip || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'];
    
    const result = await logoutUser(userId, ip, userAgent);
    if (!result.success){
      return res.status(400).json({error: result.message});
    }

    return res.status(200).json({message: "You have been logout successfully"});

  } catch (error) {
    next(error);
  }
}

export{
    handleRegistration,
    handleOTPVerification,
    handleResendOTP,
    handleLogin,
    handleForgotPasswordRequest,
    handleForgotPasswordOTPVerification,
    handleForgotPasswordReset,
    handleLogout
};