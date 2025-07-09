import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./settings.css";

const Settings = ({ onClose }) => {
  const [gmail, setGmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("sos_gmail");
    if (saved) setGmail(saved);
  }, []);

  const handleSave = () => {
    if (!gmail.includes("@")) {
      alert("❌ Please enter a valid Gmail ID.");
      return;
    }

    localStorage.setItem("sos_gmail", gmail);
    alert("✅ Gmail saved successfully!");
    navigate("/");
  };

  return (
    <div className="settings-wrapper">
      {/* 🌄 Background Video */}
      <video
        autoPlay
        muted
        loop
        className="background-video"
        playsInline
        src="./bg.mp4"
        type="video/mp4"
      ></video>

      <div className="settings-card">
        <h1>⚙️ SOS Settings</h1>
        <p>Enter your Gmail ID to receive live location alerts during emergencies.</p>

        <input
          type="email"
          placeholder="youremail@gmail.com"
          value={gmail}
          onChange={(e) => setGmail(e.target.value)}
        />

        <button className="glow-save" onClick={handleSave}>
          💾 Save Gmail
        </button>

       <button onClick={onClose} className="back-button">
        Back to App
      </button>
      </div>
    </div>
  );
};

export default Settings;
