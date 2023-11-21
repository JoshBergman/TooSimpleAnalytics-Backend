import { Request, Response } from "express";
import { validateEmail } from "../../validations/validate-email.js";
import { sendEmail } from "../../helpers/send-email.js";
import { IEmailConfig } from "../../interfaces/email-config.js";

export const emailTest = async (req: Request, res: Response) => {
  const email = req.body.email;
  if (!validateEmail(email)) {
    res.status(400).json({ error: "Invalid email or password" });
    return;
  }

  const emailConfig: IEmailConfig = {
    sendEmailTo: email,
    subject: "Account Action",
    text: "Email Text Content",
    html: "Your recovery code: 69420",
  };
  sendEmail(emailConfig);

  res.status(200).json({ msg: "Email Sent" });
};
