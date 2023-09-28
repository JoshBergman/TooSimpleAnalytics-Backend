import { Router } from "express";
import { authenticate } from "../middleware/JWT/authenticate.js";

import { createAccount } from "../controllers/account/create-account.js";
import { login } from "../controllers/account/login.js";
import { changePassword } from "../controllers/account/change-password.js";

export const router = Router();

router.post("/create", (req, res) => {
  createAccount(req, res);
});

router.post("/login", (req, res) => {
  login(req, res);
});

router.post("/change-password", (req, res) => {
  changePassword(req, res);
});

export default router;
