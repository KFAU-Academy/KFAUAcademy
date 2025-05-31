import React, { useState, useEffect } from "react";
import "./Favorites.css";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import { sliderSettings } from "../../utils/common";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";
import useVideos from "../../hooks/useVideos";
import useNotes from "../../hooks/useNotes";
import { PuffLoader } from "react-spinners";
import { truncate } from "lodash";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: videos, isError: isVideoError, isLoading: isVideoLoading } = useVideos();
  const { data: notes, isError: isNoteError, isLoading: isNoteLoading } = useNotes();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserEmail = user.email || "";

  // Favori videoları ve notları çekme
  const fetchFavorites = async () => {
    try {
      const [videoFavsRes, noteFavsRes] = await Promise.all([
        axios.post("/api/user/allVideoFavs", { email: currentUserEmail }),
        axios.post("/api/user/allNoteFavs", { email: currentUserEmail }),
      ]);

      const favVideoIds = videoFavsRes.data.favVideosID || [];
      const favNoteIds = noteFavsRes.data.favNotesID || [];

      // Videoları ve notları ID'lere göre filtrele
      const favVideos = videos ? videos.filter((video) => favVideoIds.includes(video.id)) : [];
      const favNotes = notes ? notes.filter((note) => favNoteIds.includes(note.id)) : [];

      // Videoları ve notları birleştir
      const combinedFavorites = [
        ...favVideos.map((video) => ({
          id: video.id,
          type: "video",
          image: video.image || "/video_icon.png",
          title: video.videoTitle,
          creator: video.userEmail.split("@")[0],
          date: video.createdAt,
          courseName: video.courseName,
        })),
        ...favNotes.map((note) => ({
          id: note.id,
          type: "note",
          image: note.image || "/note_icon.png",
          title: note.noteTitle,
          creator: note.userEmail.split("@")[0],
          date: note.createdAt,
          courseName: note.courseName,
        })),
      ];

      setFavorites(combinedFavorites);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching favorites", error);
      setIsLoading(false);
    }
  };

  // Favori videoyu veya notu favorilerden çıkarma
  const handleToggleFavorite = async (id, type) => {
    try {
      if (type === "video") {
        await axios.post(`/api/user/toFavVideo/${id}`, { email: currentUserEmail });
      } else if (type === "note") {
        await axios.post(`/api/user/toFavNote/${id}`, { email: currentUserEmail });
      }
      // Favori listesinden öğeyi çıkar
      setFavorites((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error toggling favorite", error);
    }
  };

  useEffect(() => {
    if (!isVideoLoading && !isNoteLoading) {
      fetchFavorites();
    }
  }, [isVideoLoading, isNoteLoading, videos, notes]);

  if (isVideoError || isNoteError) {
    return (
      <div className="wrapper">
        <span>Error while fetching favorites</span>
      </div>
    );
  }

  if (isLoading || isVideoLoading || isNoteLoading) {
    return (
      <div className="wrapper flexCenter" style={{ height: "60vh" }}>
        <PuffLoader
          height="80"
          width="80"
          radius={1}
          color="#b6306c"
          aria-label="puff-loading"
        />
      </div>
    );
  }

  return (
    <section className="f-wrapper">
      <Navbar />
      <div className="f-main">
        <Sidebar />
        <main className="f-container">
          <div className="f-head flexColStart">
            <span className="primaryText">Favorites</span>
          </div>

          <Swiper {...sliderSettings}>
            <SliderButtons />
            {favorites.length > 0 ? (
              favorites.map((card, i) => (
                <SwiperSlide key={`${card.type}-${card.id}`}>
                  <div className="flexColStart f-card">
                    <button
                      className="flexCenter button2"
                      onClick={() => handleToggleFavorite(card.id, card.type)}
                    >
                      <AiFillHeart size={30} color="#c40a5d" />
                    </button>
                    <img
                      src={card.image}
                      alt={card.type}
                      onError={(e) => (e.target.src = card.type === "video" ? "/video_icon.png" : "/note_icon.png")}
                    />
                    <span className="purpleText">{truncate(card.title, { length: 30 })}</span>
                    <span className="greenText">{card.creator}</span>
                    <span className="secondaryText f-date">
                      <span>{new Date(card.date).toLocaleDateString()}</span>
                    </span>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <p>No favorites found.</p>
              </SwiperSlide>
            )}
          </Swiper>
        </main>
      </div>
    </section>
  );
};

export default Favorites;

const SliderButtons = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter f-buttons">
      <button onClick={() => swiper.slidePrev()}>&lt;</button>
      <button onClick={() => swiper.slideNext()}>&gt;</button>
    </div>
  );
};