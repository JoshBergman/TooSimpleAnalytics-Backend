import { Request, Response } from "express";
import { validateString } from "../../validations/validate-string.js";
import { createClient } from "../../helpers/create-client.js";

export const addView = async (req: Request, res: Response) => {
  const userID_projectName = req.params.userID_projectName;
  const [userID, projectName] = userID_projectName.split("-");
  if (!validateString(userID, 2, 99) || !validateString(projectName, 2, 99)) {
    res.status(400).json({ error: "Invalid user or project ID(s)" });
    return;
  }

  //add project view to db
  const { client, users } = createClient();
  try {
    await client.connect();
    const addViewResponse = await users.updateOne(
      { id: userID },
      { $inc: { [`projects.${projectName}.views`]: 1 } }
    );

    if (addViewResponse.modifiedCount >= 1) {
      res.status(200).send();
    } else {
      res.status(500).send();
    }
  } finally {
    await client.close();
  }
};
