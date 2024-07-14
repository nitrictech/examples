import { HttpMiddleware } from "@nitric/sdk";

export const optionsHandler: HttpMiddleware = (ctx, next) => {
  ctx.res.headers["Content-Type"] = ["text/html; charset=ascii"];
  ctx.res.status = 200;
  ctx.res.body = "OK";

  return ctx;
};

export const cors: HttpMiddleware = (ctx, next) => {
  ctx.res.headers["Access-Control-Allow-Origin"] = ["*"];
  ctx.res.headers["Access-Control-Allow-Headers"] = [
    "Origin, Content-Type, Accept, Authorization",
  ];
  ctx.res.headers["Access-Control-Allow-Methods"] = [
    "GET, PUT, POST, OPTIONS, DELETE",
  ];
  ctx.res.headers["Access-Control-Allow-Credentials"] = ["true"];

  if (next) {
    return next(ctx);
  }

  return ctx;
};
