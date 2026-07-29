const express = require("express");
const router = express.Router();

const { sendEmail } = require("../services/email.service");

router.get("/email", async (req, res) => {
  try {
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "PeerRent Email Test",
      html: `
        <h2>🎉 PeerRent Email Test</h2>
        <p>If you received this email, your email service is working correctly.</p>
      `,
    });

    res.json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to send email",
      error: err.message,
    });
  }
});

module.exports = router;