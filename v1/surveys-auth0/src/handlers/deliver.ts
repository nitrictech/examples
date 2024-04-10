import { submissionTopic } from "../resources";

submissionTopic.subscribe(({ req }) => {
  console.log(`Delivering submission ${req.json().submissionId}`);
});
