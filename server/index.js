import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { userRoute } from './routes/userRoute.js';
import { announcementRoute } from './routes/announcementRoute.js';
import { videoRoute } from './routes/videoRoute.js';
import { noteRoute } from './routes/noteRoute.js';

dotenv.config()

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});

app.use('/api/user', userRoute);
app.use('/api/announcement', announcementRoute);
app.use('/api/video', videoRoute);
app.use('/api/note', noteRoute);