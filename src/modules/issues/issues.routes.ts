import { Router } from "express";
import { createNewIssue } from "./issues.controllers.js";
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
