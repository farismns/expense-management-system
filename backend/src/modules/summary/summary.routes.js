import { Router } from "express";
import authenticate from "../../middlewares/authenticate.js";
import summaryController from "./summary.controller.js";

const router = Router();

// All summary endpoints require authentication.
router.use(authenticate);

// Get financial summary for a selected period.
router.get("/", summaryController.getFinancialSummary);

// Get expense totals grouped by category.
router.get("/expenses-by-category", summaryController.getExpensesByCategory);

export default router;
