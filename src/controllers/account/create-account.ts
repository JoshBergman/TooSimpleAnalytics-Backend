import { Request, Response } from "express";
import { createToken } from "../../middleware/JWT/token-logic/create-token.js";
import { createClient } from "../../helpers/create-client.js";
import { validateEmail } from "../../validations/validate-email.js";
import { validateString } from "../../validations/validate-string.js";

export const createAccount = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const verifyCode = req.body.verification;
  let userID: string = "";
  if (!validateEmail(email)) {
    res.status(400).json({ error: "Invalid email syntax" });
    if (!validateString(password, 2, 99)) {
      res.status(400).json({ error: "Invalid password syntax" });
    }
    return;
  }

  // 1. find pre-verified account in db
  // 2. compare verifiaction codes
  // 3. if all is correct set the password to the account
  // 4. create and send account JWT
  const { client, users } = createClient();
  try {
    await client.connect();
    const account = await users.findOne({ email: email });
    if (!account) {
      res
        .status(400)
        .json({ error: "Email not found, please try signing up again." });
      return;
    }
    userID = account.id;

    if (account.verify !== verifyCode) {
      res.status(400).json({
        error:
          "Invalid email verification code. Please restart signup process.",
      });
      return;
    }

    const updateResponse = await users.updateOne(
      { email: email },
      { $set: { password: password } }
    );

    if (updateResponse && updateResponse.modifiedCount >= 1) {
    } else {
      res.status(500).json({
        error: "Failed to activate account, please try again in one minute.",
      });
      return;
    }
  } finally {
    await client.close();
  }

  //create and send JWT to user
  const token = createToken({ id: userID, email: email });

  res.status(200).json({ token });
};
