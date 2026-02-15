// import { Resend } from "resend";
import OTP from "../models/otpModel.js";
import nodemailer from "nodemailer"

// const resend = new Resend(process.env.RESEND_API_KEY);

// const resend = new Resend("re_Q6KEKoDn_Gveb78JtUkTzZWzQ3krp2E2k");

export async function sendOtpService(email) {
  console.log("Sending OTP to:", email);

  const transporter = nodemailer.createTransport({
    service: "gmail", // better than host config
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  await OTP.findOneAndUpdate(
    { email },
    { otp, createdAt: new Date() },
    { upsert: true }
  );

  // ✅ Proper await (NO IIFE)
  const info = await transporter.sendMail({
    from: `"King Sent" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <div style="background:black;color:white;padding:20px;text-align:center;">
        <h1 style="color:green;">${otp}</h1>
      </div>
    `,
  });

  console.log("Message sent:", info.messageId);

  return { success: true, message: `OTP sent successfully to ${email}` };
}