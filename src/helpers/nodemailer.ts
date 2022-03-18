import nodemailer from "nodemailer";
const { APP_NODEMAILER_EMAIL, APP_NODEMAILER_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: APP_NODEMAILER_EMAIL,
    pass: APP_NODEMAILER_PASSWORD,
  },
});

export const sendEmail = (email: string, subject: string, text: string) => {
  const from = APP_NODEMAILER_EMAIL;
  const mailOptions = { from, to: email, subject, text };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email Sent: " + info.response);
    }
  });
};
