import type {
  IIssueCreationRequest,
  IIssueQueryParams,
  IIssueListResponse,
  IIssueSingleResponse,
  IIssueResponse,
  IIssueReporter,
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

    const issuesWithReporter = await Promise.all(
      rows.map(async (issue) => {
        const reporterRows = (await sql`
          SELECT id, name, role
          FROM users
          WHERE id = ${issue.reporter_id}
        `) as IIssueReporter[];

        const reporter = reporterRows[0];

        if (!reporter) {
          throw new Error(`Reporter not found for issue ${issue.id}`);
        }

        return {
          id: issue.id,
          title: issue.title,
          description: issue.description,
          type: issue.type,
          status: issue.status,
          reporter,
          created_at: issue.created_at,
          updated_at: issue.updated_at,
        } as IIssueListResponse;
      }),
    );

    return issuesWithReporter;
  }

  static async getIssueById(
    issueId: number,
  ): Promise<IIssueSingleResponse | null> {
    const issue = await this.getIssueRecordById(issueId);

    if (!issue) {
      return null;
    }

    const reporterRows = (await sql`
      SELECT id, name, role
      FROM users
      WHERE id = ${issue.reporter_id}
    `) as IIssueReporter[];

    const reporter = reporterRows[0];

    if (!reporter) {
      throw new Error(`Reporter not found for issue ${issue.id}`);
    }

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      reporter,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
    } as IIssueSingleResponse;
  }

  static async getIssueRecordById(issueId: number) {
    const rows = (await sql`
      SELECT id, title, description, type, status, reporter_id, created_at, updated_at
      FROM issues
      WHERE id = ${issueId}
    `) as IIssueResponse[];

    return rows[0] ?? null;
  }

  static async updateIssueById(
    issueId: number,
    updates: {
      title?: string;
      description?: string;
      type?: "bug" | "feature_request";
      status?: "open" | "in_progress" | "resolved";
    },
  ) {
    const rows = (await sql`
      UPDATE issues
      SET
        title = COALESCE(${updates.title ?? null}, title),
        description = COALESCE(${updates.description ?? null}, description),
        type = COALESCE(${updates.type ?? null}, type),
        status = COALESCE(${updates.status ?? null}, status),
        updated_at = NOW()
      WHERE id = ${issueId}
      RETURNING id, title, description, type, status, reporter_id, created_at, updated_at
    `) as IIssueResponse[];

    return rows[0] ?? null;
  }

  static async deleteIssueById(issueId: number) {
    const rows = (await sql`
      DELETE FROM issues
      WHERE id = ${issueId}
      RETURNING id
    `) as Array<{ id: number }>;

    return rows[0] ?? null;
  }
}
