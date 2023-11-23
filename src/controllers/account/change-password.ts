// I dont have an email provider yet
// so I will just have the user provide the existing and new password

//This controller is bound to change once I have email provider
import { Request, Response } from "express";
import { validateEmail } from "../../validations/validate-email.js";
import { validateString } from "../../validations/validate-string.js";
import { createClient } from "../../helpers/create-client.js";
import { generateEmailVerificationCode } from "../../helpers/make-verify-email-code.js";
import { generateId } from "../../helpers/make-id.js";
import { createToken } from "../../middleware/JWT/token-logic/create-token.js";

export const changePassword = async (req: Request, res: Response) => {
  const id = req.body.auth.userId;
  const email = req.body.auth.email;
  const newPassword = req.body.password;
  const verification = req.body.verification;

  if (!validateString(newPassword, 2, 99)) {
    res.status(400).json({ error: "Invalid password syntax" });
    return;
  }

  // 1. get existing resetID (verification code)
  // 2. compare verification code's
  // 3. change password if all matches up
  const { client, users } = createClient();
  try {
    await client.connect();
    const user = await users.findOne({ id: id });
    if (user && user.resetID) {
      if (verification === user.resetID) {
        //When verification code matches update password
        const newVerifyCode = generateEmailVerificationCode(); //used so that a password change code is not used more than once
        const newID = generateId(); // creating a new id resets the JWT and logs out existing instances
        const updateResponse = await users.updateOne(
          { id: id },
          { $set: { password: newPassword, resetID: newVerifyCode, id: newID } }
        );

        if (updateResponse && updateResponse.modifiedCount >= 1) {
          const newToken = createToken({ id: id, email: email }); //keeps the user logged in as the previously held jwt is invalidated by new id value
          res
            .status(200)
            .json({ token: newToken, message: "Password changed" });
          return;
        }
      } else {
        //case when verification code does not match
        res.status(401).json({ error: "Verification code invalid." });
      }
    }
    res
      .status(400)
      .json({ error: "Password not updated, please try again later." });
  } finally {
    await client.close();
  }
};
