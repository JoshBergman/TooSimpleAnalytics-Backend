import { Request, Response } from "express";
import { validateString } from "../../validations/validate-string.js";
import { createClient } from "../../helpers/create-client.js";
import { validateNumber } from "../../validations/validate-number.js";
import { getDateRangeProjection } from "../../helpers/get-date-range-projection.js";

export const getProjectInfoByDate = async (req: Request, res: Response) => {
  const id = req.body.auth.userId;
  const projectName = req.body.projectName;
  const startDate: number | Date = parseInt(req.body.startDate); //expect to get in Date.getTime() format
  let endDate: number | Date = parseInt(req.body.endDate); //expect to get in Date.getTime() format
  if (!validateString(id, 2, 99)) {
    res.status(400).json({ error: "Invalid authentication" });
    return;
  }
  if (!validateString(projectName, 1, 99)) {
    res.status(400).json({ error: "Invalid Project Name" });
    return;
  }
  if (!validateNumber(startDate, 1, Infinity)) {
    res.status(400).json({ error: "Invalid Start Date" });
  }
  if (!validateNumber(endDate, 1, Infinity)) {
    endDate = new Date(new Date().getTime());
  }

  const viewDatesProjections = getDateRangeProjection(
    new Date(startDate),
    new Date(endDate)
  );

  //get project info
  const { client, users } = createClient();
  try {
    await client.connect();
    const findUserResponse = await users.findOne(
      { id: id },
      {
        projection: {
          projects: {
            [projectName]: { viewDates: viewDatesProjections },
          },
        },
      }
    );
    console.log(findUserResponse);
    if (findUserResponse) {
      console.log(findUserResponse.projects);
    }
    if (findUserResponse && findUserResponse.projects !== null) {
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
