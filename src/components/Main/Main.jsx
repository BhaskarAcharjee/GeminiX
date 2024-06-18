import React, { useContext, useState, useEffect, useRef } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import NameModal from "../SignIn/NameModal";
import Cards from "../../Subcomponents/Cards";

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
  const [selectedFile, setSelectedFile] = useState(null); // State for selected file
  const [showSummarizer, setShowSummarizer] = useState(false); // State for showing summarizer
  const [showSpellchecker, setShowSpellchecker] = useState(false); // State for showing spellchecker

  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

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

  const handleGalleryClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Handle file upload or sending here
      // Example: uploadFile(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSent(input, showSummarizer, showSpellchecker);
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
          <p onClick={toggleDropdown}>
            {showSummarizer
              ? "Gemini Summarizer"
              : showSpellchecker
              ? "Gemini Spellchecker"
              : "Gemini"}
          </p>
          <img
            className="dropdown-arrow"
            src={assets.dropdown_icon}
            alt="dropdown arrow"
            onClick={toggleDropdown}
          />
        </div>
        <div className="nav-profile-options">
          <img
            src={assets.more_options_icon}
            alt="More Options"
            className="more-options-icon"
          />
          <img
            src={profilePic}
            alt="Profile"
            onClick={toggleProfile}
            className="profile_image"
          />
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <p
              onClick={() => {
                setShowSummarizer(false);
                setShowSpellchecker(false);
              }}
            >
              Gemini
            </p>
            <p
              onClick={() => {
                setShowSummarizer(true);
                setShowSpellchecker(false);
              }}
            >
              Gemini Summarizer
            </p>
            <p
              onClick={() => {
                setShowSpellchecker(true);
                setShowSummarizer(false);
              }}
            >
              Gemini Spellchecker
            </p>
          </div>
        )}
      </div>
      <div className="main-container">
        {showSummarizer && !showResult ? (
          <>
            <div className="greet">
              <p>
                Summarize Articles with <br />
                <span>OpenAI GPT-4</span>
              </p>
            </div>
            <div className="sub-greet">
              <p>
                Simplify your reading with Summize, an open-source article
                summarizer that transforms lengthy articles into clear and
                concise summaries
              </p>
            </div>
          </>
        ) : showSpellchecker && !showResult ? (
          <>
            <div className="greet">
              <p>
                Check Spelling & Grammar with <br />
                <span>OpenAI GPT-3.5</span>
              </p>
            </div>
            <div className="sub-greet">
              <p>
                Ensure your text is free from errors with our powerful
                spellchecker and grammar tool. Perfect for flawless writing.
              </p>
            </div>
          </>
        ) : !showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, {firstName}</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            <Cards handleCardClick={handleCardClick} />
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={profilePic} alt="" className="profile_image" />
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
            {/* Add new icons below the result text */}
            <div className="result-icons">
              <img src={assets.like_icon} alt="Like" />
              <img src={assets.dislike_icon} alt="Dislike" />
              <img src={assets.modify_icon} alt="Modify Response" />
              <img src={assets.share_icon} alt="Share" />
              <img src={assets.google_icon} alt="Google" />
              <img src={assets.copy_icon} alt="Copy" />
            </div>
          </div>
        )}

        <div className="main-bottom">
          <form onSubmit={handleSubmit}>
            <div className="search-box">
              <input
                onChange={handleInputChange}
                value={input}
                type="text"
                placeholder={
                  showSummarizer
                    ? "Enter a URL to summarize article"
                    : showSpellchecker
                    ? "Enter text to correct spelling and grammar"
                    : "Enter a prompt here"
                }
              />
              <div>
                <img
                  src={assets.gallery_icon}
                  alt=""
                  onClick={handleGalleryClick}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <img
                  src={assets.mic_icon}
                  alt=""
                  onClick={handleMicClick}
                  className={isListening ? "mic-blink" : ""}
                />
                {input ? (
                  <img
                    onClick={() =>
                      onSent(input, showSummarizer, showSpellchecker)
                    }
                    src={assets.send_icon}
                    alt=""
                  />
                ) : null}
              </div>
            </div>
          </form>
          <p className="bottom-info">
            {showSummarizer ? (
              <>
                Gemini Summarizer may summarize inaccurate info, including about
                people, so double-check its response.{" "}
                <u>Your privacy and Gemini Summarizer</u>
              </>
            ) : showSpellchecker ? (
              <>
                Gemini Spellchecker may correct inaccurate info, including about
                people, so double-check its response.{" "}
                <u>Your privacy and Gemini Spellchecker</u>
              </>
            ) : (
              <>
                Gemini may display inaccurate info, including about people, so
                double-check its response. <u>Your privacy and Gemini Apps</u>
              </>
            )}
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
