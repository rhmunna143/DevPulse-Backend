export interface IIssueCreationRequest {
  title: string;
  description: string;
  type: "bug" | "feature_request";
}

export interface IIssueResponse {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface IIssueReporter {
  id: number;
  name: string;
  role: "contributor" | "maintainer";
}

export interface IIssueListResponse {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: "open" | "in_progress" | "resolved";
  reporter: IIssueReporter;
  created_at: Date;
  updated_at: Date;
}

export type IIssueSingleResponse = IIssueListResponse;

export interface IIssueQueryParams {
  sort?: "newest" | "oldest";
  status?: "open" | "in_progress" | "resolved";
  type?: "bug" | "feature_request";
}
