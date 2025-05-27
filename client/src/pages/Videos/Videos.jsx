import React, { useState } from "react";
import "./Videos.css";
import Navbar from "../../components/Navbar/Navbar";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import { use } from "react";
import useVideos from "../../hooks/useVideos";
import { PuffLoader } from "react-spinners";
import { AiFillHeart } from "react-icons/ai";
import { GiPlayButton } from "react-icons/gi";
import { truncate } from "lodash";

const Videos = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { data, isError, isLoading } = useVideos();

  if (isError) {
    return (
      <div className="wrapper">
        <span>Error while fetching data</span>
      </div>
    );
  }

  if (isLoading) {
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
  console.log(data);

  const courseOptions = [
    "Operating Systems",
    "Human-Computer Interaction",
    "Automata Theory and Formal Languages",
    "Modern Programming Languages",
  ];

  const handleCourseSelect = (course) => {
    setSearchInput(course);
    setShowDropdown(false);
  };

  return (
    <section className="v-wrapper">
      <Navbar />

      <div className="paddings flexCenter v-container">
        {/* Seçim çubuğu */}
        <div className="selection-bar">
          <input
            type="text"
            value={searchInput}
            placeholder="Search for courses.."
            onChange={(e) => setSearchInput(e.target.value)}
            className="course-input"
          />
          <button
            className="v-dropdown-button"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            <FaChevronDown color="#d06382" />
          </button>

          {showDropdown && (
            <ul className="v-dropdown-menu">
              {courseOptions.map((course, index) => (
                <li
                  key={index}
                  className="v-dropdown-item"
                  onClick={() => handleCourseSelect(course)}
                >
                  {course}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Arama çubuğu */}
        <div className="search-bar">
          <FaSearch color="#d06382" size={20} />
          <input type="text" placeholder="Search..." />
          <button className="button4">Search</button>
        </div>

        {/* Videolar */}
        <main className="vs-container">
          <div className="paddings flexCenter videos">
            {data.map((card, i) => (
              <div className="flexColStart v-card">
                <AiFillHeart size={30} color="#fff2f9" />
                <img src={card.image} alt="video" />
                <span className="purpleText">
                  {truncate(card.videoTitle, { length: 30 })}
                </span>
                <span className="greenText">{card.creator}</span>
                <button
                  className="flexCenter button2"
                  onClick={() => window.open(card.videoURL, "_blank")}
                >
                  <GiPlayButton size={30} />
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </section>
  );
};

export default Videos;
