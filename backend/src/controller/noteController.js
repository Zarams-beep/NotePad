import { createNote } from "../services/notes/createNote.js";
import { deleteUserNote } from "../services/notes/deleteNote.js";
import { getUserNotes } from "../services/notes/getNote.js";
import { searchNotes } from "../services/notes/searchNotes.js";
import { shareNoteService } from "../services/notes/shareNoteService.js";
import { toggleArchiveNote } from "../services/notes/toggleArchiveNote.js";
import { togglePinNote } from "../services/notes/togglePinNote.js";
import { updateUserNote } from "../services/notes/updateNote.js";
import AppError from "../utils/AppError.js";

async function createNoteController(req, res, next) {
  try {
    const { title, content, color, pinned } = req.body;
    const user_uuid = req.user.user_uuid;

    const newNote = await createNote({
      title,
      content,
      color,
      pinned,
      user_uuid,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: newNote,
    });
  } catch (error) {
    next(new AppError(error.message || "Note creation failed", 400));
  }
}

async function updateNoteController(req, res, next) {
  try {
    const { id: note_id } = req.params;
    const requestData = req.body;
    const user_uuid = req.user.user_uuid;
    const notes = await updateUserNote(user_uuid, note_id, requestData);

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: notes,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to update note", 500));
  }
}

async function getNoteController(req, res, next) {
  try {
    const user_uuid = req.user.user_uuid;
    const notes = await getUserNotes(user_uuid);

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to fetch notes", 500));
  }
}

async function searchNoteController(req, res, next) {
  try {
    const { keyword } = req.query;
    const user_uuid = req.user.user_uuid;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required",
      });
    }

    const notes = await searchNotes(user_uuid, keyword);

    res.status(200).json({
      success: true,
      data: notes,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to search notes", 500));
  }
}

async function deleteNoteController(req, res, next) {
  try {
    const { id: note_id } = req.params;
    const user_uuid = req.user.user_uuid;
    const notes = await deleteUserNote(user_uuid, note_id);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
      data: notes,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to delete notes", 500));
  }
}

async function togglePinNoteController(req, res, next) {
  try {
    const { note_id } = req.body;
    const user_uuid = req.user.user_uuid;
    const notes = await togglePinNote(user_uuid, note_id);

    res.status(200).json({
      success: true,
      message: "Note pin toggled successfully",
      data: notes,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to toggle pin", 500));
  }
}

async function toggleArchiveNoteController(req, res, next) {
  try {
    const { note_id } = req.body;
    const user_uuid = req.user.user_uuid;
    const notes = await toggleArchiveNote(user_uuid, note_id);

    res.status(200).json({
      success: true,
      message: "Note archive toggled successfully",
      data: notes,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to toggle archive", 500));
  }
}

async function shareNoteController(req, res, next) {
  try {
    const { note_id, receiver_uuid, permission } = req.body;
    const sender_uuid = req.user.user_uuid; // From token!

    const notes = await shareNoteService({
      note_id,
      sender_uuid,
      receiver_uuid,
      permission,
    });

    res.status(200).json({
      success: true,
      message: "Note shared successfully",
      data: notes,
    });
  } catch (error) {
    next(new AppError(error.message || "Failed to share note", 400));
  }
}

export {
  createNoteController,
  getNoteController,
  searchNoteController,
  deleteNoteController,
  togglePinNoteController,
  toggleArchiveNoteController,
  shareNoteController,
  updateNoteController,
};
