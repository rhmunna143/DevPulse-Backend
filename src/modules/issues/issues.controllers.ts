import { sendError, sendSuccess } from "../../utility/utility.js";
import type { Request, Response } from "express";
import type {
  IIssueCreationRequest,
  IIssueQueryParams,
} from "./issues.interfaces.js";
import { IssueServices } from "./issues.services.js";

export const createNewIssue = async (req: Request, res: Response) => {
  const { title, description, type } = req.body as IIssueCreationRequest;

  if (!title || !description || !type) {
    return sendError(res, 400, "title, description, and type are required");
  }

  if (title.length > 150) {
    return sendError(res, 400, "title must be at most 150 characters");
  }

  if (description.length < 20) {
    return sendError(res, 400, "description must be at least 20 characters");
  }

  if (type !== "bug" && type !== "feature_request") {
    return sendError(res, 400, "type must be 'bug' or 'feature_request'");
  }

  // reporter id form the auth middleware
  const reporter = req.user;

  if (!reporter || typeof reporter.id !== "number") {
    return sendError(res, 401, "unauthorized");
  }

  const created = await IssueServices.createIssue({
    title,
    description,
    type,
    reporter_id: reporter.id,
  });

  return sendSuccess(res, 201, "Issue created successfully", created);
};

export const getAllIssues = async (
  req: Request<unknown, unknown, unknown, IIssueQueryParams>,
  res: Response,
) => {
  const filters: IIssueQueryParams = {};

  if (req.query.sort) {
    filters.sort = req.query.sort;
  }

  if (req.query.status) {
    filters.status = req.query.status;
  }

  if (req.query.type) {
    filters.type = req.query.type;
  }

  const issues = await IssueServices.getAllIssues(filters);

  return sendSuccess(
    res,
    200,
    issues.length > 0 ? "Issues fetched successfully" : "No issues found",
    issues,
  );
};

export const getIssueById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const issueId = Number(req.params.id);

  if (!Number.isInteger(issueId) || issueId <= 0) {
    return sendError(res, 400, "invalid issue id");
  }

  const issue = await IssueServices.getIssueById(issueId);

  if (!issue) {
    return sendError(res, 404, "issue not found");
  }

  return sendSuccess(res, 200, "Issue fetched successfully", issue);
};
