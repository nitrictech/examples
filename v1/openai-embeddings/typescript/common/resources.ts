import { api } from "@nitric/sdk";
import { createClient } from "@supabase/supabase-js";
import { Configuration, OpenAIApi } from "openai";
import { Database } from "../db_types";

export const docsApi = api("openai");

// OpenAI configuration creation
const configuration = new Configuration({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

export const openai = new OpenAIApi(configuration);
