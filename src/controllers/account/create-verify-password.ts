import { Request, Response } from "express";
import { createClient } from "../../helpers/create-client.js";
import { generateEmailVerificationCode } from "../../helpers/make-verify-email-code.js";
import { sendEmail } from "../../helpers/send-email.js";
import { IEmailConfig } from "../../interfaces/email-config.js";

export const createVerifyPassword = async (req: Request, res: Response) => {
  const id = req.body.auth.userId;
  const email = req.body.auth.email;
  const verifyCode = generateEmailVerificationCode(); //this verification code although made for email verification works just fine for this as its just a 6 length random code

  // 1. generate password reset id
  // 3. set account's resetID to reset id
  // 4. email account's email with reset id
  const { client, users } = createClient();
  try {
    await client.connect();
    const updateResponse = await users.updateOne(
      { id: id },
      { $set: { resetID: verifyCode } }
    );

    if (updateResponse.modifiedCount <= 0) {
      res
        .status(500)
        .json({
          error: "Failed to send email, please try again in one minute.",
        });
    }

    const emailConfig: IEmailConfig = {
      sendEmailTo: email,
      subject: "Change Password",
      text: `Your password-change verification code: ${verifyCode}`,
      html: `<p>Your password-change code: ${verifyCode}</p>
        <p>If you aren't attempting to change your password, someone may be logged into your account. Change your password to secure your account.</p>`,
    };
    sendEmail(emailConfig);
  } finally {
    await client.close();
  }

  res.status(200).json({ msg: "Verification code sent to email" });
};
