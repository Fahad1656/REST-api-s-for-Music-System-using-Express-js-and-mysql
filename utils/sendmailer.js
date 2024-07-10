import { mailConfig } from "../config/mail.config.js";

export const sendEmail = async (email, otpcode) => {
  const { SMTPClient } = await import("emailjs");

  const client = new SMTPClient(mailConfig);

  client.send(
    {
      text: `This is your otp ${otpcode}`,
      from: `you <${process.env.USER}>`,
      to: `<${email}>`,
      subject: "OTP code for testing purpose",
    },
    (err, message) => {
      if (err) {
        console.log("Error sending email:", err);
      } else {
        console.log("Email successfully sent:", message);
      }
    }
  );
};
