import asyncHandler from 'express-async-handler'
import { prisma } from '../config/prismaConfig.js'

export const createVideo = asyncHandler(async (req, res)=>{
    const {courseName, videoTitle, image,userEmail} = req.body.data;
    const videoUrl = req.file.path;

    console.log(req.body.data);
    try {
        const video = await prisma.video.create({
            data:{
                courseName, 
                videoTitle, 
                videoUrl, 
                image,
                owner: {connect: {email: userEmail}}
            },
        });
        res.send({message: "video created succesfully", video});
    } catch (err) {
        if(err.code === "P2002"){
            throw new Error("This video is already exist. ")
        }
        throw new Error(err.message)
    }
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