import React from "react";
import "./Favorites.css";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import data from "../../utils/favs.json";
import { sliderSettings } from "../../utils/common";
import { FaHeart, FaHeartBroken } from "react-icons/fa";
import { AiFillHeart } from "react-icons/ai";

const Favorites = () => {
  return (
    <section className="f-wrapper">
      <Navbar />

      <div className="f-main">
        {/* Sol menü */}
        <Sidebar />

        {/* Ana İçerik */}
        <main className="f-container">
          <div className="f-head flexColStart">
            <span className="primaryText">Favorites</span>
          </div>

          <Swiper {...sliderSettings}>
            <SliderButtons />
            {data.map((card, i) => (
              <SwiperSlide key={i}>
                <div className="flexColStart f-card">
                  {/* orijinal rengi: #fff2f9 */}
                  <AiFillHeart size={30} color="#c40a5d" />
                  <img src={card.image} alt="home" />

                  <span className="purpleText">{card.title}</span>

                  <span className="greenText">{card.creator}</span>

                  <span className="secondaryText f-date">
                    <span>{card.date}</span>
                  </span>
                </div>
              </SwiperSlide>
            ))}
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
      {<button onClick={() => swiper.slidePrev()}>&lt;</button>}
      <button onClick={() => swiper.slideNext()}>&gt;</button>
    </div>
  );
};
