// import { Resend } from "resend";
import OTP from "../models/otpModel.js";
import nodemailer from "nodemailer"

// const resend = new Resend(process.env.RESEND_API_KEY);

// const resend = new Resend("re_Q6KEKoDn_Gveb78JtUkTzZWzQ3krp2E2k");

export async function sendOtpService(email) {
  console.log(email)
 // Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: "adipimanojkumar@gmail.com",
    pass: process.env.NODE_MAILER_SECRET_KEY,
  },
});
 const otp = Math.floor(1000 + Math.random() * 9000).toString();

  // Upsert OTP (replace if it already exists)
  await OTP.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true }
  );

// Wrap in an async IIFE so we can use await.
(async () => {
  const info = await transporter.sendMail({
    from:"'King  Sent' <adipimanojkumar@gmail.com>" ,
    to: email,
    subject: "Otp",
    html: `<div style=' background-color: black; 
      color: white; 
      padding: 20px; 
      text-align: center;
      height:100%;
      font-family: Arial, sans-serif;'>
      <h1 style='color:green;'>${otp}</h1>
      </div>`, // HTML body
    text: "Hello world?", // plain‑text body
  });

  console.log("Message sent: %s", info.messageId);
})()
  return { success: true, message: `OTP sent successfully on ${email}` };
}
