import { Router } from "express";
import { authenticate } from "../middleware/JWT/authenticate.js";
import { createProject } from "../controllers/analytic/create-project.js";
import { addView } from "../controllers/analytic/add-view.js";

export const router = Router();

router.get("/view/:userID_projectName", (req, res) => {
  addView(req, res);
});

router.post("/create-project", authenticate, (req, res) => {
  createProject(req, res);
});

export default router;
