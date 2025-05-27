import axios from 'axios';
import dayjs from 'dayjs';
import {toast} from 'react-toastify';

export const api = axios.create({
    baseURL: "http://localhost:8000/api"
});

export const getAllVideos = async()=>{
    try {
        const response = await api.get("video/allvideos", {
            timeout: 10*1000,
        });

        if(response.status === 400 || response.status === 500){
            throw response.data;
        }
        return response.data;
    } catch (error) {
        toast.error("Something went wrong")
        throw error
    }
}

export const getAllNotes = async()=>{
    try {
        const response = await api.get("note/allnotes", {
            timeout: 10*1000,
        });

        if(response.status === 400 || response.status === 500){
            throw response.data;
        }
        return response.data;
    } catch (error) {
        toast.error("Something went wrong")
        throw error
    }
}