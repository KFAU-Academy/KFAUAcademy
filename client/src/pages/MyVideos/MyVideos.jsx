import React, { useState } from "react";
import "./MyVideos.css";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import greenAdd from "/green_add.png";
import { GiPlayButton } from "react-icons/gi";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import { sliderSettings } from "../../utils/common";

const MyVideos = () => {
  const [courseName, setCourseName] = useState("");
  const [videoName, setVideoName] = useState(""); // Video name state
  const [videoFile, setVideoFile] = useState(null);
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [courseNameError, setCourseNameError] = useState(false);
  const [videoNameError, setVideoNameError] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const courseOptions = [
    "Operating Systems",
    "Human-Computer Interaction",
    "Automata Theory and Formal Languages",
    "Modern Programming Languages",
  ];

  const handleCourseNameChange = (e) => {
    setCourseName(e.target.value);
    if (e.target.value.trim() !== "") {
      setCourseNameError(false);
    }
  };

  const handleVideoNameChange = (e) => {
    setVideoName(e.target.value);
    if (e.target.value.trim() !== "") {
      setVideoNameError(false);
    }
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (courseName.trim() === "" || videoName.trim() === "" || !videoFile) {
      if (courseName.trim() === "") setCourseNameError(true);
      if (videoName.trim() === "") setVideoNameError(true);
      if (!videoFile) alert("Please select a video file.");
      return;
    }

    const fileURL = URL.createObjectURL(videoFile);
    const newVideo = {
      id: uploadedVideos.length + 1,
      courseName,
      videoName,
      fileName: videoFile.name,
      fileURL,
    };

    setUploadedVideos([...uploadedVideos, newVideo]);
    setCourseName("");
    setVideoName("");
    setVideoFile(null);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setUploadedVideos(uploadedVideos.filter((video) => video.id !== id));
  };

  const handleEdit = (id) => {
    const videoToEdit = uploadedVideos.find((video) => video.id === id);
    setEditingVideo({ ...videoToEdit }); // Clone the video to edit
    setShowModal(true);
  };

  const handleEditSave = () => {
    setUploadedVideos(
      uploadedVideos.map((video) =>
        video.id === editingVideo.id ? { ...editingVideo } : video
      )
    );
    setEditingVideo(null);
    setShowModal(false);
  };

  return (
    <section className="mv-wrapper">
      <Navbar />

      <div className="ma-main">
        <Sidebar />

        {/* Ana İçerik */}
        <main className="ma-container">
          {/* Head Kısmı */}
          <div className="ma-head flexStart">
            <span className="primaryText">My Videos</span>
            <button
              className="flexStart add-button"
              onClick={() => setShowModal(true)}
            >
              <img
                src={greenAdd}
                alt="Add Videos"
                title="Add Videos"
                className="add-icon"
              />
              <span>Add Videos</span>
            </button>
          </div>

          {/* Kart Kısmı */}
          <Swiper {...sliderSettings}>
            <SliderButtons />
            {uploadedVideos.map((video) => (
              <SwiperSlide key={video.id}>
                <div className="flexColStart mv-card">
                  <img
                    src="/video_icon.png"
                    alt="Video Simgesi"
                    className="mv-card-icon"
                  />
                  <h3>{video.courseName}</h3>
                  <p>{video.videoName}</p>
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
                      onClick={() => window.open(video.fileURL, "_blank")}
                    >
                      <GiPlayButton size={30} />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </main>
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="mv-modal-overlay">
          <div className="mv-modal-content">
            <h3>{editingVideo ? "Edit Video" : "Add New Video"}</h3>
            {/* Course Name Input */}
            <select
              value={editingVideo ? editingVideo.courseName : courseName}
              onChange={(e) =>
                editingVideo
                  ? setEditingVideo({
                      ...editingVideo,
                      courseName: e.target.value,
                    })
                  : handleCourseNameChange(e)
              }
              className="mv-input-field"
            >
              <option value="">Select a Course</option>
              {courseOptions.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
            {courseNameError && !editingVideo && (
              <p className="mv-error-message">Course name is required.</p>
            )}

            {/* Video Name Input */}
            <input
              type="text"
              placeholder="Enter Video Name"
              value={editingVideo ? editingVideo.videoName : videoName}
              onChange={(e) =>
                editingVideo
                  ? setEditingVideo({
                      ...editingVideo,
                      videoName: e.target.value,
                    })
                  : handleVideoNameChange(e)
              }
              className="mv-input-field"
            />
            {videoNameError && !editingVideo && (
              <p className="mv-error-message">Video name is required.</p>
            )}

            {/* File Input */}
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                if (editingVideo) {
                  const file = e.target.files[0];
                  const fileURL = URL.createObjectURL(file);
                  setEditingVideo({
                    ...editingVideo,
                    fileName: file.name,
                    fileURL,
                  });
                } else {
                  handleFileChange(e);
                }
              }}
              className="mv-input-field"
            />

            <div className="mv-modal-buttons">
              {editingVideo ? (
                <>
                  <button onClick={handleEditSave} className="mv-upload-button">
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingVideo(null);
                      setShowModal(false);
                    }}
                    className="mv-videos-cancel-button"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button onClick={handleUpload} className="mv-upload-button">
                    Upload
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="mv-videos-cancel-button"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyVideos;

const SliderButtons = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter ma-buttons">
      <button onClick={() => swiper.slidePrev()}>&lt;</button>
      <button onClick={() => swiper.slideNext()}>&gt;</button>
    </div>
  );
};
