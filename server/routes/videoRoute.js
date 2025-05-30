import express from 'express';
import { createVideo, deleteVideo, getAllVideos, getMyVideos, getVideo, updateVideo } from '../controllers/videoCntrl.js';
import { uploadVideo } from '../config/multerConfig.js';

const router = express.Router();

router.post('/create', uploadVideo.single('file'), createVideo);
router.put('/:id', uploadVideo.single('file'), updateVideo);
router.get('/allvideos', getAllVideos);
router.get('/:id', getVideo);
router.delete('/:id', deleteVideo); 
router.get('/myvideos', getMyVideos);

export { router as videoRoute };