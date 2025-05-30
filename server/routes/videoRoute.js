import express from 'express';
import { createVideo, getAllVideos, getVideo, updateVideo } from '../controllers/videoCntrl.js';
import { uploadVideo } from '../config/multerConfig.js';

const router = express.Router();

router.post('/create', uploadVideo.single('file'), createVideo);
router.put('/:id', uploadVideo.single('file'), updateVideo);
router.get('/allvideos', getAllVideos);
router.get('/:id', getVideo);

export { router as videoRoute };