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
  status: string;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface TIssueResponse {
  id: number;
  title: string;
  description: string;
  type: "bug" | "feature_request";
  status: string;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}
