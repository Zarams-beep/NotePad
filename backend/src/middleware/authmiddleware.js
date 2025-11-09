import utils from "../utils/Auth.js";
import User from "../models/Users.js";

async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - No token" });
    }

    const token = auth.split(" ")[1];

    const payload = await utils.verifyToken(token);
    console.log("Token payload:", payload);

    // FIX: Use username instead of id
    const user = await User.findOne({ where: { username: payload.username } });
    console.log("User found:", user ? "Yes" : "No");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized - User not found" });
    }

    // Create a clean user object without password
    const userWithoutPassword = {
      user_uuid: user.user_uuid,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    req.user = userWithoutPassword;

    next();
  } catch (error) {
    console.error("Auth middleware full error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - " + error.message });
  }
}

export default authMiddleware;
