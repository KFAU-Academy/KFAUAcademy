import React, { useState } from "react";
import "./MyAnnouncements.css";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
import { sliderSettings } from "../../utils/common";
import { MdOutlineAnnouncement } from "react-icons/md";

const MyAnnouncements = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isContentOpen, setContentOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    creator: "",
    date: "",
    content: "",
  });

  const [announcements, setAnnouncements] = useState([]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (editingAnnouncement) {
      const updatedAnnouncements = announcements.map((announcement) =>
        announcement.id === editingAnnouncement.id
          ? { ...announcement, ...formData }
          : announcement
      );
      setAnnouncements(updatedAnnouncements);
    } else {
      const newAnnouncement = { ...formData, id: Date.now() };
      setAnnouncements([newAnnouncement, ...announcements]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    setAnnouncements(
      announcements.filter((announcement) => announcement.id !== id)
    );
  };

  const handleContentClick = (announcement) => {
    setSelectedContent(announcement);
    setContentOpen(true);
  };

  const handleEditClick = (announcement) => {
    setFormData({
      category: announcement.category,
      title: announcement.title,
      creator: announcement.creator,
      date: announcement.date,
      content: announcement.content,
    });
    setEditingAnnouncement(announcement);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setContentOpen(false);
    setFormData({
      category: "",
      title: "",
      creator: "",
      date: "",
      content: "",
    });
    setEditingAnnouncement(null);
    setSelectedContent(null);
  };

  return (
    <section className="ma-wrapper">
      <Navbar />
      <div className="ma-main">
        <Sidebar />
        <main className="ma-container">
          <div className="ma-head flexStart">
            <span className="primaryText">My Announcements</span>
            <button
              className="flexStart add-button"
              onClick={() => setModalOpen(true)}
            >
              <img
                src="/pink_add.png"
                alt="Add Announcement"
                title="Add Announcement"
                className="add-icon"
              />
              <span>Add Announcement</span>
            </button>
          </div>

          {announcements.length > 0 && (
            <Swiper {...sliderSettings}>
              <SliderButtons />
              {announcements.map((card, i) => (
                <SwiperSlide key={i}>
                  <div className="flexColStart ma-card">
                    <img
                      src="/uni_icon.png"
                      alt="announcement"
                      className="ma-card-icon"
                    />
                    <span className="purpleText">{card.title}</span>
                    <span className="greenText">{card.creator}</span>
                    <span className="secondaryText ma-category">
                      {card.category}
                    </span>
                    <span className="secondaryText ma-date">
                      <span>{card.date}</span>
                    </span>
                    <div className="flexCenter ma-card-buttons">
                      <button
                        className="button2"
                        onClick={() => handleEditClick(card)}
                      >
                        Edit
                      </button>
                      <button
                        className="button2"
                        onClick={() => handleDelete(card.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="button2"
                        onClick={() => handleContentClick(card)}
                      >
                        <MdOutlineAnnouncement size={30} />
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </main>
      </div>

      {isModalOpen && (
        <>
          <div className="ma-modal-overlay" onClick={closeModal}></div>
          <div className="ma-add-modal">
            <div className="modal-header">
              <span>
                {editingAnnouncement ? "Edit Announcement" : "Add Announcement"}
              </span>
              <button onClick={closeModal}>X</button>
            </div>
            <div className="modal-body">
              <label>Category</label>
              <select
                name="category"
                onChange={handleInputChange}
                value={formData.category}
              >
                <option value="">Select</option>
                <option value="video">Video</option>
                <option value="note">Note</option>
                <option value="club">Club</option>
              </select>

              <label>Title</label>
              <input
                name="title"
                onChange={handleInputChange}
                value={formData.title}
              />

              <label>Creator</label>
              <input
                name="creator"
                onChange={handleInputChange}
                value={formData.creator}
              />

              <label>Date</label>
              <input
                name="date"
                type="date"
                onChange={handleInputChange}
                value={formData.date}
              />

              <label>Content</label>
              <textarea
                name="content"
                onChange={handleInputChange}
                value={formData.content}
              ></textarea>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={closeModal}>
                Cancel
              </button>
              <button className="submit-button" onClick={handleSubmit}>
                {editingAnnouncement ? "Save Changes" : "Submit"}
              </button>
            </div>
          </div>
        </>
      )}

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
                <strong>Date:</strong> {selectedContent.date}
              </p>
              <p>{selectedContent.content}</p>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default MyAnnouncements;

const SliderButtons = () => {
  const swiper = useSwiper();
  return (
    <div className="flexCenter ma-buttons">
      <button onClick={() => swiper.slidePrev()}>&lt;</button>
      <button onClick={() => swiper.slideNext()}>&gt;</button>
        
    </div>
  );
};
