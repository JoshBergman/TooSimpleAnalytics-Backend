import { Request, Response } from "express";
import { createClient } from "../../helpers/create-client.js";
import { createToken } from "../../middleware/JWT/token-logic/create-token.js";
import { validateEmail } from "../../validations/validate-email.js";
import { validateString } from "../../validations/validate-string.js";

export const login = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!validateEmail(email) || !validateString(password, 2, 99)) {
    res.status(400).json({ error: "Invalid email or password" });
    return;
  }

  const { client, users } = createClient();
  try {
    //get existing account
    await client.connect();
    const user = await users.findOne({ email: email });

    //if no account exists or wrong password
    if (!user || password !== user.password) {
      res.status(400).json({ error: "Email or password is incorrect" });
      return;
    }

    //upon successful login, send JWT to user
    if (user.password === password) {
      const token = createToken({ id: user.id, email: user.email });
      res.status(200).json({ token });
    }
  } finally {
    await client.close();
  }
};
