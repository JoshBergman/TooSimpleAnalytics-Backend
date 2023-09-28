// I dont have an email provider yet
// so I will just have the user provide the existing and new password

//This controller is bound to change once I have email provider
import { Request, Response } from "express";
import { validateEmail } from "../../validations/validate-email.js";
import { validateString } from "../../validations/validate-string.js";
import { createClient } from "../../helpers/create-client.js";

export const changePassword = async (req: Request, res: Response) => {
  const email = req.body.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  if (
    !validateEmail(email) ||
    !validateString(oldPassword, 2, 99) ||
    !validateString(newPassword, 2, 99)
  ) {
    res.status(400).json({ error: "Invalid email or password" });
    return;
  }

  //get existing password and if it is a match update password to new
  const { client, users } = createClient();
  try {
    await client.connect();
    const user = await users.findOne({ email: email });

    if (!user || oldPassword !== user.password) {
      res.status(400).json({ error: "Email or password is incorrect" });
      return;
    }

    const updateResponse = await users.updateOne(
      { email: email },
      { $set: { password: newPassword } }
    );

    if (updateResponse && updateResponse.modifiedCount >= 1) {
      res.status(200).json({ message: "Password updated" });
    } else {
      res
        .status(400)
        .json({ error: "Password not updated, please try again later" });
    }
  } finally {
    await client.close();
  }
};
