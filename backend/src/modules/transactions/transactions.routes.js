import { Router } from "express";
import authenticate from "../../middlewares/authenticate.js";
import transactionsController from "./transactions.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", transactionsController.getTransactions);
router.get("/:id", transactionsController.getTransactionById);
router.patch("/:id", transactionsController.updateTransaction);
router.post("/", transactionsController.createTransaction);
router.delete("/:id", transactionsController.deleteTransaction);

export default router;
