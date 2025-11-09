import cache from "../../config/cache.js";
import NoteData from "../../models/Note.js";

// Get all notes for a specific user
export async function getUserNotes(user_uuid) {
  if (!user_uuid) throw new Error("User ID is required");

  // Check cache first
  if (cache && cache.redis) {
    const cachedNotes = await cache.get(`noteUser:${user_uuid}`);
    if (cachedNotes) {
      return JSON.parse(cachedNotes);
    }
  }

  // Fetch notes from database
  const notes = await NoteData.findAll({
    where: { user_uuid },
    order: [
      ["pinned", "DESC"],
      ["updatedAt", "DESC"],
    ],
  });

  // If no notes exist, return empty array (not error)
  if (!notes || notes.length === 0) {
    console.log("No notes found, returning empty array"); // Debug
    return [];
  }

  // Store in cache for 1 hour (3600s)
  if (cache && cache.redis) {
    await cache.set(`noteUser:${user_uuid}`, JSON.stringify(notes), 3600);
  }

  return notes;
}
