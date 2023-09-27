import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./token-logic/verify-token.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send("Unauthorized - No Auth Header");
    return;
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  const verifiedToken = verifyToken(token); // returns false or decoded payload as {id, email}
  if (verifiedToken) {
    //using req.body.auth to store the decoded payload as Im too lazy to make a new type for this
    req.body.auth = {};
    req.body.auth.userId = verifiedToken.id;
    req.body.auth.email = verifiedToken.email;
    next();
  } else {
    res.status(401).send("Unauthorized - Invalid Token");
    return;
  }
};
