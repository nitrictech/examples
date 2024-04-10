import { HttpContext, HttpMiddleware, api } from "@nitric/sdk";
import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { type DecodedIdToken, getAuth } from "firebase-admin/auth";

const serviceAccount = JSON.parse(
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
);

// Initialize Firebase Admin SDK
const app = initializeApp({
  credential: credential.cert(serviceAccount),
});

// CORS middleware if we want to use API from browser
const cors: HttpMiddleware = (ctx, next) => {
  ctx.res.headers["Access-Control-Allow-Origin"] = ["*"];
  ctx.res.headers["Access-Control-Allow-Headers"] = [
    "Origin, Content-Type, Accept, Authorization",
  ];
  ctx.res.headers["Access-Control-Allow-Methods"] = ["GET,POST,DELETE,OPTIONS"];

  return next(ctx);
};

// Middleware to authenticate requests
const authenticate: HttpMiddleware = async (ctx: HttpContentWithUser, next) => {
  const idToken = ctx.req.headers.authorization as string;

  // ignore OPTIONS requests
  if (ctx.req.method === "OPTIONS") {
    return ctx;
  }

  if (!idToken) {
    ctx.res.status = 401;
    return ctx.res.json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = await getAuth(app).verifyIdToken(
      idToken.split("Bearer ")[1] as string
    );
    ctx.req.user = decodedToken;
    next(ctx);
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    ctx.res.status = 403;

    return ctx.res.json({ error: "Unauthorized" });
  }
};

const privateApi = api("private", {
  middleware: [cors, authenticate],
});

type HttpContentWithUser = HttpContext & { req: { user: DecodedIdToken } };

// options for CORS
privateApi.options("/", (ctx) => ctx);

privateApi.get("/", (ctx: HttpContentWithUser) => {
  return ctx.res.json({
    message: "This is a protected route",
    user: ctx.req.user,
  });
});
