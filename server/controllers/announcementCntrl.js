import asyncHandler from 'express-async-handler'
import { prisma } from '../config/prismaConfig.js'

export const createAnnouncement = asyncHandler(async (req, res)=>{
    const {category, title, content, image, userEmail} = req.body;

    //console.log(req.body.data);
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

// DELETE announcement
export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.announcement.delete({
      where: { id },
    });
    res.send({ message: "Announcement deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// EDIT/UPDATE announcement
export const updateAnnouncement = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { category, title, content } = req.body;

  try {
    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: {
        category,
        title,
        content,
      },
    });
    res.send({ message: "Announcement updated successfully", announcement: updatedAnnouncement });
  } catch (err) {
    res.status(500).send({ message: err.message });
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

//function to get my announcements
export const getMyAnnouncements = asyncHandler(async (req, res) => {
    const userEmail = req.query.email;

    if (!userEmail) {
        res.status(400).send({ message: "User email is required" });
        return;
    }

    const announcements = await prisma.announcement.findMany({
        where: {
            owner: {
                email: userEmail
            }
        },
        orderBy: { createdAt: "desc" }
    });
    res.send(announcements);
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