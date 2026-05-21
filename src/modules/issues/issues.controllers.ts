import { sendError, sendSuccess } from "../../utility/utility.js";
import type { Request, Response } from "express";
import type {
  IIssueCreationRequest,
  IIssueQueryParams,
  IIssueUpdateRequest,
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

export const updateIssueById = async (
  req: Request<{ id: string }, unknown, IIssueUpdateRequest>,
  res: Response,
) => {
  const issueId = Number(req.params.id);

  if (!Number.isInteger(issueId) || issueId <= 0 || !issueId) {
    return sendError(res, 400, "invalid issue id");
  }

  const { title, description, type, status } = req.body;

  if (!title && !description && !type && !status) {
    return sendError(res, 400, "at least one field is required to update");
  }

  if (title !== undefined && title.length > 150) {
    return sendError(res, 400, "title must be at most 150 characters");
  }

  if (description !== undefined && description.length < 20) {
    return sendError(res, 400, "description must be at least 20 characters");
  }

  if (type !== undefined && type !== "bug" && type !== "feature_request") {
    return sendError(res, 400, "type must be 'bug' or 'feature_request'");
  }

  if (
    status !== undefined &&
    status !== "open" &&
    status !== "in_progress" &&
    status !== "resolved"
  ) {
    return sendError(
      res,
      400,
      "status must be 'open', 'in_progress', or 'resolved'",
    );
  }

  const reporter = req.user;

  if (!reporter || typeof reporter.id !== "number") {
    return sendError(res, 401, "unauthorized");
  }

  const issue = await IssueServices.getIssueRecordById(issueId);

  if (!issue) {
    return sendError(res, 404, "issue not found");
  }

  if (reporter.role !== "maintainer") {
    if (status !== undefined) {
      return sendError(res, 403, "only maintainer can change issue status");
    }

    if (issue.reporter_id !== reporter.id) {
      return sendError(res, 403, "forbidden");
    }

    if (issue.status !== "open") {
      return sendError(
        res,
        403,
        "only open issues can be updated by contributors",
      );
    }
  }

  const updates: IIssueUpdateRequest = {};

  if (title !== undefined) {
    updates.title = title;
  }

  if (description !== undefined) {
    updates.description = description;
  }

  if (type !== undefined) {
    updates.type = type;
  }

  if (status !== undefined) {
    updates.status = status;
  }

  if (reporter.role === "maintainer") {
    updates.status = "in_progress";
  }

  const updated = await IssueServices.updateIssueById(issueId, updates);

  if (!updated) {
    return sendError(res, 404, "issue not found");
  }

  return sendSuccess(res, 200, "Issue updated successfully", updated);
};

export const deleteIssueById = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const issueId = Number(req.params.id);

  if (!Number.isInteger(issueId) || issueId <= 0) {
    return sendError(res, 400, "invalid issue id");
  }

  const issue = await IssueServices.getIssueRecordById(issueId);

  if (!issue) {
    return sendError(res, 404, "issue not found");
  }

  const deleted = await IssueServices.deleteIssueById(issueId);

  if (!deleted) {
    return sendError(res, 404, "issue not found");
  }

  return sendSuccess(res, 200, "Issue deleted successfully", null);
};
