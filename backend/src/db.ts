import { Pool, types as pgTypes } from "pg";
import dotenv from "dotenv";

// ensure returning postgres numerics as numbers
pgTypes.setTypeParser(1700, (val: string) =>
  val === null ? null : parseFloat(val)
);
pgTypes.setTypeParser(20, (val: string) =>
  val === null ? null : parseInt(val, 10)
);

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
