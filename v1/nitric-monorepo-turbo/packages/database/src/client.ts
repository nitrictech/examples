// import { PrismaClient } from "@prisma/client";

// export const prisma = global.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") global.prisma = prisma;

// export * from "@prisma/client";

import { sql } from "@nitric/sdk";
import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const db = sql("todos", {
  // points to our custom drizzle migration dockerfile
  migrations: "dockerfile://../migrate.dockerfile",
});

let drizzleClient: PostgresJsDatabase;

const getClient = async () => {
  // ensure we only create the client once
  if (!drizzleClient) {
    const connectionString = await db.connectionString();

    const queryClient = postgres(connectionString);
    drizzleClient = drizzle(queryClient);
  }
  return drizzleClient;
};

// export our getClient function, which will be used to get the drizzle client during runtime
export default getClient;
