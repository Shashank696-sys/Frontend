import React, { useState, useEffect, useRef } from "react";
import "../style.css";
import "./FeedbackForm.css";
import Settings from "./Settings";       // Import your existing component
import "./temp.css";    

const defaultRingtones = [
  { name: "iPhone", url: "/iphone.mp3" },
  { name: "Samsung", url: "/samsung.mp3" },
  { name: "Redmi/Xiomi", url: "/redmi.mp3" },
  { name: "Poco", url: "/poco.mp3" },
  { name: "Vivo", url: "/vivo.mp3" },
  { name: "Oppo", url: "/oppo.mp3" },
  { name: "Realme", url: "/realme.mp3" },
  { name: "Oneplus", url: "/oneplus.mp3" },
  { name: "Infinix", url: "/infinix.mp3" },
];


const smsTones = {
  iphone: new Audio("/iphone-sms.mp3"),
  android: new Audio("/android-sms.mp3")
};

export default function SilentExit() {
  const [showSettings, setShowSettings] = useState(false);

  const [showUpdates, setShowUpdates] = useState(false);

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const [locationSent, setLocationSent] = useState(false);
  const [sosStatus, setSosStatus] = useState("");
  const titleHoldRef = useRef(null);
  const [isHoldingTitle, setIsHoldingTitle] = useState(false);

  const [triggered, setTriggered] = useState(false);
  const [timer, setTimer] = useState(5);
  const [selected, setSelected] = useState(defaultRingtones[0]);
  const [callerName, setCallerName] = useState("Fake Call");
  const [theme, setTheme] = useState("light");
  const [voiceMessage, setVoiceMessage] = useState(null);
  const [showPickup, setShowPickup] = useState(false);
  const [vibrateMode, setVibrateMode] = useState(false);
  const [showRecall, setShowRecall] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callActive, setCallActive] = useState(false);
  const [showSms, setShowSms] = useState(false);
  const [smsText, setSmsText] = useState("Hey, I'm in a meeting. Call you later.");
  const [incomingSms, setIncomingSms] = useState(null);
  const [smsToneType, setSmsToneType] = useState("iphone");

  const ringtoneRef = useRef(null);
  const voiceMessageRef = useRef(null);
  const callTimerRef = useRef(null);
  
  const [countdown, setCountdown] = useState(10);
  const countdownRef = useRef(null);

  const [sosActive, setSosActive] = useState(false);
  const [sosCancelled, setSosCancelled] = useState(false);
  const sirenRef = useRef(null);
  const timeoutRef = useRef(null);
  const [showCaller, setShowCaller] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const [liveTracking, setLiveTracking] = useState(false);
  const liveIntervalRef = useRef(null);

  const BASE_URL = "https://backend-safepulse-77.onrender.com";  //Backend Link
 
const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch(`${BASE_URL}/send-feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, rating }),
      });

      const result = await res.json();
      if (res.ok) {
        setStatus("✅ Thank you for your feedback!");
        setRating(0);
        setEmail("");
        setMessage("");
      } else {
        setStatus("❌ Failed: " + result.error);
      }
    } catch (err) {
      setStatus("❌ Network error");
    }

    setTimeout(() => setStatus(""), 4000);
  };

const sendSimulatedLiveLocation = () => {
  if (liveIntervalRef.current) return; // ✅ Prevent duplicate intervals

  const email = localStorage.getItem("sos_gmail");
  if (!email || !email.includes("@")) {
    setSosStatus("⚠️ Gmail not set.");
    return;
  }

  if (!("geolocation" in navigator)) {
    setSosStatus("❌ Geolocation not supported.");
    return;
  }

  setLiveTracking(true);
  let updates = 0;

  liveIntervalRef.current = setInterval(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(`${BASE_URL}/send-location-direct`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, latitude, longitude }),
          });

          const result = await res.json();
          if (res.ok) {
            updates++;
            setSosStatus(`📍 Live update #${updates} sent`);
          } else {
            setSosStatus("❌ Failed: " + result.error);
          }
        } catch (err) {
          setSosStatus("❌ Network error");
        }

        setTimeout(() => setSosStatus(""), 3000);
      },
      (err) => {
        setSosStatus("❌ Location error: " + err.message);
        setTimeout(() => setSosStatus(""), 3000);
      },
      { enableHighAccuracy: true }
    );
  }, 10000);
};


