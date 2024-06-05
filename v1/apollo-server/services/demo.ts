import { http as nitricHttp } from "@nitric/sdk";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import * as http from "http";
import cors from "cors";

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app: express.Express = express();
const httpServer: http.Server = http.createServer(app);

server.addPlugin(ApolloServerPluginDrainHttpServer({ httpServer: httpServer }));

async function bootstrap(port: number) {
  console.log(`listening on port ${port}`);
  await server.start();

  app.use(
    cors(),
    express.json({ limit: "50mb" }),
    expressMiddleware(server, { context: async () => ({}) })
  );

  await new Promise<void>((resolve) => {
    httpServer.listen({ port }, resolve);
  });
  return httpServer;
}

nitricHttp(bootstrap);
