import { api } from "@nitric/sdk";
import OpenAI from "openai";
import zlib from "zlib";
import { promisify } from "util";
import "dotenv/config";

const gzip = promisify(zlib.gzip);

const TIMEOUT_MILLIS = 55 * 1000;
const DEFAULT_IMAGE_SIZE = "1024x1024";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ["*"],
  "Access-Control-Allow-Methods": ["POST", "OPTIONS"],
  "Access-Control-Allow-Headers": ["Content-Type", "Accept-Encoding"],
  "Access-Control-Max-Age": ["86400"],
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type ProviderKey = "openai";
export type OpenAIModelId = "dall-e-2" | "dall-e-3";

interface GenerateImageRequest {
  prompt: string;
  provider: ProviderKey;
  modelId: OpenAIModelId;
}

const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMillis: number
): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Request timed out after ${timeoutMillis}ms`)),
        timeoutMillis
      )
    ),
  ]);
};

const validateRequest = (
  requestBody: GenerateImageRequest,
  requestId: string
): { isValid: boolean; error?: string } => {
  if (!requestBody.prompt?.trim()) {
    console.error(`[${requestId}] Missing or empty prompt`);
    return { isValid: false, error: "Prompt is required" };
  }

  if (requestBody.provider !== "openai") {
    console.error(`[${requestId}] Invalid provider: ${requestBody.provider}`);
    return { isValid: false, error: "Only OpenAI provider is supported" };
  }

  if (!["dall-e-2", "dall-e-3"].includes(requestBody.modelId)) {
    console.error(`[${requestId}] Invalid model ID: ${requestBody.modelId}`);
    return { isValid: false, error: "Invalid model ID" };
  }

  return { isValid: true };
};

const imageApi = api("image-api");

imageApi.options("/generate-image", async (ctx) => {
  ctx.res.headers = CORS_HEADERS;
  ctx.res.status = 204;
  return ctx;
});

imageApi.post("/generate-image", async (ctx) => {
  ctx.res.headers = {
    ...CORS_HEADERS,
    "Content-Encoding": ["gzip"],
    "Content-Type": ["application/json"],
  };

  const requestId = Math.random().toString(36).substring(7);
  console.log(`[${requestId}] Starting image generation request`);

  let requestBody: GenerateImageRequest;
  try {
    requestBody = ctx.req.json() as GenerateImageRequest;
    console.log(`[${requestId}] Request body:`, {
      prompt: requestBody.prompt?.substring(0, 50) + "...",
      provider: requestBody.provider,
      modelId: requestBody.modelId,
    });
  } catch (error) {
    console.error(`[${requestId}] Failed to parse request body:`, error);
    ctx.res.status = 400;
    ctx.res.body = await gzip(
      JSON.stringify({ error: "Invalid JSON in request body" })
    );
    return ctx;
  }

  const validation = validateRequest(requestBody, requestId);
  if (!validation.isValid) {
    ctx.res.status = 400;
    ctx.res.body = await gzip(JSON.stringify({ error: validation.error }));
    return ctx;
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error(`[${requestId}] OPENAI_API_KEY is not set`);
    ctx.res.status = 500;
    ctx.res.body = await gzip(
      JSON.stringify({ error: "OpenAI API key not configured" })
    );
    return ctx;
  }

  const startstamp = performance.now();
  console.log(`[${requestId}] Sending request to OpenAI API`);

  try {
    const imageResponse = await withTimeout(
      openai.images.generate({
        model: requestBody.modelId,
        prompt: requestBody.prompt,
        size: DEFAULT_IMAGE_SIZE,
        response_format: "b64_json",
        n: 1,
      }),
      TIMEOUT_MILLIS
    );

    const elapsed = ((performance.now() - startstamp) / 1000).toFixed(1);

    if (!imageResponse.data?.[0]?.b64_json) {
      throw new Error("Response missing image data");
    }

    console.log(`[${requestId}] Request completed successfully`);
    ctx.res.status = 200;

    const responseData = {
      provider: requestBody.provider,
      image: imageResponse.data[0].b64_json,
      elapsed: `${elapsed}s`,
    };

    ctx.res.body = await gzip(JSON.stringify(responseData));
    return ctx;
  } catch (error) {
    console.error(`[${requestId}] Error generating image:`, error);
    ctx.res.status = 500;
    ctx.res.body = await gzip(
      JSON.stringify({ error: `Error generating image: ${error.message}` })
    );
    return ctx;
  }
});

export default imageApi;
