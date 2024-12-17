import { api, kv, topic } from "@nitric/sdk";

// Stores
export const custStore = kv("customers").allow("set");
// API
export const custApi = api("public");
// Topics
export const custCreatePub = topic("created").allow("publish");
export const custCreateSub = topic("created");
