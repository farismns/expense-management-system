import express from "express";
import errorHandler from "./middlewares/error-handler.js";

const app = express();

// Parse incoming JSON request bodies.
app.use(express.json());

// Health check endpoint.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Expense Management System API is running",
  });
});

app.use((req, res, next) => {
  const error = new Error("Endpoint not found");
  error.status = 404;
  next(error);
});

app.use(errorHandler);

export default app;
