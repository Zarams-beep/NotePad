import NoteData from "../../models/Note.js";

export async function togglePinNote(user_uuid, note_id) {
  if (!user_uuid || !note_id) {
    throw new Error("User ID and Note ID are required");
  }

  // Find note that belongs to user
  const note = await NoteData.findOne({
    where: { user_uuid, note_id },
  });

  if (!note) {
    throw new Error("Note not found or does not belong to user");
  }

  // Toggle pinned status
  note.pinned = !note.pinned;
  await note.save();

  return {
    message: note.pinned
      ? "Note pinned successfully"
      : "Note unpinned successfully",
    pinned: note.pinned,
  };
}
