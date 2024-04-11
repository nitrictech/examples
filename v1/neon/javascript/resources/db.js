import pg from "pg"

const { Pool } = pg;

const { DATABASE_URL } = process.env;
export const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
});

