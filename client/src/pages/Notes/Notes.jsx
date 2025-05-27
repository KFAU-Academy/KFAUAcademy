import React, { useState } from "react";
import "./Notes.css";
import Navbar from "../../components/Navbar/Navbar";
import { FaSearch, FaChevronDown } from "react-icons/fa";
import useNotes from "../../hooks/useNotes";
import { PuffLoader } from "react-spinners";
import { AiFillHeart } from "react-icons/ai";
import { GiPlayButton } from "react-icons/gi";
import { truncate } from "lodash";

const Notes = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const { data, isError, isLoading } = useNotes();

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

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const selectCourse = (course) => {
    setSelectedCourse(course);
    setDropdownOpen(false);
  };

  const handleInputChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  return (
    <section className="n-wrapper">
      <Navbar />
      <div className="paddings flexCenter n-container">
        {/* Seçim çubuğu */}
        <div className="selection-bar">
          <input
            type="text"
            value={selectedCourse}
            placeholder="Search for courses.."
            onChange={handleInputChange}
            className="course-input"
          />
          <button className="dropdown-button" onClick={toggleDropdown}>
            <FaChevronDown color="#d06382" />
          </button>

          {dropdownOpen && (
            <ul className="dropdown-menu">
              {courseOptions.map((course, index) => (
                <li
                  key={index}
                  className="dropdown-item"
                  onClick={() => selectCourse(course)}
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

        {/* Notlar */}
        <main className="ns-container">
          <div className="paddings flexCenter notes">
            {data.map((card, i) => (
              <div className="flexColStart n-card">
                <AiFillHeart size={30} color="#fff2f9" />
                <img src={card.image} alt="note" />
                <span className="purpleText">
                  {truncate(card.noteTitle, { length: 30 })}
                </span>
                <span className="greenText">{card.creator}</span>
                <button
                  className="flexCenter button2"
                  onClick={() => window.open(card.noteURL, "_blank")}
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

export default Notes;
