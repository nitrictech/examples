import { bucket } from "@nitric/sdk";

export const receiptFiles = bucket("receipts").for(
  "writing",
  "reading",
  "deleting"
);
