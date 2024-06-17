import React from "react";
import { assets } from "../assets/assets";

const Cards = ({ handleCardClick }) => {
  return (
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
          handleCardClick("Briefly summarize this concept: urban planning")
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
          handleCardClick("Improve the readability of the following code")
        }
      >
        <p>Improve the readability of the following code</p>
        <img src={assets.code_icon} alt="" />
      </div>
    </div>
  );
};

export default Cards;
