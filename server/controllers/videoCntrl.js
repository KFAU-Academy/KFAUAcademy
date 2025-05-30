import asyncHandler from 'express-async-handler'
import { prisma } from '../config/prismaConfig.js'

export const createVideo = asyncHandler(async (req, res) => {
    const courseName = req.body.courseName;
    const videoTitle = req.body.videoTitle;
    const userEmail = req.body.userEmail;
    const image = req.body.image || "video_icon.png";

    if (!req.file) {
        throw new Error('Lütfen bir video dosyası yükleyin');
    }

    const videoUrl = '/uploads/videos/' + req.file.filename;

    if (!courseName || !videoTitle || !userEmail) {
        throw new Error('courseName, videoTitle ve userEmail alanları zorunludur');
    }

    try {
        const video = await prisma.video.create({
            data: {
                courseName: courseName,
                videoTitle: videoTitle,
                videoUrl: videoUrl,
                image: image,
                owner: { connect: { email: userEmail } },
            },
        });
        res.status(201).json({ message: 'Video başarıyla oluşturuldu', video });
    } catch (err) {
        if (err.code === 'P2002') {
            throw new Error('Bu video zaten mevcut (videoUrl benzersiz olmalı)');
        }
        throw new Error(err.message);
    }
});

export const updateVideo = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const courseName = req.body.courseName;
    const videoTitle = req.body.videoTitle;
    const userEmail = req.body.userEmail;
    const image = req.body.image || "video_icon.png";
    let videoUrl = null;

    if (req.file) {
        videoUrl = '/uploads/videos/' + req.file.filename;
    }

    if (!courseName || !videoTitle || !userEmail) {
        throw new Error('courseName, videoTitle ve userEmail alanları zorunludur');
    }

    try {
        const updateData = {
            courseName: courseName,
            videoTitle: videoTitle,
            image: image,
        };

        if (videoUrl) {
            updateData.videoUrl = videoUrl;
        }

        const video = await prisma.video.update({
            where: { id: id },
            data: updateData,
        });
        res.json({ message: 'Video başarıyla güncellendi', video });
    } catch (err) {
        if (err.code === 'P2002') {
            throw new Error('Bu video zaten mevcut (videoUrl benzersiz olmalı)');
        }
        throw new Error(err.message);
    }
});

//function to delete videos
export const deleteVideo = asyncHandler(async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.video.delete({
      where: { id },
    });
    res.json({ message: 'Video başarıyla silindi' });
  } catch (err) {
    res.status(500);
    throw new Error('Video silinirken hata oluştu: ' + err.message);
  }
});

//function get my videos
export const getMyVideos = asyncHandler(async (req, res) => {
  // req.user.email varsayıyoruz (auth middleware bunu set ediyor)
  const userEmail = req.user.email;

  if (!userEmail) {
    return res.status(401).json({ message: "Kullanıcı doğrulanamadı" });
  }

  const videos = await prisma.video.findMany({
    where: { owner: { email: userEmail } },
    orderBy: { createdAt: "desc" },
  });

  res.json(videos);
});

//function to get all anoouncements
export const getAllVideos = asyncHandler(async (req, res)=>{
    const videos = await prisma.video.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
    res.send(videos)
}); 

//function to get specific anoouncement
export const getVideo = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    try {
        const video = await prisma.video.findUnique({
            where : {id}
        });
        res.send(video);
    } catch (err) {
        throw new Error(err.message);
    }
}); 