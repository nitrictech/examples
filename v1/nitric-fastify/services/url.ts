import Fastify from "fastify";
import { http, bucket } from "@nitric/sdk";

const fastify = Fastify({
  logger: true,
});

export const imgBucket = bucket("images").allow("read", "write");

interface Params {
  id: string;
}

fastify.get<{ Params: Params }>("/upload/:id", async (request, reply) => {
  try {
    const { id } = request.params;
    const img = imgBucket.file(`images/${id}/photo.png`);

    reply.code(200).send({ url: await img.getUploadUrl() });
  } catch (err) {
    reply.code(500).send("Error getting file URL");
  }
});

async function bootstrap(port: number) {
  await fastify.listen({ port });

  return fastify.server;
}

http(bootstrap, () => {
  console.log(`Application started`);
});
