import { schedule, bucket } from "@nitric/sdk";

const assets = bucket("assets").for("deleting");

// A schedule that cleans up files in a bucket every 3 days
schedule("tidy").every("3 days", async (ctx) => {
  const files = await assets.files();
  await Promise.all(files.map(async (file) => await file.delete()));
});
