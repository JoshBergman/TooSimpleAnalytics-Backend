import { Request, Response } from "express";
import { validateString } from "../../validations/validate-string.js";
import { createClient } from "../../helpers/create-client.js";
import { makeDummyData } from "../../helpers/make-dummy-data.js";

export const createDummyProject = async (req: Request, res: Response) => {
  const id = req.body.auth.userId;
  const projectName = req.body.projectName;
  if (!validateString(id, 2, 99) || !validateString(projectName, 2, 99)) {
    res.status(400).json({ error: "Invalid authentication" });
    return;
  }

  //gather dummy data
  const [totalViews, viewDates] = makeDummyData();

  //add project to db under user.projects
  const { client, users } = createClient();
  try {
    await client.connect();
    const addProjectResponse = await users.updateOne(
      { id: id },
      {
        $set: {
          [`projects.${projectName}`]: {
            totalViews: totalViews,
            viewDates: viewDates,
          },
        },
      }
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
