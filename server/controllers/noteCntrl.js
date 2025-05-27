import asyncHandler from 'express-async-handler'
import { prisma } from '../config/prismaConfig.js'

export const createNote = asyncHandler(async (req, res)=>{
    const {courseName, noteTitle, noteUrl, image, userEmail} = req.body.data;

    console.log(req.body.data);
    try {
        const note = await prisma.note.create({
            data:{
                courseName, 
                noteTitle, 
                noteUrl,
                image, 
                owner: {connect: {email: userEmail}}
            },
        });
        res.send({message: "Note created succesfully", note});
    } catch (err) {
        if(err.code === "P2002"){
            throw new Error("This note is already exist. ")
        }
        throw new Error(err.message)
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