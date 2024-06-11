import React, { useState } from "react";
import "./NameModal.css";

const NameModal = ({
  fullName,
  setFullName,
  handleNameSubmit,
  handleModalClose,
  profilePic,
  setProfilePic,
}) => {
  const handleNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content-wrapper">
        <div className="modal-content">
          <div className="modal-body">
            <img
              src={profilePic || "https://mdbootstrap.com/img/Photos/Avatars/img%20%281%29.webp"}
              alt="avatar"
              className="rounded-circle modal-avatar"
            />
            <form onSubmit={handleNameSubmit}>
              <div>
                <h5 className="modal-title">Profile Details</h5>
                <div data-mdb-input-init className="form-outline mb-4">
                  <input
                    type="text"
                    id="fullname"
                    className="form-control"
                    value={fullName}
                    onChange={handleNameChange}
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-outline mb-4">
                  <input
                    type="file"
                    id="profilePic"
                    className="form-control"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                  />
                  <label className="form-label" htmlFor="profilePic">
                    Upload Profile Picture
                  </label>
                </div>
                <button
                  type="submit"
                  data-mdb-button-init
                  data-mdb-ripple-init
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </div>
            </form>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleModalClose}
            >
              &times;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameModal;
