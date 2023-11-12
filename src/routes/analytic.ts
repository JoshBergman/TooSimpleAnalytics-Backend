import { Router } from "express";
import { authenticate } from "../middleware/JWT/authenticate.js";
import { createProject } from "../controllers/analytic/create-project.js";
import { addView } from "../controllers/analytic/add-view.js";
import { getProjectsInfo } from "../controllers/analytic/get-projects-info.js";
import { removeProject } from "../controllers/analytic/remove-project.js";
import { createDummyProject } from "../controllers/analytic/create-dummy-project.js";

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

router.post("/create-project/dummy", authenticate, (req, res) => {
  createDummyProject(req, res);
});

router.post("/delete-project", authenticate, (req, res) => {
  removeProject(req, res);
});

export default router;
