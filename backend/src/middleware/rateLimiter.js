import rateLimit from "express-rate-limit";

export const otpResendLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 1,
    message:{
        error: "Too many resend requests from this IP, please try again after 5 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false ,
    handler: (req, res) => {
        const now = new Date();
        const retryAfterMs = req.rateLimit.resetTime - now;
        const retryAfterSeconds = Math.ceil(retryAfterMs / 1000);
    
        res.set('Retry-After', retryAfterSeconds.toString());
    
        return res.status(429).json({
          error: 'Too many OTP requests. Please wait before trying again.',
          retryAfter: retryAfterSeconds,
          retryAt: req.rateLimit.resetTime, 
        });
      }
    
});