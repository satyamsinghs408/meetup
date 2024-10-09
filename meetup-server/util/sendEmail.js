const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, link) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailoptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      html: `<h1>Password reset</h1> <p>Click the link below to reset your password</p> <a href='${link}'>Reset Password</a>`,
    };

    await transporter.sendMail(mailoptions);
    console.log("email sent successfully");
  } catch (error) {
    console.log(error, "email not found");
  }
};
module.exports = sendEmail;
