import { api } from "@nitric/sdk";
import { cors } from "@repo/cors";
import { log } from "@repo/logger";

// Define a new service called 'hello'
const main = api("main", {
  middleware: [cors],
});

main.get("/message/:name", async (ctx) => {
  const { name } = ctx.req.params;

  log(`Received request for ${name}`);

  return ctx.res.json({ message: `hello ${name}` });
});

main.get("/status", async (ctx) => {
  return ctx.res.json({ ok: true });
});
