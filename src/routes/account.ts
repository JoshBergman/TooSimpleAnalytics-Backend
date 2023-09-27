import { Router } from "express";
import { createAccount } from "../controllers/account/create-account.js";
import { verifyToken } from "../middleware/JWT/verify-token.js";

export const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World! @ acc");
});

router.post("/create", (req, res) => {
  createAccount(req, res);
});

router.post("/authtest", (req, res) => {
  const verifiedToken = verifyToken(req.body.token);
  if (verifiedToken) {
    res.send(verifiedToken);
  } else {
    res.send("Hello World! @ authTest");
  }
});

export default router;
