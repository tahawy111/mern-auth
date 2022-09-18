import nodemailer from "nodemailer";

export default async function sendMail(emailData) {
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS },
  });

  try {
    await transport.sendMail(emailData);
  } catch (error) {
    console.log(error);
  }
}
