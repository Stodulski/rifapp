import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "maxisto043@gmail.com",
    pass: "xxqd xrtc vykr ffcf",
  },
});

export const sendEmail = async (
  to: string,
  message: string,
  subject: string
) => {
  const sendedEmail = await transporter.sendMail({
    from: "Rifapp <notices@rifapp.com.ar>",
    to,
    subject,
    html: message,
  });

  return sendedEmail;
};
