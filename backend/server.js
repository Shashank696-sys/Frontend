const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
const PORT = 3000;

app.use(cors({
  origin: '*',  // Allow any origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

app.post("/send-feedback", async (req, res) => {
  const { email, message, rating } = req.body;

  if (!email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "safe.pulse.developer.shashank@gmail.com",
        pass: "cprl xdla mxgr qffw",
      },
    });

    

    const mailOptions = {
      from: email,
      to: "safe.pulse.developer.shashank@gmail.com",
      subject: `🌟 New Feedback - ${rating} Stars`,
      html: `
        <body style="margin: 0; padding: 0;">
  <div style="font-family: 'Segoe UI', sans-serif; background: #1e1f26; color: #f4f4f4; max-width: 400px; margin: auto; padding: 20px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,255,255,0.2); border: 1px solid #00ffff33;">
    
    <h2 style="text-align: center; color: #00ffff; text-shadow: 0 0 6px #00ffff; font-size: 1.4rem; margin-bottom: 16px;">
      🌟 New SafePulse Feedback
    </h2>

    <p style="margin: 6px 0;"><strong style="color: #FFD700;">Name:</strong> <span style="color: #ffffffc0;">${email}</span></p>
    
    <p style="margin: 6px 0;">
      <strong style="color: #FFD700;">Rating:</strong>
      <span style="color: gold; font-size: 1.3rem; text-shadow: 0 0 4px gold;">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</span>
    </p>

    <p style="margin: 8px 0 4px; color: #7efff5;"><strong>Feedback:</strong></p>
    <div style="background: #292b35; padding: 12px 16px; border-left: 4px solid #00ffff; border-radius: 8px; font-size: 0.95rem; line-height: 1.5;">
      “${message}”
    </div>

    <p style="text-align: center; margin-top: 12px; font-size: 0.75rem; color: #888;">
      — SafePulse Feedback | © 2025
    </p>
  </div>
</body>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error sending feedback:", error);
    res.status(500).json({ error: "Failed to send feedback" });
  }
});


app.post("/send-location-direct", async (req, res) => {
  const { email, latitude, longitude } = req.body;

  if (!email || !latitude || !longitude) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const timestamp = new Date().toLocaleString();
  const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "safe.pulse.developer.shashank@gmail.com",
        pass: "cprl xdla mxgr qffw",
      },
    });

    await transporter.sendMail({
      from: '"SilentExit SOS" <safe.pulse.developer.shashank@gmail.com>',
      to: email,
      subject: `🚨 SOS Location Alert - ${timestamp}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 10px; background: #f8f9fa; border-radius: 8px;">
          <h2>📍 Emergency Location Update</h2>
          <p><b>🕒 Time:</b> ${timestamp}</p>
          <p><b>📌 Latitude:</b> ${latitude}</p>
          <p><b>📌 Longitude:</b> ${longitude}</p>
          <p><a href="${mapsLink}" style="color: #007BFF; font-weight: bold;">🌐 Open in Google Maps</a></p>
          <hr style="margin: 16px 0;">
          <p style="color: #444;">Stay safe,<br>🛡️ <b>SafePulse SOS System</b></p>
        </div>
      `,
    });

    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
