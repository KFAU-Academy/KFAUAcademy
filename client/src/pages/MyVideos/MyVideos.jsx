import React, { useState, useEffect } from "react";
import "./MyVideos.css";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import greenAdd from "/green_add.png";
import { GiPlayButton } from "react-icons/gi";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import { sliderSettings } from "../../utils/common";
import axios from "axios";

const MyVideos = () => {
  const [courseName, setCourseName] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [courseNameError, setCourseNameError] = useState(false);
  const [videoTitleError, setVideoTitleError] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState(null);

  const courseOptions = [
    "Operating Systems",
    "Human-Computer Interaction",
    "Automata Theory and Formal Languages",
    "Modern Programming Languages",
  ];

  // Adapted to MyNotes' way of getting userEmail
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userEmail = user.email || "";

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("/api/video/allvideos", {
          params: { userEmail },
        });
        if (Array.isArray(response.data)) {
          setUploadedVideos(response.data);
        } else {
          console.error("API response is not an array:", response.data);
          setUploadedVideos([]);
        }
      } catch (err) {
        console.error("Error fetching videos:", err);
        setUploadedVideos([]);
        alert("An error occurred while loading videos: " + err.message);
      }
    };
    if (userEmail) {
      fetchVideos();
    }
  }, [userEmail]);

  const handleCourseNameChange = (e) => {
    setCourseName(e.target.value);
    if (e.target.value.trim() !== "") {
      setCourseNameError(false);
    }
  };

  const handleVideoTitleChange = (e) => {
    setVideoTitle(e.target.value);
    if (e.target.value.trim() !== "") {
      setVideoTitleError(false);
    }
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (
      courseName.trim() === "" ||
      videoTitle.trim() === "" ||
      (!videoFile && !editingVideoId)
    ) {
      if (courseName.trim() === "") setCourseNameError(true);
      if (videoTitle.trim() === "") setVideoTitleError(true);
      if (!videoFile && !editingVideoId)
        alert("Please select a video file.");
      return;
    }

    const formData = new FormData();
    formData.append("courseName", courseName);
    formData.append("videoTitle", videoTitle);
    formData.append("userEmail", userEmail);
    if (videoFile) {
      formData.append("file", videoFile);
    }

    try {
      if (editingVideoId) {
        const response = await axios.put(
          "/api/video/" + editingVideoId,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        setUploadedVideos(
          uploadedVideos.map((video) =>
            video.id === editingVideoId ? response.data.video : video
          )
        );
      } else {
        const response = await axios.post("/api/video/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUploadedVideos([response.data.video, ...uploadedVideos]);
      }

      setCourseName("");
      setVideoTitle("");
      setVideoFile(null);
      setShowModal(false);
      setEditingVideoId(null);
    } catch (err) {
      console.error("Video processing error:", err);
      alert("An error occurred while processing the video: " + err.message);
    }
  };

  const handleEdit = (id) => {
    const videoToEdit = uploadedVideos.find((video) => video.id === id);
    setCourseName(videoToEdit.courseName);
    setVideoTitle(videoToEdit.videoTitle);
    setEditingVideoId(id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("/api/video/" + id);
      setUploadedVideos(uploadedVideos.filter((video) => video.id !== id));
    } catch (err) {
      console.error("Error deleting video:", err);
      alert("An error occurred while deleting the video.");
    }
  };

  return (
    <div className="mn-wrapper">
      <Navbar />
      <div className="ma-main">
        <Sidebar />
        <main className="ma-container">
          <div className="ma-head flexStart">
            <span className="primaryText">My Videos</span>
            <button
              className="flexStart add-button"
              onClick={() => setShowModal(true)}
            >
              <img
                src={greenAdd}
                alt="Add Video"
                title="Add Video"
                className="add-icon"
              />
              <span>Add Video</span>
            </button>
          </div>

          <Swiper {...sliderSettings}>
            <SliderButtons />
            {Array.isArray(uploadedVideos) && uploadedVideos.length > 0 ? (
              uploadedVideos.map((video) => (
                <SwiperSlide key={video.id}>
                  <div className="flexColStart mv-card">
                    <img
                      src={video.image || "/video_icon.png"}
                      alt="Video Icon"
                      className="mv-card-icon"
                    />
                    <h3>{video.courseName}</h3>
                    <p>{video.videoTitle}</p>
                    <div className="flexCenter mv-card-buttons">
                      <button
                        className="button2"
                        onClick={() => handleEdit(video.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="button2"
                        onClick={() => handleDelete(video.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="flexCenter button2"
                        onClick={() => {
                          const baseUrl = "http://localhost:8000";
                          const videoUrl = video.videoUrl.startsWith("http")
                            ? video.videoUrl
                            : baseUrl + video.videoUrl;
                          window.open(videoUrl, "_blank");
                        }}
                      >
                        <GiPlayButton size={30} />
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="flexColStart mv-card">
                  <p>No videos yet.</p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingVideoId ? "Edit Video" : "Add New Video"}</h3>
            <select
              value={courseName}
              onChange={handleCourseNameChange}
              className="input-field dropdown-field"
            >
              <option value="" disabled>
                Select a Course
              </option>
              {courseOptions.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
            {courseNameError && (
              <p className="mn-error-message">Course name is required.</p>
            )}
            <input
              type="text"
              placeholder="Enter Video Title"
              value={videoTitle}
              onChange={handleVideoTitleChange}
              className="input-field"
            />
            {videoTitleError && (
              <p className="mn-error-message">Video title is required.</p>
            )}
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="input-field"
            />
            <div className="modal-buttons">
              <button onClick={handleUpload} className="upload-button">
                {editingVideoId ? "Save" : "Upload"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingVideoId(null);
                }}
                className="notes-cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SliderButtons = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter ma-buttons">
      <button onClick={() => swiper.slidePrev()}>&lt;</button>
      <button onClick={() => swiper.slideNext()}>&gt;</button>
    </div>
  );
};

export default MyVideos;
