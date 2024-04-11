import { api } from "@nitric/sdk";
import { pool } from "../resources/db.js";

const echo = api('main');

export async function getPostgresVersion() {
    const client = await pool.connect();
    try {
      const version = await client.query('SELECT version()');
      return version.rows;
    } finally {
      client.release();
    }
  }

  echo.get("/version", async (ctx) => {
    ctx.res.json(await getPostgresVersion());
});

