import { docsApi, openai, supabase } from "../common/resources";
import { inspect } from "util";

import {
  EmbeddingSource,
  MarkdownEmbeddingSource,
  walk,
} from "../common/helper";

docsApi.get("/learn", async (ctx) => {
  const embeddingSources: EmbeddingSource[] = [
    ...(await walk("pages"))
      .filter(({ path }) => /\.md?$/.test(path))
      .map((entry) => new MarkdownEmbeddingSource("guide", entry.path)),
  ];

  for (const embeddingSource of embeddingSources) {
    const { path } = embeddingSource;

    try {
      const { sections } = await embeddingSource.load();
      const { error: upsertPageError, data: page } = await supabase
        .from("page")
        .upsert({
          path,
        })
        .select()
        .limit(1)
        .single();

      if (upsertPageError) {
        throw upsertPageError;
      }

      console.log(
        `[${path}] Adding ${sections.length} page sections (with embeddings)`
      );
      for (const { heading, content } of sections) {
        // OpenAI recommends replacing newlines with spaces for best results (specific to embeddings)
        const input = content.replace(/\n/g, " ");

        try {
          const embeddingResponse = await openai.createEmbedding({
            model: "text-embedding-ada-002",
            input,
          });

          if (embeddingResponse.status !== 200) {
            throw new Error(inspect(embeddingResponse.data, false, 2));
          }

          const [responseData] = embeddingResponse.data.data;

          const { error: insertPageSectionError, data: pageSection } =
            await supabase
              .from("page_section")
              .insert({
                page_id: page.id,
                heading,
                content,
                token_count: embeddingResponse.data.usage.total_tokens,
                embedding: responseData.embedding,
              })
              .select()
              .limit(1)
              .single();

          if (insertPageSectionError) {
            throw insertPageSectionError;
          }
        } catch (err) {
          // TODO: decide how to better handle failed embeddings
          console.error(
            `Failed to generate embeddings for '${path}' page section starting with '${input.slice(
              0,
              40
            )}...'`
          );

          throw err;
        }
      }
    } catch (err) {
      console.error(
        `Page '${path}' or one/multiple of its page sections failed to store properly. Page has been marked with null checksum to indicate that it needs to be re-generated.`
      );
      console.error(err);
    }
  }
  return ctx;
});
