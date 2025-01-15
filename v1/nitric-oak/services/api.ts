import { http, bucket } from "npm:@nitric/sdk";
import { Application, Router } from "jsr:@oak/oak";

export const imgBucket = bucket("images").allow("read", "write");

const app = new Application();
const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());

router.get("/upload/:id", async (ctx) => {
  try {
    const img = imgBucket.file(`images/${ctx.params.id}/photo.png`);

    ctx.response.type = "application/json";
    ctx.response.body = { url: await img.getUploadUrl() };

    return ctx;
  } catch (_err) {
    ctx.response.status = 500;
    ctx.response.body = "Error getting file URL";
  }
});

async function bootstrap(port: number) {
  await app.listen({ port });

  return {
    on: app.addEventListener,
  };
}

http(bootstrap);
