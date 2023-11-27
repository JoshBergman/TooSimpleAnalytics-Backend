import { Request, Response } from "express";
import { generateId } from "../../helpers/make-id.js";
import { createClient } from "../../helpers/create-client.js";
import { IUser } from "../../interfaces/user.js";
import { validateEmail } from "../../validations/validate-email.js";
import { generatePermId } from "../../helpers/make-perm-id.js";
import { generateEmailVerificationCode } from "../../helpers/make-verify-email-code.js";
import { sendEmail } from "../../helpers/send-email.js";
import { IEmailConfig } from "../../interfaces/email-config.js";

export const createVerifyEmail = async (req: Request, res: Response) => {
  const email = req.body.email;
  if (!validateEmail(email)) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  //user object sent to db
  const userID = generateId();
  const permID = generatePermId();
  const verifyCode = generateEmailVerificationCode();
  const user: IUser = {
    id: userID,
    permID: permID,
    email: email,
    password: verifyCode,
    verify: verifyCode,
    projects: {},
  };

  // 1. verify email doesn't already exist (or if it does exist make sure it has been verified otherwise a new verify code will just be sent / set )
  // 2. if email doesn't exist add pre-verified to the db
  // 3. email verification code to the user's email
  const { client, users } = createClient();
  try {
    await client.connect();
    const emailExists = await users.findOne({ email: email });
    if (emailExists) {
      if (emailExists.verify !== emailExists.password) {
        res.status(400).json({ error: "Email already exists" });
        return;
      }
    }

    //todo find any document with  a matching ID or permID to prevent duplicate id's (Only really a problem if there were many more users)

    await users.insertOne(user);

    const emailConfig: IEmailConfig = {
      sendEmailTo: email,
      subject: "Verify Account",
      text: `Your account verification code: ${verifyCode}`,
      html: `<p>Your account verification code: ${verifyCode}</p>
        <p>If you didn't try creating an account you can safely ignore this, although someone has attempted to use your email.</p>`,
    };
    sendEmail(emailConfig);
  } finally {
    await client.close();
  }

  res.status(200).json({ msg: "Verification code sent to email" });
};
