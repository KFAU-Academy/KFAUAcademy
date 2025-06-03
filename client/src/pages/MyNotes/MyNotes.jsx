import React, { useState, useEffect } from "react";
import "./MyNotes.css";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import greenAdd from "/green_add.png";
import { FaFilePdf } from "react-icons/fa6";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import { sliderSettings } from "../../utils/common";
import axios from "axios";

const MyNotes = () => {
  const [noteName, setNoteName] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteFile, setNoteFile] = useState(null);
  const [uploadedNotes, setUploadedNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editNoteId, setEditNoteId] = useState(null);
  const [noteNameError, setNoteNameError] = useState(false);
  const [noteTitleError, setNoteTitleError] = useState(false);

  const courseOptions = [
    "Operating Systems",
    "Human-Computer Interaction",
    "Automata Theory and Formal Languages",
    "Modern Programming Languages",
  ];

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userEmail = user.email || "";

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("/api/note/allnotes", {
          params: { userEmail },
        });
        if (Array.isArray(response.data)) {
          setUploadedNotes(response.data);
        } else {
          console.error("API response is not an array:", response.data);
          setUploadedNotes([]);
        }
      } catch (err) {
        console.error("Error fetching notes:", err);
        setUploadedNotes([]);
        alert("An error occurred while loading the notes: " + err.message);
      }
    };
    fetchNotes();
  }, [userEmail]);

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

  const handleUpload = async () => {
    if (
      noteName.trim() === "" ||
      noteTitle.trim() === "" ||
      (!noteFile && !editNoteId)
    ) {
      if (noteName.trim() === "") setNoteNameError(true);
      if (noteTitle.trim() === "") setNoteTitleError(true);
      if (!noteFile && !editNoteId) alert("Please select a note file.");
      return;
    }

    const formData = new FormData();
    formData.append("courseName", noteName);
    formData.append("noteTitle", noteTitle);
    formData.append("userEmail", userEmail);
    if (noteFile) {
      formData.append("file", noteFile);
    }

    try {
      if (editNoteId) {
        const response = await axios.put("/api/note/" + editNoteId, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUploadedNotes(
          uploadedNotes.map((note) =>
            note.id === editNoteId ? response.data.note : note
          )
        );
      } else {
        const response = await axios.post("/api/note/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUploadedNotes([response.data.note, ...uploadedNotes]);
      }

      setNoteName("");
      setNoteTitle("");
      setNoteFile(null);
      setShowModal(false);
      setEditNoteId(null);
    } catch (err) {
      console.error("Error processing note:", err);
      alert("An error occurred while processing the note: " + err.message);
    }
  };

  const handleEdit = (noteId) => {
    const noteToEdit = uploadedNotes.find((note) => note.id === noteId);
    setNoteName(noteToEdit.courseName);
    setNoteTitle(noteToEdit.noteTitle);
    setEditNoteId(noteId);
    setShowModal(true);
  };

  const handleDelete = async (noteId) => {
    try {
      await axios.delete("/api/note/" + noteId);
      setUploadedNotes(uploadedNotes.filter((note) => note.id !== noteId));
    } catch (err) {
      console.error("Error deleting note:", err);
      alert("An error occurred while deleting the note.");
    }
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
                alt="Add Note"
                title="Add Note"
                className="add-icon"
              />
              <span>Add Note</span>
            </button>
          </div>

          <Swiper {...sliderSettings}>
            <SliderButtons />
            {Array.isArray(uploadedNotes) && uploadedNotes.length > 0 ? (
              uploadedNotes.map((note) => (
                <SwiperSlide key={note.id}>
                  <div className="flexColStart mv-card">
                    <img
                      src={note.image || "/note_icon.png"}
                      alt="Note Icon"
                      className="mv-card-icon"
                    />
                    <h3>{note.courseName}</h3>
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
                        onClick={() => {
                          const baseUrl = "http://localhost:8000";
                          const noteUrl = note.noteUrl.startsWith("http")
                            ? note.noteUrl
                            : baseUrl + note.noteUrl;
                          window.open(noteUrl, "_blank");
                        }}
                      >
                        <FaFilePdf size={30} />
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="flexColStart mv-card">
                  <p>No notes have been uploaded yet.</p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </main>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editNoteId ? "Edit Note" : "Add New Note"}</h3>
            <select
              value={noteName}
              onChange={handleNoteNameChange}
              className="input-field dropdown-field"
            >
              <option value="" disabled>
                Select a Course
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
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileChange}
              className="input-field"
            />
            <div className="modal-buttons">
              <button onClick={handleUpload} className="upload-button">
                {editNoteId ? "Save" : "Upload"}
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

const SliderButtons = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter ma-buttons">
      <button onClick={() => swiper.slidePrev()}>&lt;</button>
      <button onClick={() => swiper.slideNext()}>&gt;</button>
    </div>
  );
};

export default MyNotes;
