import { Router } from "express";
import { createNewIssue } from "./issues.controllers.js";
import { authMiddleware } from "../../middlewares/middlewares.js";

export const issuesRouter = Router();

issuesRouter.post("/issues", authMiddleware, createNewIssue);
