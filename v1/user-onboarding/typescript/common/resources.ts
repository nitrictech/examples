import { api, kv, topic } from "@nitric/sdk";

// Stores
export const custStore = kv("customers").for("writing");
// API
export const custApi = api("public");
// Topics
export const custCreatePub = topic("created").for("publishing");
export const custCreateSub = topic("created");
