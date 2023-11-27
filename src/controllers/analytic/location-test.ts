import { Request, Response } from "express";
import { get_location_from_ip } from "../../helpers/get-location-from-ip.js";

export const locationTest = async (req: Request, res: Response) => {
  //   const ip = req.clientIp;
  const ip = "2601:441:8201:3ea0:496b:3b27:b79c:774f";
  if (typeof ip === "string") {
    const location = await get_location_from_ip(ip);

    if (location) {
      console.log(location);
      res.json(location).status(200);
    } else {
      console.log("Bad IP");
    }
  }

  res.status(200).send();
};
