import { api, bucket } from "@nitric/sdk";

export const fileApi = api("main");

export const imgBucket = bucket("images").allow("read", "write");
