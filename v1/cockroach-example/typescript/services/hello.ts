import { api } from "@nitric/sdk";
import pkg from "pg";

const { Pool } = pkg;
const mainApi = api("main");

mainApi.get("/init", async (ctx) => {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    pool = new Pool({
      connectionString,
      application_name: "$ docs_lambda_node",
      max: 1,
    });
  }

  await initTable(pool);
  await insertAccounts(pool, 5);

  ctx.res.json({
    message: "Database initialized",
  });
});

let pool;

const initTable = async (p) => {
  const client = await p.connect();
  console.log("Initializing table...");
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS accounts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          balance INT8
        )`
    );
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
};

const insertAccounts = async (p, n) => {
  const client = await p.connect();
  console.log("Hey! You successfully connected to your CockroachDB cluster.");
  try {
    while (n > 0) {
      const balanceValue = [Math.floor(Math.random() * 1000)];
      await client.query(
        "INSERT INTO accounts (id, balance) VALUES (DEFAULT, $1)",
        balanceValue
      );
      n -= 1;
      console.log(`Created new account with balance ${balanceValue}.`);
    }
  } catch (err) {
    console.log(err.stack);
  } finally {
    client.release();
  }
};
