import type {
  IIssueCreationRequest,
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
}
