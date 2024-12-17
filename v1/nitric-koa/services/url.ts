import Koa from "koa";
import Router from "koa-router";
import { http, bucket } from "@nitric/sdk";

export const imgBucket = bucket("images").allow("read", "write");

const app = new Koa();
const router = new Router();

router.get("/upload/:id", async (ctx) => {
  try {
    const { id } = ctx.params;
    const img = imgBucket.file(`images/${id}/photo.png`);

    ctx.body = {
      url: await img.getUploadUrl(),
    };
  } catch (err) {
    ctx.throw(500, "Error getting file URL");
  }
});

app.use(router.routes());

http(app, () => {
  console.log(`Application started`);
});
