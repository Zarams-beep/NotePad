import AppError from "../utils/AppError.js";
import { createUser } from "../services/users/createNoteUser.js";
import { logUserIntoApp } from "../services/users/logs.js";
import { getUserProfile } from "../services/users/profile.js";

async function registerUser(req, res) {
  try {
    const { username, email, password } = req.body;
    await createUser({
      username,
      email,
      password,
    });
    res.status(201).json({ success: true, message: "User registered" });
  } catch (error) {
    throw new AppError(error || "Registration failed", 400);
  }
}

async function loginUser(req, res) {
  try {
    console.log("Login request body:", req.body);
    const { email, password } = req.body;
    const user = await logUserIntoApp({ email, password });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    throw new AppError(error.message || "Invalid Email or Password", 401);
  }
}

async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError("Current password and new password are required", 400);
    }

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    throw new AppError(error.message || "Password change failed", 400);
  }
}

async function getEmailOTP(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      throw new AppError("Email is required", 400);
    }

    res.status(200).json({
      success: true,
      message: "OTP sent to email successfully",
    });
  } catch (error) {
    throw new AppError(error.message || "Failed to send OTP", 500);
  }
}

async function verifyEmailOTP(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      throw new AppError("Email and OTP are required", 400);
    }

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    throw new AppError(error.message || "OTP verification failed", 400);
  }
}

async function userProfile(req, res, next) {
  try {
    const userId = req.user?.id;

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

async function logoutUser(req, res, next) {
  try {
    const userId = req.user?.id;

    await logUserOutOfApp(userId);

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(new AppError(error.message || "Logout failed", 400));
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
