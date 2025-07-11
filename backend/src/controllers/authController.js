import { registerUser, loginUser } from "../services/authServices.js";
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

        await generateAndSendOTP(userId, email);

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
        const {userId, otp} = req.body;

        if (!userId || !otp) {
            return res.status(400).json({error: "User ID and OTP are required"});
        }

        const result = await verifyOTP(userId, otp);

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
      const { userId, email } = req.body;
  
      if (!userId || !email) {
        return res.status(400).json({ error: 'User ID and email are required.' });
      }
  
      await generateAndSendOTP(userId, email);
  
      res.status(200).json({ message: 'New OTP sent to your email.' });
    } catch (error) {
      next(error);
    }
  }

async function handleLogin(req, res, next){
    try {
        const {email, password}  = req.body;

        if (!email || !password) {
            return res.status(400).json({error: "Email and password are required"});
        }

        const ip = req.ip || req.headers['x-forwarded-for'];
        const userAgent = req.headers['user-agent'];

        const result = await loginUser({ email, password, ip, userAgent });

        if (!result.success){
            if (result.status === "unverified"){
                return res.status(403).json({
                    error: 'Email not verified.',
                    userId: result.userId,
                    email: result.email,
                  });
            }
            return res.status(401).json({ error: result.message });
        }

        res.status(200).json({
            message: "Login successful",
            token: result.token,
            aesKey: result.aesKey,
        });
    } catch (error) {
        next(error);
    }
}
  
export{
    handleRegistration,
    handleOTPVerification,
    handleResendOTP,
    handleLogin,
};