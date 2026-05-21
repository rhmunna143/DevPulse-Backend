import { Router } from "express";
import {
  createNewIssue,
  getAllIssues,
  getIssueById,
} from "./issues.controllers.js";
import {
  authMiddleware,
  authorizeRole,
} from "../../middlewares/middlewares.js";

export const issuesRouter = Router();

issuesRouter.post(
  "/issues",
  authMiddleware,
  authorizeRole("contributor", "maintainer"),
  createNewIssue,
);

issuesRouter.get("/issues", getAllIssues);

issuesRouter.get("/issues/:id", getIssueById);
