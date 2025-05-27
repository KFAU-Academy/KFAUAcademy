import express from 'express';
import { createNote, getAllNotes, getNote } from '../controllers/noteCntrl.js';

const router = express.Router();

router.post("/create", createNote)
router.get("/allnotes", getAllNotes)
router.get("/:id", getNote)

export {router as noteRoute}