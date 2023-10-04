import { Request, Response } from "express";
import { validateString } from "../../validations/validate-string.js";
import { createClient } from "../../helpers/create-client.js";

export const addView = async (req: Request, res: Response) => {
  const permID_projectName = req.params.permID_projectName;
  const [permID, projectName] = permID_projectName.split("-");
  if (!validateString(permID, 2, 99) || !validateString(projectName, 2, 99)) {
    res.status(400).json({ error: "Invalid user or project ID(s)" });
    return;
  }

  //add project view to db
  const { client, users } = createClient();
  try {
    await client.connect();
    const addViewResponse = await users.updateOne(
      { permID: permID },
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