const cancelLiveLocation = () => {
  if (liveIntervalRef.current) {
    clearInterval(liveIntervalRef.current);
    liveIntervalRef.current = null; // ✅ Clear reference
  }

  setLiveTracking(false);
  setSosCancelled(true);
  setSosStatus("🚫 Live location stopped.");

   if (sirenRef.current) {
    sirenRef.current.pause();
    sirenRef.current.currentTime = 0;
  }

  setTimeout(() => {
    setSosCancelled(false); // ✅ Allow reuse
  }, 3000);

  setTimeout(() => setSosStatus(""), 3000);
};

const triggerSilentSOS = () => {
  if (!liveTracking && !sosCancelled) {
    sendSimulatedLiveLocation();
  }
};


const handleSosClick = () => {
  if (sosCancelled) return; // avoid running while cancelled

  setSosActive(true);
  sirenRef.current?.play();

  timeoutRef.current = setTimeout(() => {
    if (!sosCancelled) {
      sendSimulatedLiveLocation();
      setSosActive(false);
    }
  }, 10000);
};



const handleTitleHoldStart = () => {
  setIsHoldingTitle(true);
  titleHoldRef.current = setTimeout(() => {
    triggerSilentSOS();
  }, 7000);
};

const handleTitleHoldEnd = () => {
  setIsHoldingTitle(false);
  clearTimeout(titleHoldRef.current);
};

   const cancelSos = () => {
    setSosCancelled(true);
    setSosActive(false);
    sirenRef.current?.pause();
    sirenRef.current.currentTime = 0;
    clearTimeout(timeoutRef.current);
    setLocationSent(false); // 💥 This prevents the location send
  };

useEffect(() => {
  let interval;

  if (sosActive && !sosCancelled) {
    setCountdown(10);
    interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return () => clearInterval(interval);
}, [sosActive, sosCancelled]);


useEffect(() => {
  document.body.classList.add("dark");
  document.body.classList.remove("light"); // Ensure white mode is gone
  setTheme("dark"); // Lock theme state
}, []);

useEffect(() => {
  const canvas = document.createElement("canvas");
  canvas.id = "particle-canvas";
  Object.assign(canvas.style, {
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: "-1",
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  const particles = Array.from({ length: 80 }).map(() => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: Math.random() * 1.5 + 1,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5,
  }));

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > width) p.dx *= -1;
      if (p.y < 0 || p.y > height) p.dy *= -1;
    });
    requestAnimationFrame(draw);
  }

  draw();
  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  return () => document.body.removeChild(canvas);
}, []);


  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        await navigator.wakeLock.request("screen");
      }
    } catch (err) {
      console.warn("Wake lock failed:", err);
    }
  };

  

  const resetCallState = () => {
    clearInterval(callTimerRef.current);
    clearInterval(countdownRef.current);
    stopRingtone();
    setTriggered(false);
    setShowPickup(false);
    setShowRecall(false);
    setCallActive(false);
    setCallDuration(0);
    setShowSms(false);
    setIncomingSms(null);
  };

  const handleFakeCall = () => {
    resetCallState();
    setTriggered(true);
    requestWakeLock();

    const audio = new Audio(selected.url);
    ringtoneRef.current = audio;
    audio.load();

    let count = timer;
    countdownRef.current = setInterval(() => {
      count -= 1;
      setTimer(count);
      if (count <= 0) {
        clearInterval(countdownRef.current);

        if (vibrateMode && navigator.vibrate) navigator.vibrate([500, 300, 500]);

        if (!vibrateMode) {
          ringtoneRef.current.play().catch(err =>
            console.warn("Mobile autoplay prevented:", err)
          );
        }

        setTimeout(() => setShowPickup(true), 1000);
      }
    }, 1000);
  };

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.pause();
      ringtoneRef.current.currentTime = 0;
    }
  };

