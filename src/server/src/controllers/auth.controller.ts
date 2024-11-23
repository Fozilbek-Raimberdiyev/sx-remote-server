import User from "../models/User";
import {Request, Response} from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "../services/email.service";
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
export const  authController = {
    register : async (req : Request, res : Response) => {
       try {
        const {email, password} = req.body;
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message : "User already exists"});
        }
        const hashedPassword=  bcrypt.hashSync(password,10);
        const otp = generateOTP();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
        const newUser =  new User({
            email,
            password : hashedPassword,
            otp : {
                code : otp,
                expiry : otpExpiry,
            }
        })
        await newUser.save();
        const emailSent = await sendVerificationEmail(email, otp);
        if (emailSent) {
            return res.status(200).json({message : "Verification email sent"});
        }
        return res.status(500).json({message : "Failed to send verification email", error : emailSent});
       }

       catch(e) {
        res.status(500).json({message : e.message});
       }
    },
    verifyEmail : async (req : Request, res : Response) => {
        try {
            const {email, otp} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message : "User not found"});
        }
        if (user.otp.code !== otp || user.otp.expiry < new Date()) {
            return res.status(400).json({message : "Invalid OTP"});
        }
        user.isVerified = true;
        await user.save();
        return res.status(200).json({message : "Email verified successfully"});
        }

        catch (error) {
            res.status(500).json({message : error.message});
        }
    },
    resendVerificationEmail : async (req : Request, res : Response) => {
        try {
            const { email } = req.body;
      
            const user = await User.findOne({ email });
            if (!user) {
              return res.status(404).json({ message: 'User not found' });
            }
      
            if (user.isVerified) {
              return res.status(400).json({ message: 'Email already verified' });
            }
      
            // Generate new OTP
            const otp = generateOTP();
            const otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
      
            user.otp = {
              code: otp,
              expiry: otpExpiry,
            };
            await user.save();
      
            // Send new verification email
            const emailSent = await sendVerificationEmail(email, otp);
            
            if (!emailSent) {
              return res.status(500).json({ message: 'Failed to send verification email' });
            }
      
            res.json({ message: 'New verification code sent to your email' });
          } catch (error) {
            res.status(500).json({ message: error.message });
          }
    },
    login: async (req:Request, res:Response) => {
        try {
          const { email, password } = req.body;
          
          // Find user
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }
    
          // Check password
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
          }
    
          // Generate tokens
          const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
          );
    
          const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
          );
    
          // Save refresh token to database
          user.refreshToken = refreshToken;
          await user.save();

    
          res.json({ accessToken, refreshToken });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
      refreshToken: async (req:Request, res:Response) => {
        try {
          const refreshToken = req.body.refreshToken;
          
          if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not found' });
          }
    
          // Verify refresh token
          const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
          
          // Find user
        //   @ts-expect-error
          const user = await User.findById(decoded.userId);
          if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
          }
    
          // Generate new tokens
          const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_ACCESS_SECRET,
            { expiresIn: '15m' }
          );
    
          const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
          );
    
          // Update refresh token in database
          user.refreshToken = newRefreshToken;
          await user.save();
    
          // Set new refresh token in cookie
          res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
    
          res.json({ accessToken });
        } catch (error) {
          res.status(401).json({ message: 'Invalid refresh token' });
        }
      },
    
      // Logout user
      logout: async (req:Request, res:Response) => {
        try {
          const refreshToken = req.body.refreshToken;
          
          if (refreshToken) {
            // Find user and remove refresh token
            await User.findOneAndUpdate(
              { refreshToken },
              { refreshToken: null }
            );
          }
          res.json({ message: 'Logged out successfully' });
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      },
}

export default authController;