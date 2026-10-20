import express from "express";
import errorHandler from "./middlewares/error-handler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import transactionsRoutes from "./modules/transactions/transactions.routes.js";
import categoriesRoutes from "./modules/categories/categories.routes.js";
import budgetsRoutes from "./modules/budgets/budgets.routes.js";
import summaryRoutes from "./modules/summary/summary.routes.js";

const app = express();

// Parse incoming JSON request bodies.
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/budgets", budgetsRoutes);
app.use("/api/summary", summaryRoutes);

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
