import AppError from "../utils/AppError.js";
import { createUser } from "../services/users/createNoteUser.js";
import { logUserIntoApp } from "../services/users/logs.js";
import { getUserProfile } from "../services/users/profile.js";
import { changeUserPassword } from "../services/users/changePassword.js";
import { generateOTP, storeOTP, getOTP, deleteOTP } from "../services/users/otp.js";
import { sendEmail, renderTemplate } from "../services/emailService.js";
import User from "../models/Users.js";

async function registerUser(req, res, next) {
  try {
    const { username, email, password } = req.body;
    await createUser({
      username,
      email,
      password,
    });
    res.status(201).json({ success: true, message: "User registered" });
  } catch (error) {
    next(new AppError(error.message || "Registration failed", 400));
  }
}

async function loginUser(req, res, next) {
  try {
    console.log("Login request body:", req.body);
    const { email, password } = req.body;
    const user = await logUserIntoApp({ email, password });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(new AppError(error.message || "Invalid Email or Password", 401));
  }
}

async function changePassword(req, res, next) {
  try {
    const userId = req.user?.user_uuid;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
    }

    // Change password
    await changeUserPassword(userId, currentPassword, newPassword);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(new AppError(error.message || "Password change failed", 400));
  }
}

async function getEmailOTP(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    // Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError("Email not found", 404);
    }

    // Generate 6-digit OTP
    const otp = generateOTP();

    // Store OTP in Redis with 5-minute expiry
    await storeOTP(email, otp);

    // Send email with OTP
    try {
      const emailHtml = await renderTemplate("otpEmail", { otp });
      await sendEmail(email, "Your Verification Code - NotePad", emailHtml);
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // Continue anyway - OTP is stored
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to email successfully",
      // Only include in development for testing
      ...(process.env.NODE_ENV === "development" && { otp }),
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to send OTP", 500));
  }
}

async function verifyEmailOTP(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new AppError("Email and OTP are required", 400);
    }

    // Retrieve stored OTP
    const storedOTP = await getOTP(email);

    if (!storedOTP) {
      throw new AppError("OTP expired or not found", 400);
    }

    // Verify OTP matches
    if (storedOTP !== otp) {
      throw new AppError("Invalid OTP", 400);
    }

    // Mark email as verified (optional - add email_verified field to User model)
    const user = await User.findOne({ where: { email } });
    if (user) {
      user.email_verified = true;
      await user.save();
    }

    // Delete OTP after successful verification
    await deleteOTP(email);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(new AppError(error.message || "OTP verification failed", 400));
  }
}

async function userProfile(req, res, next) {
  try {
    const userId = req.user?.user_uuid;

    if (!userId) throw new AppError("Unauthorized user", 401);

    const profile = await getUserProfile(userId);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(new AppError(error.message || "User not found", 404));
  }
}

export {
  registerUser,
  loginUser,
  changePassword,
  getEmailOTP,
  verifyEmailOTP,
  userProfile,
};