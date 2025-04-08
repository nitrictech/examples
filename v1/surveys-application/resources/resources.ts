import { bucket, kv, topic } from "@nitric/sdk";

export const output = bucket("receipts").allow("read", "write");
export const submissions = kv("submissions").allow("set", "get");
export const submitted = topic("form-submitted").allow("publish");
export const receipts = topic("form-submitted");
