import { sql } from "@nitric/sdk";
import { PrismaClient } from "@prisma/client";

const db = sql("todos", {
  // points to our custom prisma migration dockerfile
  migrations: "dockerfile://migrate.dockerfile",
});

let prisma: PrismaClient;

const getClient = async () => {
  // ensure we only create the client once
  if (!prisma) {
    const connectionString = await db.connectionString();

    prisma = new PrismaClient({
      datasources: {
        db: {
          url: connectionString,
        },
      },
    });
  }
  return prisma;
};

// export our getClient function, which will be used to get the prisma client during runtime
export default getClient;
