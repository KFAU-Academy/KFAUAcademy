import express from 'express';
import { createVideo, getAllVideos, getVideo } from '../controllers/videoCntrl.js';
import { uploadVideos } from '../upload.js';

const router = express.Router();

router.post("/create", uploadVideos.single("video"), createVideo)
router.get("/allvideos", getAllVideos)
router.get("/:id", getVideo)

export {router as videoRoute}