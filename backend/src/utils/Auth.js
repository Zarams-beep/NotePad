import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config/index.js";

async function generateToken(user) {
  try {
    const payload = {
      id: user.user_uuid,
      username: user.username,
      email: user.email,
    };
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRES_IN || "1h",
    });
  } catch (error) {
    throw new Error("Error generating token");
  }
}

async function verifyToken(token) {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid token");
  }
}

async function generateRefreshToken(user, token) {
  try {
    const payload = {
      id: user.user_uuid,
      username: user.username,
      email: user.email,
      tokenId: token,
    };
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN || "7d",
    });
  } catch (error) {
    throw new Error("Error generating refresh token");
  }
}

async function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
}

async function comparePassword(plainPassword, hashedPassword) {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new Error("Error comparing passwords");
  }
}

async function hashPassword(password) {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

export default {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
  comparePassword,  
  hashPassword,    
};