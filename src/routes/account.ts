import { Router } from "express";
import { authenticate } from "../middleware/JWT/authenticate.js";

import { createAccount } from "../controllers/account/create-account.js";
import { login } from "../controllers/account/login.js";

export const router = Router();

router.post("/create", (req, res) => {
  createAccount(req, res);
});

router.post("/login", (req, res) => {
  login(req, res);
});

export default router;
