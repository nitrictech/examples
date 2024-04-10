import { CreateCompletionRequest } from "openai";
import { oneLine, codeBlock } from "common-tags";
import GPT3Tokenizer from "gpt3-tokenizer";
import { docsApi, openai, supabase } from "../common/resources";

docsApi.post("/query", async (ctx) => {
  let query = ctx.req.json().query;

  // Moderate the content to comply with OpenAI T&C
  const moderationResponse = await openai.createModeration({
    input: query,
  });

  const [results] = moderationResponse.data.results;

  if (results.flagged) {
    throw new Error("Moderated content only. Query not valid.");
  }

  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: query.replaceAll("\n", " "),
  });

  if (embeddingResponse.status !== 200) {
    throw new Error("Failed to create embedding for question");
  }

  const [{ embedding }] = embeddingResponse.data.data;
  const { error: matchError, data: pageSections } = await supabase.rpc(
    "match_page_sections",
    {
      embedding,
      match_threshold: 0.78,
      match_count: 10,
      min_content_length: 50,
    }
  );
  if (matchError) {
    throw new Error("Failed to match page sections");
  }

  const tokenizer = new GPT3Tokenizer({ type: "gpt3" });
  let tokenCount = 0;
  let contextText = "";

  for (let i = 0; i < pageSections.length; i++) {
    const pageSection = pageSections[i];
    const content = pageSection.content;
    const encoded = tokenizer.encode(content);
    tokenCount += encoded.text.length;

    if (tokenCount >= 1500) {
      break;
    }

    contextText += `${content.trim()}\n---\n`;
  }

  const prompt = codeBlock`
    ${oneLine`
      You are a very enthusiastic Nitric representative who loves
      to help people! Given the following 'Context sections' from the Nitric
      documentation, answer the question using only that information,
      outputted in markdown format. If you are unsure and the answer
      is not explicitly written in the documentation, say
      "Sorry, I don't know how to help with that. Try asking another way."
    `}
    Context sections:
    ${contextText}
    Question: """
    ${query}
    """
    Answer as markdown (including related code snippets if available):
  `;

  const completionOptions: CreateCompletionRequest = {
    model: "text-davinci-003",
    // model: "gpt-4",
    prompt,
    max_tokens: 512,
    temperature: 0,
    stream: false,
  };

  const completion = await openai.createCompletion(completionOptions);
  console.log(prompt);
  ctx.res.body = completion.data.choices[0].text;
});
