import pg from "pg";
const { Pool } = pg;

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export default db;
