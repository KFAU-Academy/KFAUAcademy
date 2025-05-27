import React from "react";
import "./Announcement.css";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import data from "../../utils/slider.json";
import { sliderSettings } from "../../utils/common";

const Announcement = () => {
  return (
    <div className="a-wrapper">
      <div className="paddings a-container">
        <div className="a-head flexColStart">
          <span className="primaryText">Announcements</span>
        </div>

        <Swiper {...sliderSettings}>
          <SliderButtons />
          {data.map((card, i) => (
            <SwiperSlide key={i}>
              <div className="flexColStart a-card">
                <img src={card.image} alt="home" />

                <span className="purpleText">{card.title}</span>

                <span className="greenText">{card.creator}</span>

                <span className="secondaryText a-date">
                  <span>{card.date}</span>
                </span>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Announcement;

const SliderButtons = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter a-buttons">
      {<button onClick={() => swiper.slidePrev()}>&lt;</button>}
      <button onClick={() => swiper.slideNext()}>&gt;</button>
    </div>
  );
};
