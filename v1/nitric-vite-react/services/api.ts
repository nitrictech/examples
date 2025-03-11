import { api } from "@nitric/sdk";

const mainApi = api("main");

mainApi.get("/hello/:name", async (ctx) => {
  const { name } = ctx.req.params;

  ctx.res.body = `Hello ${name}`;

  return ctx;
});
