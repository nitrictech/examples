import { bucket, http } from "@nitric/sdk";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

async function bootstrap(port: number) {
  return serve({
    fetch: app.fetch,
    port,
  });
}

export const imgBucket = bucket("images").allow("read", "write");

app.get("/upload/:id", async (c) => {
  try {
    const { id } = c.req.param();
    const img = imgBucket.file(`images/${id}/photo.png`);

    return c.json({ url: await img.getUploadUrl() });
  } catch (err) {
    c.status(500);
    c.text("Error getting file URL");
  }
});

http(bootstrap, () => {
  console.log(`Application started`);
});
