//services/notes/createNote.js

import NoteData from "../../models/Note.js";

//create note
export async function createNote(noteData) {
  const noteTitle = noteData.title;
  const noteContent = noteData.content;
  //validate required fields
  if (!noteTitle || !noteContent) {
    throw new Error("Title and content are required");
  }

  //limit title length
  if (noteTitle.length > 100) {
    throw new Error("Title is too long");
  }

  //no empty cells
  if (!noteTitle.trim() || !noteContent.trim()) {
    throw new Error("Title and content cannot be empty");
  }

  //check for existing title
  const existingNote = await NoteData.findOne({
    where: { title: noteTitle, user_uuid: noteData.user_uuid },
  });

  if (existingNote) {
    throw new Error("Note title already exists for this user");
  }

  const newNote = await NoteData.create({
    title: noteData.title.trim(),
    content: noteData.content.trim(),
    color: noteData.color || "#FFFFFF",
    pinned: noteData.pinned || false,
    user_uuid: noteData.user_uuid,
  });

  return newNote;
}
