import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.OTP_EMAIL,
        pass: process.env.OTP_EMAIL_PASS
    }
});

export async function sendOTPEmail({to, otp}){
    const mailOptions = {
        from: process.env.OTP_EMAIL,
        to,
        subject: "Your Vaul-In OTP Code",
        text: `Your one-time passcode is: ${otp}. This code expires in 5 minutes.`
    }

    await transporter.sendMail(mailOptions);
}