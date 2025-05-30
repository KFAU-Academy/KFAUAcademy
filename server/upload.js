import multer from "multer";
import path from "path";

// Geçerli dosya türlerini kontrol et
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "video/mp4",
    "video/x-matroska",
    "video/quicktime"
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Geçersiz dosya türü!"));
  }
};

// Notlar için storage
const storageNotes = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/notes");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Videolar için storage
const storageVideos = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Duyurular için storage
const storageAnnouncements = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/announcements");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

//Upload middleware'ları
export const uploadNotes = multer({
    storage: storageNotes,
    fileFilter: fileFilter,
});

export const uploadVideos = multer({
    storage: storageVideos,
    fileFilter: fileFilter,
});


export const uploadAnnouncements = multer({
    storage: storageAnnouncements,
    fileFilter: fileFilter,
});