import React, { useState } from "react";
import "./MyNotes.css";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import greenAdd from "/green_add.png";
import { FaFilePdf } from "react-icons/fa6";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import { sliderSettings } from "../../utils/common";

const MyNotes = () => {
  const [noteName, setNoteName] = useState("");
  const [noteFile, setNoteFile] = useState(null);
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [noteNameError, setNoteNameError] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteTitleError, setNoteTitleError] = useState(false);

  const courseOptions = [
    "Operating Systems",
    "Human-Computer Interaction",
    "Automata Theory and Formal Languages",
    "Modern Programming Languages",
  ];

  const handleNoteNameChange = (e) => {
    setNoteName(e.target.value);
    if (e.target.value.trim() !== "") {
      setNoteNameError(false);
    }
  };

  const handleNoteTitleChange = (e) => {
    setNoteTitle(e.target.value);
    if (e.target.value.trim() !== "") {
      setNoteTitleError(false);
    }
  };

  const handleFileChange = (e) => {
    setNoteFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (
      noteName.trim() === "" ||
      noteTitle.trim() === "" ||
      (!noteFile && editNoteId === null)
    ) {
      if (noteName.trim() === "") setNoteNameError(true);
      if (noteTitle.trim() === "") setNoteTitleError(true);
      if (!noteFile && editNoteId === null) alert("Please select a note file.");
      return;
    }

    if (editNoteId !== null) {
      // Düzenleme
      setUploadedNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === editNoteId
            ? {
                ...note,
                noteName,
                noteTitle,
                fileURL: noteFile
                  ? URL.createObjectURL(noteFile)
                  : note.fileURL,
              }
            : note
        )
      );
    } else {
      // Yeni ekleme
      const fileURL = URL.createObjectURL(noteFile);
      const newNote = {
        id: uploadedNotes.length + 1,
        noteName,
        noteTitle,
        fileURL,
      };
      setUploadedNotes([...uploadedNotes, newNote]);
    }

    setNoteName("");
    setNoteTitle("");
    setNoteFile(null);
    setShowModal(false);
    setEditNoteId(null);
  };

  const handleEdit = (noteId) => {
    const noteToEdit = uploadedNotes.find((note) => note.id === noteId);
    setNoteName(noteToEdit.noteName);
    setNoteTitle(noteToEdit.noteTitle);
    setEditNoteId(noteId);
    setShowModal(true);
  };

  const handleDelete = (noteId) => {
    setUploadedNotes(uploadedNotes.filter((note) => note.id !== noteId));
  };

  return (
    <div className="mn-wrapper">
      <Navbar />
      <div className="ma-main">
        <Sidebar />
        <main className="ma-container">
          <div className="ma-head flexStart">
            <span className="primaryText">My Notes</span>
            <button
              className="flexStart add-button"
              onClick={() => setShowModal(true)}
            >
              <img
                src={greenAdd}
                alt="Add Notes"
                title="Add Notes"
                className="add-icon"
              />
              <span>Add Notes</span>
            </button>
          </div>

          <Swiper {...sliderSettings}>
            <SliderButtons />
            {uploadedNotes.map((note) => (
              <SwiperSlide key={note.id}>
                <div className="flexColStart mv-card">
                  <img
                    src="/note_icon.png"
                    alt="Not Simgesi"
                    className="mv-card-icon"
                  />
                  <h3>{note.noteName}</h3>
                  <p>{note.noteTitle}</p>
                  <div className="flexCenter mv-card-buttons">
                    <button
                      className="button2"
                      onClick={() => handleEdit(note.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="button2"
                      onClick={() => handleDelete(note.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="flexCenter button2"
                      onClick={() => window.open(note.fileURL, "_blank")}
                    >
                      <FaFilePdf size={30} />
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editNoteId !== null ? "Edit Note" : "Add New Note"}</h3>

            {/* Dropdown */}
            <select
              value={noteName}
              onChange={handleNoteNameChange}
              className="input-field dropdown-field"
            >
              <option value="" disabled>
                Select Course
              </option>
              {courseOptions.map((course, index) => (
                <option key={index} value={course}>
                  {course}
                </option>
              ))}
            </select>
            {noteNameError && (
              <p className="mn-error-message">Course name is required.</p>
            )}
            {/* Note Title Input */}
            <input
              type="text"
              placeholder="Enter Note Title"
              value={noteTitle}
              onChange={handleNoteTitleChange}
              className="input-field"
            />
            {noteTitleError && (
              <p className="mn-error-message">Note title is required.</p>
            )}

            {/* File Input */}
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="input-field"
            />

            <div className="modal-buttons">
              <button onClick={handleUpload} className="upload-button">
                {editNoteId !== null ? "Save" : "Upload"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditNoteId(null);
                }}
                className="notes-cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNotes;

const SliderButtons = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter ma-buttons">
      <button onClick={() => swiper.slidePrev()}>&lt;</button>
      <button onClick={() => swiper.slideNext()}>&gt;</button>
    </div>
  );
};
