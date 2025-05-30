import express from 'express';
import { createNote, getAllNotes, getNote } from '../controllers/noteCntrl.js';
import { uploadNotes } from '../upload.js';

const router = express.Router();

router.post("/create", uploadNotes.single("note"), createNote)
router.get("/allnotes", getAllNotes)
router.get("/:id", getNote)

export {router as noteRoute}