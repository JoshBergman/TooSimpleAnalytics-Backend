import { Request, Response } from "express";
import { validateString } from "../../validations/validate-string.js";
import { createClient } from "../../helpers/create-client.js";

export const getProjectsInfo = async (req: Request, res: Response) => {
  const id = req.body.auth.userId;
  if (!validateString(id, 2, 99)) {
    res.status(400).json({ error: "Invalid authentication" });
    return;
  }

  //get permID, and projects info
  const { client, users } = createClient();
  try {
    await client.connect();
    const findUserResponse = await users.findOne(
      { id: id },
      { projection: { permID: 1, projects: 1 } }
    );

    if (
      findUserResponse &&
      findUserResponse.permID !== null &&
      findUserResponse.projects !== null
    ) {
      res.status(200).json({
        projectsID: findUserResponse.permID,
        projects: findUserResponse.projects,
      });
    } else {
      res
        .status(500)
        .json({ error: "Failed to get projects. Please try again shortly." });
    }
  } finally {
    await client.close();
  }
};