const handleAudioUpload = (e, setFunc, ref) => {
  const file = e.target.files[0];
  if (file) {
    const audio = new Audio(URL.createObjectURL(file));
    if (ref) ref.current = audio;
    setFunc(audio);
  }
};

  const answerCall = () => {
    stopRingtone();
    setShowPickup(false);
    setShowRecall(true);
    setCallActive(true);
    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    if (voiceMessageRef.current) {
      voiceMessageRef.current.play();
    } else {
      alert("No voice message uploaded.");
    }
  };

  const declineCall = () => {
    stopRingtone();
    setShowPickup(false);
    setShowRecall(true);
    setTimeout(() => {
      setShowSms(true);
      simulateIncomingSms();
    }, 7000);
  };

  const simulateIncomingSms = () => {
    setTimeout(() => {
      setIncomingSms({ sender: callerName, message: "Where are you? Call me ASAP!" });
      try {
        smsTones[smsToneType].play();
      } catch (e) {
        console.warn("SMS tone blocked by browser:", e);
      }
    }, 4000);
  };

  const handleRecallWithDelay = () => {
    const seconds = prompt("Enter seconds to re-call:");
    const delay = parseInt(seconds);
    if (!isNaN(delay) && delay > 0) {
      stopRingtone();
      if (voiceMessageRef.current) {
        voiceMessageRef.current.pause();
        voiceMessageRef.current.currentTime = 0;
      }
      setTimeout(() => handleFakeCall(), delay * 1000);
    } else {
      alert("Invalid input.");
    }
  };

  const highlight = {
  color: "#00ffff",
  fontWeight: "bold",
  fontSize: "1.05rem",
  letterSpacing: "0.5px",
  textShadow: "0 0 5px #00ffff",
};

