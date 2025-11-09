import cache from "../../config/cache.js";
import NoteData from "../../models/Note.js";

export async function deleteUserNote(user_uuid, note_id){
     if (!user_uuid || !note_id) {
    throw new Error("User ID and Note ID are required");
  }

   // ✅ Find note owned by this user
  const note = await NoteData.findOne({
    where: { user_uuid, note_id },
  });
 if (!note) {
    throw new Error("Note not found or does not belong to user");
  }

  // ✅ Delete the note
  await note.destroy();

  // ✅ Clear cache for the user (so new fetch doesn’t return deleted note)
  if (cache && cache.redis) {
    await cache.del(`noteUser:${user_uuid}`);
  }

  return { message: "Note deleted successfully" };
  
}