import asyncHandler from 'express-async-handler'
import { prisma } from '../config/prismaConfig.js'

export const createNote = asyncHandler(async (req, res) => {
    const courseName = req.body.courseName;
    const noteTitle = req.body.noteTitle;
    const userEmail = req.body.userEmail;
    const image = req.body.image || "note_icon.png";

    if (!req.file) {
        throw new Error('Lütfen bir not dosyası yükleyin');
    }

    const noteUrl = '/uploads/notes/' + req.file.filename;

    try {
        const note = await prisma.note.create({
            data: {
                courseName: courseName,
                noteTitle: noteTitle,
                noteUrl: noteUrl,
                image: image,
                owner: { connect: { email: userEmail } },
            },
        });
        res.status(201).json({ message: 'Not başarıyla oluşturuldu', note });
    } catch (err) {
        if (err.code === 'P2002') {
            throw new Error('Bu not zaten mevcut (noteUrl benzersiz olmalı)');
        }
        throw new Error(err.message);
    }
});

export const updateNote = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const courseName = req.body.courseName;
    const noteTitle = req.body.noteTitle;
    const image = req.body.image || "note_icon.png";
    let noteUrl = null;

    if (req.file) {
        noteUrl = '/uploads/notes/' + req.file.filename;
    }

    try {
        const updateData = {
            courseName: courseName,
            noteTitle: noteTitle,
            image: image,
        };

        if (noteUrl) {
            updateData.noteUrl = noteUrl;
        }

        const note = await prisma.note.update({
            where: { id: id },
            data: updateData,
        });
        res.json({ message: 'Not başarıyla güncellendi', note });
    } catch (err) {
        if (err.code === 'P2002') {
            throw new Error('Bu not zaten mevcut (noteUrl benzersiz olmalı)');
        }
        throw new Error(err.message);
    }
});

//function to delete notes
export const deleteNote = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.note.delete({
      where: { id },
    });
    res.json({ message: 'Not başarıyla silindi' });
  } catch (err) {
    res.status(500);
    throw new Error('Not silinirken hata oluştu: ' + err.message);
  }
});

//function to get all anoouncements
export const getAllNotes = asyncHandler(async (req, res)=>{
    const notes = await prisma.note.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
    res.send(notes)
}); 

//function get my notes
export const getMyNotes = asyncHandler(async (req, res) => {
  // req.user.email varsayıyoruz (auth middleware bunu set ediyor)
  const userEmail = req.user.email;

  if (!userEmail) {
    return res.status(401).json({ message: "Kullanıcı doğrulanamadı" });
  }

  const notes = await prisma.note.findMany({
    where: { owner: { email: userEmail } },
    orderBy: { createdAt: "desc" },
  });

  res.json(notes);
});

//function to get specific anoouncement
export const getNote = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    try {
        const note = await prisma.note.findUnique({
            where : {id}
        });
        res.send(note);
    } catch (err) {
        throw new Error(err.message);
    }
}); 