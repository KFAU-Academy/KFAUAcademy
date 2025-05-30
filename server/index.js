import express from 'express';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path"; //static image(path) ler için
import { fileURLToPath } from 'url'; //__dirname için
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

//__dirname'i ES6(ES7)'da elde etmek için:
const __filename = fileURLToPath(import.meta.url); //bu dosyanın tam yolu
const __dirname = path.dirname(__filename); //dizin yolu

//İkonların olduğu static klasörü backend’te "static" route’u üzerinden sunalım:
const staticIconsPath = path.join("E:/education/university/projects/KFAUAcademy/client/public");
app.use('/static', express.static(staticIconsPath));


app.use('/api/user', userRoute);
app.use('/api/announcement', announcementRoute);
app.use('/api/video', videoRoute);
app.use('/api/note', noteRoute);

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});