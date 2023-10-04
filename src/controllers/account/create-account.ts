import { Request, Response } from "express";
import { createToken } from "../../middleware/JWT/token-logic/create-token.js";
import { generateId } from "../../helpers/make-id.js";
import { createClient } from "../../helpers/create-client.js";
import { IUser } from "../../interfaces/user.js";
import { validateEmail } from "../../validations/validate-email.js";
import { validateString } from "../../validations/validate-string.js";
import { generatePermId } from "../../helpers/make-perm-id.js";

export const createAccount = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!validateEmail(email) || !validateString(password, 2, 99)) {
    res.status(400).json({ error: "Invalid email or password" });
    return;
  }

  //user object sent to db
  const userID = generateId();
  const permID = generatePermId();
  const user: IUser = {
    id: userID,
    permID: permID,
    email: email,
    password: password,
    projects: {},
  };

  //add user to db
  const { client, users } = createClient();
  try {
    const emailExists = await users.findOne({ email: email });
    if (emailExists) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    await client.connect();
    await users.insertOne(user);
  } finally {
    await client.close();
  }

  //create and send JWT to user
  const token = createToken({ id: userID, email: email });

  res.status(200).json({ token });
};
