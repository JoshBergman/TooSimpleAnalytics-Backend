import { Request, Response } from "express";
import { validateString } from "../../validations/validate-string.js";
import { createClient } from "../../helpers/create-client.js";

export const removeProject = async (req: Request, res: Response) => {
  const id = req.body.auth.userId;
  const projectName = req.body.projectName;
  if (!validateString(id, 2, 99) || !validateString(projectName, 2, 99)) {
    res.status(400).json({ error: "Invalid authentication" });
    return;
  }

  //remove project
  const { client, users } = createClient();
  try {
    await client.connect();
    const removeProjectResponse = await users.updateOne(
      { id: id },
      { $unset: { [`projects.${projectName}`]: 1 } }
    );

    if (removeProjectResponse.modifiedCount >= 1) {
      res.status(200).json({ message: "Project Removed" });
    } else {
      res
        .status(400)
        .json({ error: "Failed to remove project. Please try again later." });
    }
  } finally {
    await client.close();
  }
};
