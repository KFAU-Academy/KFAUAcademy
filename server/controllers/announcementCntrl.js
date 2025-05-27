import asyncHandler from 'express-async-handler'
import { prisma } from '../config/prismaConfig.js'

export const createAnnouncement = asyncHandler(async (req, res)=>{
    const {category, title, content, image, userEmail} = req.body.data;

    console.log(req.body.data);
    try {
        const announcement = await prisma.announcement.create({
            data:{
                category, 
                title, 
                content, 
                image,
                owner: {connect: {email: userEmail}}
            },
        });
        res.send({message: "Announcement created succesfully", announcement});
    } catch (err) {
        if(err.code === "P2002"){
            throw new Error("An announcement with this title already exists. ")
        }
        throw new Error(err.message)
    }
});

//function to get all anoouncements
export const getAllAnnouncements = asyncHandler(async (req, res)=>{
    const announcements = await prisma.announcement.findMany({
        orderBy: {
            createdAt: "desc"
        }
    });
    res.send(announcements)
}); 

//function to get specific anoouncement
export const getAnnouncement = asyncHandler(async (req, res)=>{
    const {id} = req.params;
    try {
        const announcement = await prisma.announcement.findUnique({
            where : {id}
        });
        res.send(announcement);
    } catch (err) {
        throw new Error(err.message);
    }
}); 