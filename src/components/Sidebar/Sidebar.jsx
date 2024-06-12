import React, { useContext, useState } from "react";
import "./Sidebar.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { onSent, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSent(prompt);
  };

  return (
    <div className={`sidebar ${isOpen ? "extended" : ""}`}>
      <div className="top">
        <img
          onClick={toggleSidebar}
          className="menu"
          src={assets.menu_icon}
          alt="menu"
        />
        <div onClick={() => newChat()} className="new-chat">
          <img className="plus_icon" src={assets.plus_icon} alt="plus" />
          {isOpen ? <p>New Chat</p> : null}
        </div>
        {isOpen ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            <div className="recent-wrapper">
              <div className="recent-list">
                {prevPrompts.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => loadPrompt(item)}
                    className="recent-entry"
                  >
                    <div className="recent-content">
                      <img
                        className="message_icon"
                        src={assets.message_icon}
                        alt="message"
                      />
                      <p>{item.slice(0, 22)} ...</p>
                    </div>
                    <div className="options-wrapper">
                      <img
                        className="options_icon"
                        src={assets.options_icon}
                        alt="options"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <img src={assets.question_icon} alt="question" />
          {isOpen ? <p>Help</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.history_icon} alt="history" />
          {isOpen ? <p>Activity</p> : null}
        </div>
        <div className="bottom-item recent-entry">
          <img src={assets.setting_icon} alt="setting" />
          {isOpen ? <p>Settings</p> : null}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
