import cache from "../../config/cache.js";
import NoteData from "../../models/Note.js";

// Update a user's specific note
export async function updateUserNote(user_uuid, note_id, requestData) {
  if (!user_uuid || !note_id) {
    throw new Error("User ID and Note ID are required");
  }

  // ✅ Find note owned by this user
  const note = await NoteData.findOne({
    where: { user_uuid, note_id },
  });

  if (!note) throw new Error("Note not found or does not belong to user");

  // ✅ Update allowed fields only
  const allowedFields = ["title", "content", "color", "pinned"];
  for (const key of Object.keys(requestData)) {
    if (allowedFields.includes(key)) {
      note[key] = requestData[key];
    }
  }

  // ✅ Save updates
  await note.save();

  // ✅ Clear cached notes so next fetch is fresh
  if (cache && cache.redis) {
    await cache.del(`noteUser:${user_uuid}`);
  }

  return note;
}
