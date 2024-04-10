import { topic } from "@nitric/sdk";
import { Submission, FormData } from "../forms";

export const submissionTopic =
  topic<Submission<FormData>>("transaction-events");
