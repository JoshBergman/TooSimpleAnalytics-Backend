import nodemailer from "nodemailer";
import { IEmailConfig } from "../interfaces/email-config";

export const sendEmail = (emailConfig: IEmailConfig) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 587,
    auth: {
      user: "noreply@toosimpleanalytics.com",
      pass: process.env.EMAIL_PASS,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "Too Simple Analytics <noreply@toosimpleanalytics.com>", // sender address
      to: emailConfig.sendEmailTo, // list of receivers
      subject: emailConfig.subject, // Subject line
      text: emailConfig.text, // plain text body
      html: emailConfig.html, // html body
    });

    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    //
    // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
    //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
    //       <https://github.com/forwardemail/preview-email>
    //
  }

  main().catch(console.error);
};
