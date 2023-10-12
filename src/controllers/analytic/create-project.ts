import { Request, Response } from "express";
import { validateString } from "../../validations/validate-string.js";
import { createClient } from "../../helpers/create-client.js";

export const createProject = async (req: Request, res: Response) => {
  const id = req.body.auth.userId;
  const projectName = req.body.projectName;
  if (!validateString(id, 2, 99) || !validateString(projectName, 2, 99)) {
    res.status(400).json({ error: "Invalid authentication" });
    return;
  }

  //add project to db under user.projects
  const { client, users } = createClient();
  try {
    await client.connect();
    const addProjectResponse = await users.updateOne(
      { id: id },
      { $set: { [`projects.${projectName}`]: { totalViews: 0 } } }
    );

    if (addProjectResponse.modifiedCount >= 1) {
      res.status(200).json({ message: "Project Added" });
    } else {
      res
        .status(400)
        .json({ error: "Failed to add project. Please try again later." });
    }
  } finally {
    await client.close();
  }
};
