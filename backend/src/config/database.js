import { Pool } from "pg";

const isProduction = process.env.NODE_ENV === "production";

const ssl = isProduction ? { rejectUnauthorized: true } : undefined;
const pool = new Pool(
  process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL, ssl }
    : {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl,
      },
);

export default pool;
