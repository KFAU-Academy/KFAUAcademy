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

  // MyNotes'taki userEmail alma yöntemine uyumlu hale getirdim
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
          console.error("API cevabı dizi değil:", response.data);
          setUploadedVideos([]);
        }
      } catch (err) {
        console.error("Videolar çekilirken hata:", err);
        setUploadedVideos([]);
        alert("Videolar yüklenirken bir hata oluştu: " + err.message);
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
        alert("Lütfen bir video dosyası seçin.");
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
      console.error("Video işlem hatası:", err);
      alert("Video işlenirken bir hata oluştu: " + err.message);
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
      console.error("Video silme hatası:", err);
      alert("Video silinirken bir hata oluştu.");
    }
  };

  return (
    <div className="mn-wrapper">
      <Navbar />
      <div className="ma-main">
        <Sidebar />
        <main className="ma-container">
          <div className="ma-head flexStart">
            <span className="primaryText">Videolarım</span>
            <button
              className="flexStart add-button"
              onClick={() => setShowModal(true)}
            >
              <img
                src={greenAdd}
                alt="Video Ekle"
                title="Video Ekle"
                className="add-icon"
              />
              <span>Video Ekle</span>
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
                      alt="Video Simgesi"
                      className="mv-card-icon"
                    />
                    <h3>{video.courseName}</h3>
                    <p>{video.videoTitle}</p>
                    <div className="flexCenter mv-card-buttons">
                      <button
                        className="button2"
                        onClick={() => handleEdit(video.id)}
                      >
                        Düzenle
                      </button>
                      <button
                        className="button2"
                        onClick={() => handleDelete(video.id)}
                      >
                        Sil
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
                  <p>Henüz video bulunmamaktadır.</p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingVideoId ? "Videoyu Düzenle" : "Yeni Video Ekle"}</h3>
            <select
              value={courseName}
              onChange={handleCourseNameChange}
              className="input-field dropdown-field"
            >
              <option value="" disabled>
                Ders Seçin
              </option>
              {courseOptions.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
            {courseNameError && (
              <p className="mn-error-message">Ders adı gerekli.</p>
            )}
            <input
              type="text"
              placeholder="Video Başlığını Girin"
              value={videoTitle}
              onChange={handleVideoTitleChange}
              className="input-field"
            />
            {videoTitleError && (
              <p className="mn-error-message">Video başlığı gerekli.</p>
            )}
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="input-field"
            />
            <div className="modal-buttons">
              <button onClick={handleUpload} className="upload-button">
                {editingVideoId ? "Kaydet" : "Yükle"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingVideoId(null);
                }}
                className="notes-cancel-button"
              >
                İptal
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
