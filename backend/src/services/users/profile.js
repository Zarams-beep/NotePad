import User from "../../models/Users.js";
import cache from "../../config/cache.js";
import fs from "fs/promises";
import path from "path";

// Get user profile (with caching)
export async function getUserProfile(user_uuid) {
  // Try to get from cache
  if (cache && cache.redis) {
    const cachedProfile = await cache.get(`userProfile:${user_uuid}`);
    if (cachedProfile) {
      return JSON.parse(cachedProfile);
    }
  }

  // If not cached, fetch from DB
  const user = await User.findOne({
    where: { id: user_uuid },
  });

  if (!user) throw new Error("User not found");

  // Remove password from data
  const userData = { ...user.dataValues };
  delete userData.password;

  // Store in cache for next time
  if (cache && cache.redis) {
    await cache.set(`userProfile:${user_uuid}`, JSON.stringify(userData), 3600);
  }

  return userData;
}

export async function updateUserProfile(user_uuid, requestData) {
  let tempFilePath = null;

  try {
    // Find user by UUID or ID
    const user = await User.findOne({ where: { id: user_uuid } });
    if (!user) throw new Error("User not found");

    // Prepare fields to update
    const updateData = {};

    if (requestData.username) updateData.username = requestData.username;
    if (requestData.email) updateData.email = requestData.email;

    // Handle file upload
    if (requestData.file) {
      tempFilePath = requestData.file.path;

      // Ensure the directory exists
      const avatarsDir = path.join("uploads", "avatars");
      await fs.mkdir(avatarsDir, { recursive: true });

      // Create a unique filename
      const filename = `${user_uuid}-${Date.now()}${path.extname(
        requestData.file.originalname
      )}`;
      const permanentPath = path.join(avatarsDir, filename);

      // Move temp file → permanent folder
      await fs.rename(tempFilePath, permanentPath);
      tempFilePath = null; // Clear after move

      // If user already has an image, delete the old one
      if (user.image) {
        await fs
          .unlink(user.image)
          .catch((err) =>
            console.error("Error deleting old profile picture:", err)
          );
      }

      updateData.image = permanentPath;
    }

    // Apply all updates
    await user.update(updateData);
    await user.reload();

    // Create response object (without password)
    const userResponse = user.toJSON();
    delete userResponse.password;

    // Update cache if available
    if (cache && cache.redis) {
      const cacheKey = `userProfile:${user_uuid}`;
      await cache.del(cacheKey);
      await cache.set(cacheKey, userResponse, 3600); // 1 hour
    }

    return userResponse;
  } catch (error) {
    // Delete temp file if something went wrong
    if (tempFilePath) {
      await fs
        .unlink(tempFilePath)
        .catch((err) => console.error("Error deleting temp file:", err));
    }

    console.error("Error updating user profile:", error);
    throw new Error(error.message || "Unable to update profile");
  }
}
