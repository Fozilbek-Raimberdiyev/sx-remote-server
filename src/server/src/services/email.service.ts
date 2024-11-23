import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();
const transporter = nodemailer.createTransport({
    service : "gmail",
    auth : {
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASSWORD,
    }
})

export async function sendVerificationEmail(email : string, otp : string) {
    try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Email Verification',
          html: `
            <h1>Email Verification</h1>
            <p>Your verification code is: <strong>${otp}</strong></p>
            <p>This code will expire in 10 minutes.</p>
          `,
        });
        return true;
      } catch (error) {
        console.error('Email sending error:', error);
        return false;
      }
}