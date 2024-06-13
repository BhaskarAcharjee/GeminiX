import React, { useContext, useState, useEffect, useRef } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import NameModal from "../SignIn/NameModal";

const Main = ({ toggleSidebar }) => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [fullName, setFullName] = useState(""); // State for full name
  const [firstName, setFirstName] = useState("World"); // State for displaying first name
  const [profilePic, setProfilePic] = useState(assets.dummy_icon); // State for profile picture

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
    setModalOpen(false); // Close modal if dropdown is toggled
  };

  const toggleProfile = () => {
    setModalOpen((prev) => !prev);
    setDropdownOpen(false); // Close dropdown if modal is toggled
  };

  const handleCardClick = (text) => {
    setInput(text);
  };

  const handleMicClick = () => {
    const recognition = new window.webkitSpeechRecognition();

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognition.start();
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleNameSubmit = (event) => {
    event.preventDefault();
    const firstNameExtracted = fullName.split(" ")[0]; // Extract first name
    setFirstName(firstNameExtracted);
    setModalOpen(false);
  };

  return (
    <div className="main">
      <div className="nav">
        <div className="nav-gemini">
          <img
            className="mobile-menu"
            src={assets.menu_icon}
            alt="menu-icon"
            onClick={toggleSidebar}
          />
          <p onClick={toggleDropdown}>Geminie</p>
          <img
            className="dropdown-arrow"
            src={assets.dropdown_icon}
            alt="dropdown arrow"
            onClick={toggleDropdown}
          />
        </div>
        <img src={profilePic} alt="Profile" onClick={toggleProfile} className="profile_image"/>
        {dropdownOpen && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <p>Geminie</p>
            <p>Geminie Advanced</p>
          </div>
        )}
      </div>
      <div className="main-container">
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, {firstName}</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            <div className="cards">
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Suggest beautiful places to see on an upcoming road trip"
                  )
                }
              >
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Briefly summarize this concept: urban planning"
                  )
                }
              >
                <p>Briefly summarize this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Brainstorm team bonding activities for our work retreat"
                  )
                }
              >
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div
                className="card"
                onClick={() =>
                  handleCardClick(
                    "Improve the readability of the following code"
                  )
                }
              >
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={profilePic} alt="" className="profile_image"/>
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={handleInputChange}
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              <img src={assets.gallery_icon} alt="" />
              <img
                src={assets.mic_icon}
                alt=""
                onClick={handleMicClick}
                className={isListening ? "mic-blink" : ""}
              />
              {input ? (
                <img onClick={() => onSent()} src={assets.send_icon} alt="" />
              ) : null}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info, including about people, so
            double-check its response. <u>Your privacy and Gemini Apps</u>
          </p>
        </div>
      </div>

      {modalOpen && (
        <NameModal
          fullName={fullName}
          setFullName={setFullName}
          handleNameSubmit={handleNameSubmit}
          handleModalClose={handleModalClose}
          profilePic={profilePic}
          setProfilePic={setProfilePic}
        />
      )}
    </div>
  );
};

export default Main;
