import { api } from "@nitric/sdk";

const validate = (ctx, next) => {
  // Perform request validation, etc.
  console.log("This is  your middleware function running ...");
  next(ctx);
};

const helloApi = api("hello", {
  middleware: [validate],
});

helloApi.get("/hello/:name", async (ctx) => {
  const { name } = ctx.req.params;
  console.log("This is  your main function running ...");
  ctx.res.body = `Hello ${name}`;

  return ctx;
});
