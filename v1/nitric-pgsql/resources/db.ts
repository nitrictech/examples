import { sql } from "@nitric/sdk";
import { Client } from "pg";

const db = sql("todo-db", {
  migrations: "file://migrations/todos",
});

let client: Client;

const getClient = async () => {
  if (!client) {
    const connectionString = await db.connectionString();
    client = new Client({ connectionString });
    await client.connect();
  }
  return client;
};

export default getClient;
