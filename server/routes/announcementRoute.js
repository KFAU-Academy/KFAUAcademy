import express from 'express';
import { createAnnouncement, getAllAnnouncements, getAnnouncement} from '../controllers/announcementCntrl.js';
// import { uploadAnnoucements } from '../upload.js';
const router = express.Router();

router.post("/create", createAnnouncement)
router.get("/allann", getAllAnnouncements)
router.get("/:id", getAnnouncement)

export {router as announcementRoute}