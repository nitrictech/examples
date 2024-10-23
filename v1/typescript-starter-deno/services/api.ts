import { api } from "npm:@nitric/sdk";

const helloApi = api("main");

helloApi.get("/hello/:name", async (ctx) => {
  const { name } = ctx.req.params;

  ctx.res.body = `Hello ${name}`;

  return ctx;
});
