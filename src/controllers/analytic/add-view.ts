import { Request, Response } from "express";
import { validateString } from "../../validations/validate-string.js";
import { createClient } from "../../helpers/create-client.js";
import { getViewDate } from "../../helpers/get-view-date.js";

export const addView = async (req: Request, res: Response) => {
  const permID_projectName = req.params.permID_projectName;
  const id_name_split_index = permID_projectName.indexOf("-");
  const [permID, projectName] = [
    permID_projectName.slice(0, id_name_split_index),
    permID_projectName.slice(
      id_name_split_index + 1,
      permID_projectName.length
    ),
  ];
  if (!validateString(permID, 2, 99) || !validateString(projectName, 2, 99)) {
    res.status(400).json({ error: "Invalid user or project ID(s)" });
    return;
  }

  //add project view to db
  const { client, users } = createClient();
  try {
    await client.connect();
    const addTotalViewResponse = await users.updateOne(
      { permID: permID },
      { $inc: { [`projects.${projectName}.totalViews`]: 1 } }
    );

    const [year, month, day] = getViewDate();
    const addDatedViewResponse = await users.updateOne(
      { permID: permID },
      {
        $inc: {
          [`projects.${projectName}.viewDates.${year}.${month}.${day}`]: 1,
        },
      }
    );

    if (
      addTotalViewResponse.modifiedCount >= 1 &&
      addDatedViewResponse.modifiedCount >= 1
    ) {
      res.status(200).send();
    } else {
      res.status(500).send();
    }
  } finally {
    await client.close();
  }
};
