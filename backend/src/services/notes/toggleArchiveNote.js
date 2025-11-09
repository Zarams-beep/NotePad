import NoteData from "../../models/Note.js";

export async function toggleArchiveNote(user_uuid, note_id) {
  if (!user_uuid || !note_id) {
    throw new Error("User ID and Note ID are required");
  }

  const note = await NoteData.findOne({
    where: { user_uuid, note_id },
  });

  if (!note) {
    throw new Error("Note not found or does not belong to user");
  }

  // Toggle archived status
  note.archived = !note.archived;
  await note.save();

  return {
    message: note.archived
      ? "Note archived successfully"
      : "Note unarchived successfully",
    archived: note.archived,
  };
}
