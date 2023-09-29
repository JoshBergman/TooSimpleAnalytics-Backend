import { Router } from "express";
import { authenticate } from "../middleware/JWT/authenticate.js";
import { createProject } from "../controllers/analytic/create-project.js";

export const router = Router();

router.post("/create-project", authenticate, (req, res) => {
  createProject(req, res);
});

export default router;
