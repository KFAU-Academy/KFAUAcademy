import React, { useState, useEffect } from "react";
import axios from "axios";
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

  // Kullanıcının email bilgisini localStorage'dan alıyoruz
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserEmail = user.email || "";

  // Tüm duyuruları çekiyoruz
  const fetchAllAnnouncements = async () => {
    try {
      const res = await axios.get("/api/announcement/allann");
      setAnnouncements(res.data);
    } catch (error) {
      console.error("Error fetching announcements", error);
    }
  };

  useEffect(() => {
    fetchAllAnnouncements();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingAnnouncement) {
        // update işlemi
        const res = await axios.put(
          `/api/announcement/${editingAnnouncement.id}`,
          {
            category: formData.category,
            title: formData.title,
            content: formData.content,
          }
        );

        // Güncellenen duyuruyu listede yenile
        setAnnouncements(
          announcements.map((a) =>
            a.id === editingAnnouncement.id ? res.data.announcement : a
          )
        );

        setModalOpen(false);
        setEditingAnnouncement(null);
        setFormData({
          category: "",
          title: "",
          creator: "",
          date: "",
          content: "",
        });
        return;
      }

      // Yeni duyuru oluşturma işlemi (eski hali)
      const newAnnouncement = {
        category: formData.category,
        title: formData.title,
        content: formData.content,
        userEmail: currentUserEmail,
      };

      const res = await axios.post("/api/announcement/create", newAnnouncement);

      setAnnouncements([res.data.announcement, ...announcements]);
      setModalOpen(false);
      setFormData({
        category: "",
        title: "",
        creator: "",
        date: "",
        content: "",
      });
    } catch (error) {
      console.error("Error creating/updating announcement", error);
      alert(
        "Duyuru oluşturulurken/güncellenirken hata oluştu: " + error.message
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/announcement/${id}`);
      setAnnouncements(announcements.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error deleting announcement", error);
      alert("Duyuru silinirken hata oluştu: " + error.message);
    }
  };

  const handleContentClick = (announcement) => {
    setSelectedContent(announcement);
    setContentOpen(true);
  };

  const handleEditClick = (announcement) => {
    setFormData({
      category: announcement.category,
      title: announcement.title,
      creator: announcement.creator || "",
      date: announcement.date ? announcement.date.split("T")[0] : "",
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
              {announcements.map((card) => {
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
                    <div className="flexColStart ma-card">
                      <img
                        src={iconSrc}
                        alt="announcement"
                        className="ma-card-icon"
                      />
                      <span className="purpleText">{card.title}</span>
                      <span className="greenText">{card.creator}</span>
                      <span className="secondaryText ma-category">
                        {card.category}
                      </span>
                      <span className="secondaryText ma-date">
                        <span>{new Date(card.date).toLocaleDateString()}</span>
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
                );
              })}
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
                <strong>Date:</strong>{" "}
                {new Date(selectedContent.date).toLocaleDateString()}
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
