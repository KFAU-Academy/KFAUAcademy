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

const MyVideos = function () {
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

  const getUserEmailFromToken = function () {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.email;
    } catch (err) {
      console.error("Token çözümleme hatası:", err);
      return null;
    }
  };

  const userEmail = getUserEmailFromToken();

  useEffect(
    function () {
      const fetchVideos = async function () {
        try {
          const response = await axios.get("/api/video/allvideos", {
            params: { userEmail: userEmail },
          });
          setUploadedVideos(response.data);
        } catch (err) {
          console.error("Videolar çekilirken hata:", err);
          alert("Videolar yüklenirken bir hata oluştu.");
        }
      };
      if (userEmail) {
        fetchVideos();
      }
    },
    [userEmail]
  );

  const handleCourseNameChange = function (e) {
    setCourseName(e.target.value);
    if (e.target.value.trim() !== "") {
      setCourseNameError(false);
    }
  };

  const handleVideoTitleChange = function (e) {
    setVideoTitle(e.target.value);
    if (e.target.value.trim() !== "") {
      setVideoTitleError(false);
    }
  };

  const handleFileChange = function (e) {
    setVideoFile(e.target.files[0]);
  };

  const handleUpload = async function () {
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
          uploadedVideos.map(function (video) {
            return video.id === editingVideoId ? response.data.video : video;
          })
        );
      } else {
        const response = await axios.post("/api/video/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUploadedVideos([response.data.video].concat(uploadedVideos));
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

  const handleEdit = function (id) {
    const videoToEdit = uploadedVideos.find(function (video) {
      return video.id === id;
    });
    setCourseName(videoToEdit.courseName);
    setVideoTitle(videoToEdit.videoTitle);
    setEditingVideoId(id);
    setShowModal(true);
  };

  const handleDelete = async function (id) {
    try {
      await axios.delete("/api/video/" + id);
      setUploadedVideos(
        uploadedVideos.filter(function (video) {
          return video.id !== id;
        })
      );
    } catch (err) {
      console.error("Video silme hatası:", err);
      alert("Video silinirken bir hata oluştu.");
    }
  };

  return (
    <section className="mv-wrapper">
      <Navbar />
      <div className="ma-main">
        <Sidebar />
        <main className="ma-container">
          <div className="ma-head flexStart">
            <span className="primaryText">Videolarım</span>
            <button
              className="flexStart add-button"
              onClick={function () {
                setShowModal(true);
              }}
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
            {uploadedVideos.map(function (video) {
              return (
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
                        onClick={function () {
                          handleEdit(video.id);
                        }}
                      >
                        Düzenle
                      </button>
                      <button
                        className="button2"
                        onClick={function () {
                          handleDelete(video.id);
                        }}
                      >
                        Sil
                      </button>
                      <button
                        className="flexCenter button2"
                        onClick={function () {
                          window.open(video.videoUrl, "_blank");
                        }}
                      >
                        <GiPlayButton size={30} />
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </main>
      </div>

      {showModal && (
        <div className="mv-modal-overlay">
          <div className="mv-modal-content">
            <h3>{editingVideoId ? "Videoyu Düzenle" : "Yeni Video Ekle"}</h3>
            <select
              value={courseName}
              onChange={handleCourseNameChange}
              className="mv-input-field"
            >
              <option value="">Ders Seçin</option>
              {courseOptions.map(function (course, index) {
                return (
                  <option key={index} value={course}>
                    {course}
                  </option>
                );
              })}
            </select>
            {courseNameError && (
              <p className="mv-error-message">Ders adı gerekli.</p>
            )}
            <input
              type="text"
              placeholder="Video Başlığını Girin"
              value={videoTitle}
              onChange={handleVideoTitleChange}
              className="mv-input-field"
            />
            {videoTitleError && (
              <p className="mv-error-message">Video başlığı gerekli.</p>
            )}
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="mv-input-field"
            />
            <div className="mv-modal-buttons">
              <button onClick={handleUpload} className="mv-upload-button">
                {editingVideoId ? "Kaydet" : "Yükle"}
              </button>
              <button
                onClick={function () {
                  setShowModal(false);
                  setEditingVideoId(null);
                }}
                className="mv-videos-cancel-button"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const SliderButtons = function () {
  const swiper = useSwiper();
  return (
    <div className="flexCenter ma-buttons">
      <button
        onClick={function () {
          swiper.slidePrev();
        }}
      >
        &lt;
      </button>
      <button
        onClick={function () {
          swiper.slideNext();
        }}
      >
        &gt;
      </button>
    </div>
  );
};

export default MyVideos;