const listStyle = {
  textAlign: "left",
  lineHeight: "1.8",
  padding: "0 1rem",
  fontSize: "1.05rem",
  color: "#e0ffff",
};

  const endCallAndReload = () => {
  if (voiceMessageRef.current) {
    voiceMessageRef.current.pause();
    voiceMessageRef.current.currentTime = 0;
  }
  resetCallState();
};


  const formatDuration = (seconds) => {
    const min = Math.floor(seconds / 60).toString().padStart(2, '0');
    const sec = (seconds % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };


  return (

    <div className="page-wrapper">
    <video autoPlay muted loop className="background-video">
      <source src="/bg.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

  <div className={`silent-exit ${theme}`}>

  <button
  onClick={() => setShowUpdates(!showUpdates)}
  style={{
    background: "linear-gradient(90deg, #00ffe7, #00cfff)",
    color: "#000",
    padding: "12px 22px",
    fontSize: "1rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow: "0 0 12px #00ffffaa, 0 0 20px #00ffff55 inset",
    transition: "all 0.4s ease-in-out",
    position: "relative",
    overflow: "hidden",
    marginBottom: "18px",
    textShadow: "0 0 5px #fff",
  }}
  onMouseEnter={(e) => {
    e.target.style.background = "linear-gradient(90deg, #00ffff, #00e1ff)";
    e.target.style.boxShadow = "0 0 18px #00ffffaa, 0 0 25px #00ffff88 inset";
  }}
  onMouseLeave={(e) => {
    e.target.style.background = "linear-gradient(90deg, #00ffe7, #00cfff)";
    e.target.style.boxShadow = "0 0 12px #00ffffaa, 0 0 20px #00ffff55 inset";
  }}
>
  🚀 View Future Updates
  <span
    style={{
      content: '""',
      position: "absolute",
      top: 0,
      left: "-75%",
      width: "50%",
      height: "100%",
      background: "linear-gradient(120deg, rgba(255,255,255,0.2), rgba(255,255,255,0))",
      transform: "skewX(-25deg)",
      animation: "shimmer 2.5s infinite",
    }}
  ></span>
</button>


{showUpdates && (
  <div
    style={{
      margin: "0 auto 20px",
      maxWidth: "520px",
      padding: "18px 20px",
      background: "#111927",
      color: "#e0f7ff",
      borderRadius: "16px",
      boxShadow: "0 0 15px #00ffff66, 0 0 10px #00ffff33 inset",
      textAlign: "left",
      transition: "all 0.3s ease-in-out",
    }}
  >
    <h3 style={{ color: "#00ffff", textAlign: "center", marginBottom: "12px", textShadow: "0 0 8px #00ffff" }}>
      🚀 Upcoming Features in SafePulse
    </h3>
    <ul style={{ textAlign: "left", paddingLeft: "20px",  fontSize: "0.95rem", lineHeight: "1.8"}}>
  <li>📍 <strong>Auto WhatsApp Location</strong> — Sends your live location via WhatsApp to emergency contact</li>
  <li>📞 <strong>Auto Emergency Call</strong> — Automatically dials 112 or a saved number during panic</li>
  <li>🌐 <strong>Offline Mode</strong> — Works even without internet, stores and sends later</li>
  <li>👁️‍🗨️ <strong>Invisible Mode</strong> — App works in full stealth mode with no visible UI</li>
  <li>🕵️ <strong>Intruder Capture</strong> — Takes photo and location on wrong password entry</li>
  <li>🕒 <strong>Auto Scheduler</strong> — Set daily times for auto-check-ins to your emergency contacts</li>
  <li>🧠 <strong>AI Risk Detection</strong> — Predicts emergency from voice stress or sudden phone movements</li>
  <li>🎙️ <strong>Custom Voice Recording</strong> — Send your own pre-recorded alert message via email/SMS</li>
  <li>🔊 <strong>Smart Siren Mode</strong> — Activates alarm if device is shaken or voice keyword is detected</li>  
  <li>🔋 <strong>Battery Save Emergency</strong> — Lightweight mode for low battery usage</li> 
</ul>

    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <img
        src="https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif"
        alt="Future updates"
        style={{
          width: "70px",
          borderRadius: "8px",
          boxShadow: "0 0 10px #00ffff88",
        }}
      />
    </div>

    <p style={{ marginTop: "10px", textAlign: "center", fontSize: "0.8rem", color: "#aaaaaa" }}>
      SafePulse by Shashank Pandey • v1.0
    </p>
  </div>
)}


   <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px", gap: "20px" }}>
  <button
    onClick={handleSosClick}
    style={{
      backgroundColor: "red",
      color: "white",
      padding: "12px 28px",
      fontSize: "1rem",
      borderRadius: "12px",
      fontWeight: "bold",
      boxShadow: "0 0 10px rgba(255,0,0,0.5)",
    }}
  >
    🚨 SOS
  </button>

  <button onClick={() => setShowSettings(true)} className="settings-button">
    ⚙️ Settings
  </button>
</div>

{liveTracking && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backdropFilter: "blur(10px)",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      flexDirection: "column",
    }}
  >
    <button
      onClick={cancelLiveLocation}
      style={{
        padding: "20px 40px",
        fontSize: "1.5rem",
        fontWeight: "bold",
        backgroundColor: "#ff0033",
        color: "#fff",
        border: "none",
        borderRadius: "20px",
        boxShadow: "0 0 20px rgb(255, 0, 0)",
        cursor: "pointer",
        transition: "all 0.3s ease-in-out",
      }}
      onMouseOver={(e) => {
        e.target.style.transform = "scale(1.05)";
        e.target.style.boxShadow = "0 0 30px rgb(255, 0, 0)";
      }}
      onMouseOut={(e) => {
        e.target.style.transform = "scale(1)";
        e.target.style.boxShadow = "0 0 20px rgb(255, 0, 0)";
      }}
    >
      ❌ Cancel Live Location
    </button>
  </div>
)}

{sosStatus && (
  <div style={{
    position: "fixed",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#222",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px #00ffffaa",
    zIndex: 10000,
    fontWeight: "bold"
  }}>
    {sosStatus}
  </div>
)}

