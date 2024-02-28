import { Request, Response } from "express";
import { validateString } from "../../validations/validate-string.js";
import { createClient } from "../../helpers/create-client.js";
import { getDateRangeProjection } from "../../helpers/get-date-range-projection.js";

export const getThumbnailsInfo = async (req: Request, res: Response) => {
  const id = req.body.auth.userId;
  if (!validateString(id, 2, 99)) {
    res.status(400).json({ error: "Invalid authentication" });
    return;
  }

  const getOneWeekProjection = () => {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 604800000); // Subtracting milliseconds in a week)

    return getDateRangeProjection(oneWeekAgo, today);
  };

  const agPipeline = [
    {
      $match: { id: id },
    },
    { $project: { arrayofkeyvalue: { $objectToArray: "$projects" } } },
    { $unwind: "$arrayofkeyvalue" },
    { $group: { _id: null, allkeys: { $addToSet: "$arrayofkeyvalue.k" } } },
  ];

  //get projects info
  const { client, users } = createClient();
  try {
    await client.connect();

    //aggregation returns the names of each project which is then used to query the last week of information for each project
    //which is used to display on the thumbnails
    const aggregrationResponse = await users.aggregate(agPipeline).toArray();
    if (!aggregrationResponse) {
      res
        .status(500)
        .json({ error: "Server Error. Please try again shortly." });
    }

    console.log(aggregrationResponse);
    let projectNames: string[] = [];
    if (
      typeof aggregrationResponse === "object" &&
      aggregrationResponse[0]["allkeys"]
    ) {
      projectNames = aggregrationResponse[0].allkeys;
    }

    if (projectNames.length <= 0) {
      res.status(200).json({
        projects: {},
      });
    }

    const getProjectNamesWithProjection = () => {
      const projectsWithProjection: { [projectName: string]: object | any } =
        {};
      const viewDatesProjections = getOneWeekProjection();
      for (let i = 0; i < projectNames.length; i++) {
        const currProjectName = projectNames[i];
        projectsWithProjection[currProjectName] = {
          viewDates: viewDatesProjections,
          totalViews: 1,
        };
      }
      return projectsWithProjection;
    };

    //gets the last week of view information for all projects
    const projectsWithProjection = getProjectNamesWithProjection();
    const findUserResponse = await users.findOne(
      { id: id },
      {
        projection: {
          permID: 1,
          projects: projectsWithProjection,
        },
      }
    );

    if (
      findUserResponse &&
      findUserResponse.projects !== null &&
      findUserResponse.permID !== null
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
