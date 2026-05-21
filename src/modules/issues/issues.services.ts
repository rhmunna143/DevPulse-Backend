import type {
  IIssueCreationRequest,
  IIssueQueryParams,
  IIssueResponse,
} from "./issues.interfaces.js";
import { sql } from "../../db/db.js";

export class IssueServices {
  static async createIssue(
    issueData: IIssueCreationRequest & { reporter_id: number },
  ) {
    const { title, description, type, reporter_id } = issueData;

    const rows = (await sql`
      INSERT INTO issues (title, description, type, reporter_id)
      VALUES (${title}, ${description}, ${type}, ${reporter_id})
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `) as IIssueResponse[];

    return rows[0];
  }

  static async getAllIssues(filters: IIssueQueryParams = {}) {
    const sortOrder = filters.sort === "oldest" ? "ASC" : "DESC";
    const status = filters.status?.trim() || null;
    const type = filters.type || null;

    const rows = (await (sortOrder === "ASC"
      ? sql`
          SELECT id, title, description, type, status, reporter_id, created_at, updated_at
          FROM issues
          WHERE (${status}::text IS NULL OR status = ${status})
            AND (${type}::text IS NULL OR type = ${type})
          ORDER BY created_at ASC
        `
      : sql`
          SELECT id, title, description, type, status, reporter_id, created_at, updated_at
          FROM issues
          WHERE (${status}::text IS NULL OR status = ${status})
            AND (${type}::text IS NULL OR type = ${type})
          ORDER BY created_at DESC
        `)) as IIssueResponse[];

    return rows;
  }
}
