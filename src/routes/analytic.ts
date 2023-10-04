import { Router } from "express";
import { authenticate } from "../middleware/JWT/authenticate.js";
import { createProject } from "../controllers/analytic/create-project.js";
import { addView } from "../controllers/analytic/add-view.js";
import { getProjectsInfo } from "../controllers/analytic/get-projects-info.js";

export const router = Router();

router.get("/view/:permID_projectName", (req, res) => {
  addView(req, res);
});

router.get("/projects", authenticate, (req, res) => {
  getProjectsInfo(req, res);
});

router.post("/create-project", authenticate, (req, res) => {
  createProject(req, res);
});

export default router;
