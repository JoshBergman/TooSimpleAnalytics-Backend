import { Request, Response } from "express";
import { validateString } from "../../validations/validate-string.js";
import { createClient } from "../../helpers/create-client.js";
import { getViewDate } from "../../helpers/get-view-date.js";
import { get_location_from_ip } from "../../helpers/get-location-from-ip.js";

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

  // get ip then location from the ip
  const ip = req.clientIp;
  let location = null;
  if (typeof ip === "string") {
    location = await get_location_from_ip(ip);
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
    const dbDayPath = `projects.${projectName}.viewDates.${year}.${month}.${day}`;
    const updateConfig = {
      $inc: {
        [`${dbDayPath}.views`]: 1,
      },
    };
    if (location) {
      const { countryCode, region } = location;
      if (countryCode.toUpperCase() === "US") {
        updateConfig.$inc[
          `${dbDayPath}.locations.${countryCode}.${region}`
        ] = 1; //add state level for us views
      } else {
        updateConfig.$inc[`${dbDayPath}.locations.${countryCode}`] = 1;
      }
    }
    const addDatedViewResponse = await users.updateOne(
      { permID: permID },
      updateConfig
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
