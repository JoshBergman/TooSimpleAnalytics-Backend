import { Request, Response } from "express";
import { createToken } from "../../middleware/JWT/token-logic/create-token.js";
import { generateId } from "../../helpers/make-id.js";
import { createClient } from "../../helpers/create-client.js";

import { IUser } from "../../interfaces/user.js";

export const createAccount = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const userID = generateId();

  const user: IUser = {
    id: userID,
    email: email,
    password: password,
    projects: [],
  };

  //add user to db
  const { client, users } = createClient();
  try {
    const emailExists = await users.findOne({ email: email });
    if (emailExists) {
      res.status(400).send("Email already exists");
      return;
    }

    await client.connect();
    await users.insertOne(user);
  } finally {
    await client.close();
  }

  //create and send JWT to user
  const token = createToken({ id: userID, email: email });

  res.status(200);
  res.send({ token });
};
