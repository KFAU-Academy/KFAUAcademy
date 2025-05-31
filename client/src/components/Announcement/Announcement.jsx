import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Announcement.css";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import { sliderSettings } from "../../utils/common";
import { MdOutlineAnnouncement } from "react-icons/md";

const Announcement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isContentOpen, setContentOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  // Tüm duyuruları API'den çekme
  const fetchAllAnnouncements = async () => {
    try {
      const res = await axios.get("/api/announcement/allann");
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements", error);
    }
  };

  // Komponent yüklendiğinde duyuruları çek
  useEffect(() => {
    fetchAllAnnouncements();
  }, []);

  // Duyuru içeriğine tıklama
  const handleContentClick = (announcement) => {
    setSelectedContent(announcement);
    setContentOpen(true);
  };

  // Modal kapatma
  const closeModal = () => {
    setContentOpen(false);
    setSelectedContent(null);
  };

  return (
    <div className="a-wrapper">
      <div className="paddings a-container">
        <div className="a-head flexColStart">
          <span className="primaryText">Announcements</span>
        </div>

        <Swiper {...sliderSettings}>
          <SliderButtons />
          {announcements.map((card) => {
            let iconSrc = "/course_icon.png"; // Varsayılan ikon
            if (card.category === "club") {
              iconSrc = "/club_icon.png";
            } else if (card.category === "note") {
              iconSrc = "/course_icon.png";
            } else if (card.category === "video") {
              iconSrc = "/video_icon.png";
            }

            return (
              <SwiperSlide key={card.id}>
                <div className="flexColStart a-card">
                  <img src={iconSrc} alt="announcement" className="a-card-icon" />
                  <span className="purpleText">{card.title}</span>
                  <span className="greenText">{card.creator}</span>
                  <span className="secondaryText a-category">
                    {card.category}
                  </span>
                  <span className="secondaryText a-date">
                    <span>{new Date(card.date).toLocaleDateString()}</span>
                  </span>
                  <div className="flexCenter a-card-buttons">
                    <button
                      className="button2"
                      onClick={() => handleContentClick(card)}
                    >
                      <MdOutlineAnnouncement size={30} />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      {isContentOpen && (
        <>
          <div className="ma-modal-overlay" onClick={closeModal}></div>
          <div className="ma-content-modal">
            <div className="modal-header">
              <span>Announcement Content</span>
              <button onClick={closeModal}>X</button>
            </div>
            <div className="modal-body">
              <h3>{selectedContent.title}</h3>
              <p>
                <strong>Category:</strong> {selectedContent.category}
              </p>
              <p>
                <strong>Creator:</strong> {selectedContent.creator}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedContent.date).toLocaleDateString()}
              </p>
              <p>{selectedContent.content}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Announcement;

const SliderButtons = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter a-buttons">
      <button onClick={() => swiper.slidePrev()}>&lt;</button>
      <button onClick={() => swiper.slideNext()}>&gt;</button>
    </div>
  );
};