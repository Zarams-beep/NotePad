import express from "express";
import {
  createNoteController,
  getNoteController,
  searchNoteController,
  deleteNoteController,
  togglePinNoteController,
  toggleArchiveNoteController,
  shareNoteController,
  updateNoteController,
} from "../controller/noteController.js";
import { noteValidator } from "../utils/noteValidator.js";
import validationMiddleware from "../middleware/validationMiddleware.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post(
  "/notes",
  authMiddleware,
  validationMiddleware(noteValidator),
  createNoteController
);

router.get("/notes", authMiddleware, getNoteController);

router.put("/notes/:id", authMiddleware, updateNoteController);

router.delete("/notes/:id", authMiddleware, deleteNoteController);

router.get("/notes/search", authMiddleware, searchNoteController);

router.post("/share", authMiddleware, shareNoteController);

router.post("/toggle-archive", authMiddleware, toggleArchiveNoteController);

router.post("/toggle-pin", authMiddleware, togglePinNoteController);

export default router;
