import { Router } from "express";
import authenticate from "../../middlewares/authenticate.js";
import budgetsController from "./budgets.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", budgetsController.createBudget);
router.get("/", budgetsController.getBudgets);
router.get("/:id", budgetsController.getBudgetById);
router.put("/:id", budgetsController.updateBudget);
router.delete("/:id", budgetsController.deleteBudget);

export default router;
