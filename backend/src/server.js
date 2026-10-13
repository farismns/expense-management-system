import "dotenv/config";
import app from "./app.js";
import pool from "./config/database.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test the PostgreSQL connection.
    await pool.query("SELECT 1");

    console.log("PostgreSQL connected successfully.");

    // Start the Express server.
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exitCode = 1;
  }
}

startServer();
