import app from "./app.js";
import pool from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  testDbConnection();
});

async function testDbConnection() {
  try {
    const db_client = await pool.connect();
    console.log("Connected to the database successfully.");
    db_client.release();
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
  }
}
