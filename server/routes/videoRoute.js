import express from 'express';
import { createVideo, getAllVideos, getVideo } from '../controllers/videoCntrl.js';

const router = express.Router();

router.post("/create", createVideo)
router.get("/allvideos", getAllVideos)
router.get("/:id", getVideo)

export {router as videoRoute}