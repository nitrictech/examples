export interface Submission<T> {
  submissionId: string;
  status: "saved" | "submitted";
  data: T;
}
