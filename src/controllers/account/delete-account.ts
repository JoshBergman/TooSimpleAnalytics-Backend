import { Request, Response } from "express";
import { validateString } from "../../validations/validate-string.js";
import { createClient } from "../../helpers/create-client.js";

export const deleteAccount = async (req: Request, res: Response) => {
  const id = req.body.auth.userId;
  if (!validateString(id, 2, 99)) {
    res.status(400).json({ error: "Invalid authentication" });
    return;
  }

  //delete account based on submitted jwt
  const { client, users } = createClient();
  try {
    await client.connect();
    const updateResponse = await users.deleteOne({ id: id });

    if (updateResponse && updateResponse.deletedCount >= 1) {
      res.status(200).json({ message: "Account Deleted" });
    } else {
      res
        .status(400)
        .json({ error: "Account not deleted, please try again later" });
    }
  } finally {
    await client.close();
  }
};
