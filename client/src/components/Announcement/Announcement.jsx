import React from "react";
import "./Announcement.css";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import { sliderSettings } from "../../utils/common";
import { PuffLoader } from "react-spinners";
import useAnnouncements from "../../hooks/useAnnouncements";
import dayjs from "dayjs";

const Announcement = () => {
  const { data, isError, isLoading } = useAnnouncements();

  if (isError) {
    return (
      <div className="a-wrapper">
        <span>Error while fetching announcements</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="a-wrapper flexCenter" style={{ height: "60vh" }}>
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
    <div className="a-wrapper">
      <div className="paddings a-container">
        <div className="a-head flexColStart">
          <span className="primaryText">Announcements</span>
        </div>

        {data && data.length > 0 && (
          <Swiper {...sliderSettings}>
            <SliderButtons />
            {data.map((card) => {
              let iconSrc = "/course_icon.png"; // default icon
              if (card.category === "club") {
                iconSrc = "/club_icon.png";
              } else if (card.category === "note") {
                iconSrc = "/course_icon.png";
              } else if (card.category === "video") {
                iconSrc = "/course_icon.png";
              }

              return (
                <SwiperSlide key={card.id}>
                  <div className="flexColStart a-card">
                    <img
                      src={iconSrc}
                      alt="announcement"
                      className="ma-card-icon"
                    />
                    <span className="purpleText">{card.title}</span>
                    <span className="greenText">
                      {card.owner?.fullName || "Unknown"}
                    </span>
                    <span className="secondaryText a-category">
                      {card.category}
                    </span>
                    <span className="secondaryText a-date">
                      <span>
                        {dayjs(card.createdAt).format("DD/MM/YYYY HH:mm")}
                      </span>
                    </span>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
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
