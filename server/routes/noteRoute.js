import express from 'express';
import { createNote, deleteNote, getAllNotes, getNote, updateNote } from '../controllers/noteCntrl.js';
import { uploadNote } from '../config/multerConfig.js'; // uploadNote import ediliyor

const router = express.Router();

router.post('/create', uploadNote.single('file'), createNote);
router.get('/allnotes', getAllNotes);
router.get('/:id', getNote);
router.put('/:id', uploadNote.single('file'), updateNote);
router.delete('/:id', deleteNote); 

export { router as noteRoute };