{sosActive && (
  <div className="sos-overlay">
    <div className="sos-card">
      <img 
        src="/shake.gif" 
        alt="SOS Gesture" 
        style={{
          width: "160px",
          height: "160px",
          borderRadius: "16px",
          objectFit: "cover",
          marginBottom: "15px",
        }} 
      />
      <p style={{ fontWeight: "bold", fontSize: "1.6rem", textAlign: "center" }}>
        🚨 Sending Location in {countdown} seconds...
      </p>
      <button 
        onClick={cancelSos} 
        style={{ 
          marginTop: "20px",
          padding: "12px 24px",
          fontSize: "1rem",
          fontWeight: "bold",
          borderRadius: "10px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Cancel SOS
      </button>
    </div>
  </div>
)}



    {showPickup && (
      <div className="incoming-call-ui">
        <div className="caller-info">
          <p>Incoming Fake Call...</p><br></br>
        </div>
        <div className="call-buttons">
          <button className="answer-btn" onClick={answerCall}>✅ Answer</button>
          <button className="decline-btn" onClick={declineCall}>❌ Decline</button><br></br>
        </div>          
      </div>  
    )}

      {showRecall && (
        <div className="recall-box">
          <p>📵 Call ended with {callerName}</p><br></br>
          {callActive && <p>🕒 Duration: {formatDuration(callDuration)}</p>}
          <button className="button" onClick={handleRecallWithDelay}>🔁 Re-call</button>
          <button className="button danger" onClick={endCallAndReload}>🔚 End Call</button>
        </div>
      )}
      
       
      <br></br>
      <h2
  className="title flicker"
  onMouseDown={handleTitleHoldStart}
  onMouseUp={handleTitleHoldEnd}
  onTouchStart={handleTitleHoldStart}
  onTouchEnd={handleTitleHoldEnd}
>
  🕵️ SafePulse – Fake It. Escape It. Stay Safe
</h2>
<br></br>
      <p className="subtitle slide-in">Where smart exits meet real alerts – proudly developed by Shashank Pandey</p>
      <p className="subtitle slide-in">Simulate an escape call with full customization.</p>

      <div className="config-box">
        

        <label className="label fade-in">Choose Ringtone:
          <select className="dropdown" value={selected.name} onChange={(e) => setSelected(defaultRingtones.find(r => r.name === e.target.value))}>
            {defaultRingtones.map((tone) => (
              <option key={tone.name} value={tone.name}>{tone.name}</option>
            ))}
          </select>
        </label>

        <label className="label fade-in">SMS Tone:
          <select className="dropdown" value={smsToneType} onChange={(e) => setSmsToneType(e.target.value)}>
            <option value="iphone">iPhone</option>
            <option value="android">Android</option>
          </select>
        </label>

        <label className="label fade-in">Set Timer:
          <select className="dropdown" value={timer} onChange={(e) => setTimer(parseInt(e.target.value))}>
            {[5, 10, 30, 60].map((s) => (
              <option key={s} value={s}>{s} seconds</option>
            ))}
          </select>
        </label>

             <label className="label fade-in">📳 Vibrate Mode:
          <input type="checkbox" checked={vibrateMode} onChange={() => setVibrateMode(!vibrateMode)} />
        </label>
      </div>

         <div className="inline-file-upload">
            <label htmlFor="voiceUpload">Upload Voice Message :</label>
          <input
          type="file"
          id="voiceUpload"
          accept=".mp3,.wav"
          onChange={(e) => handleAudioUpload(e, setVoiceMessage, voiceMessageRef)}
        />
         </div>

      {!triggered ? (
  <button className="button pulse" onClick={handleFakeCall}>📞 Trigger Fake Call</button>
) : null}

{/* 👇 Paste this here, before the closing </div> */}
<div className="button-row">
  <button className="button pulse" onClick={() => setShowAbout(!showAbout)}>
    📘 {showAbout ? "Hide About" : "About This App"}
  </button>
</div><br></br>

  {showSettings && (
  <div onClick={() => setShowSettings(false)}>
    <div  onClick={(e) => e.stopPropagation()}>
      <button onClick={() => setShowSettings(false)}>×</button>
      <Settings onClose={() => setShowSettings(false)} />
    </div>
  </div>
)}
    
{showAbout && (
  <div
    className="about-section card-container fade-in"
    style={{
      backgroundColor: "#021015", // Dark background to match #00ffff
      borderRadius: "16px",
      padding: "1.5rem",
      boxShadow: "0 0 10px #00ffffaa, 0 0 15px #00ffff55",
    }}
  >
    <h2
      className="title"
      style={{
        color: "#00ffff",
        textShadow: "0 0 6px #00ffff",
        textAlign: "center",
        marginBottom: "1rem",
      }}
    >
      📘 About SafePulse
    </h2>

    <p style={{ fontSize: "1.1rem", color: "#e0f7ff", textAlign: "center" }}>
      <strong style={{ color: "#00ffff" }}>SafePulse</strong> is a browser-based emergency simulation tool built by <strong style={{ color: "#00ffff" }}>Shashank Pandey</strong>.
    </p>

    <h3 style={{ textAlign: "center", color: "#00ffff", marginTop: "1.5rem" }}>
      Features:
    </h3>
    <ul style={listStyle}>
      <li>📞 <span style={highlight}>Fake Call Trigger:</span> Simulates an incoming call with your chosen ringtone and caller name.</li>
      <li>✅ <span style={highlight}>Accept Call:</span> Plays a realistic voice message mimicking a live conversation.</li>
      <li>❌ <span style={highlight}>Decline Call:</span> Triggers a fake SMS tone after 8s — great for realistic messaging effect.</li>
      <li>🔁 <span style={highlight}>Recall Feature:</span> Automatically repeats the call after a delay to reinforce your exit strategy.</li>
      <li>📍 <span style={highlight}>Live Location Tracking: </span>Sends your actual GPS location to a saved Gmail every 10 seconds — continuously until you cancel.</li>
      <li>🔊 <span style={highlight}>SOS Siren:</span> Loud emergency siren playback to alert nearby people or attract attention.</li>
      <li>⚙️ <span style={highlight}>Settings Page:</span> Set and save your Gmail once — used across all SOS tools.</li>
      <li>🖐️ <span style={highlight}>Tap & Hold SOS:</span> Tap and hold SafePulse Title on the screen for 6+ seconds to send an emergency alert quietly.</li>
      <li>🚨 <span style={highlight}>Auto Location Send:</span> Sends your live location silently via Gmail when SOS activates.</li>
    </ul>

    <h3 style={{ textAlign: "center", color: "#00ffff", marginTop: "2rem" }}>
      Real Life Uses:
    </h3>
    <ul style={listStyle}>
      <li>🔹📞 Escape awkward or unsafe situations with fake call & message alerts.</li>
      <li>🔹⏱️ Create natural distractions during unwanted interactions.</li>
      <li>🔹🚨 Send silent emergency alerts in dangerous environments.</li>
      <li>🔹📍 Share location instantly with trusted contacts in crisis.</li>
      <li>🔹📳 Use tap-hold SafePulse for secret SOS activation — no buttons needed.</li>
      <li>🔹🧠 Help with anxiety or social discomfort through discreet escapes.</li>
      <li>🔹🎬 Ideal for filmmakers, testers , or actors needing fake call flows.</li>
    </ul>

    <p style={{ marginTop: "0.8rem", fontSize: "0.9rem", color: "#00ffff", textAlign: "center" }}>
      Made with ❤️ by Shashank Pandey © {new Date().getFullYear()}
    </p>
  </div>    
)}

<div className="feedback-container">
      <h3>🌟 Share Your Feedback</h3>
      <form onSubmit={handleSubmit}>
        <label>Rate us:</label>
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              onMouseEnter={() => setHovered(num)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setRating(num)}
              className={(hovered || rating) >= num ? "star active" : "star"}
            >
              ★
            </span>
          ))}
        </div>

        <input
          type="email"
          placeholder="Your Gmail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <textarea
          placeholder="Write your feedback..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        ></textarea>

        <button type="submit">Send Feedback</button>

        {status && <div className="status">{status}</div>}
      </form>
    </div>

    </div>
    <audio ref={sirenRef} src="/siren.mp3" preload="auto" />
    </div>
  );
}
