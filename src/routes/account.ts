import { Router } from "express";
import { createAccount } from "../controllers/account/create-account.js";
import { authenticate } from "../middleware/JWT/authenticate.js";

export const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World! @ acc");
});

router.post("/create", (req, res) => {
  createAccount(req, res);
});

router.post("/authtest", authenticate, (req, res) => {
  res.send("Authorized");
});

export default router;
