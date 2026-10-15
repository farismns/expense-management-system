import transactionsService from "./transactions.service.js";
import transactionsValidation from "./transactions.validation.js";

const createTransaction = async (req, res, next) => {
  try {
    const input = req.body ?? {};
    const errors = transactionsValidation.validateCreateTransaction(input);

    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      });
    }

    const transaction = await transactionsService.createUserTransaction(
      req.user.id,
      input,
    );

    return res.status(201).json({
      status: "success",
      message: "Transaction created successfully",
      data: { transaction },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionsService.getUserTransactions(
      req.user.id,
    );

    return res.status(200).json({
      status: "success",
      message: "Transactions retrieved successfully",
      data: {
        transactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionById = async (req, res, next) => {
  try {
    const transactionId = Number(req.params.id);

    if (!Number.isSafeInteger(transactionId) || transactionId <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid transaction ID",
      });
    }

    const transaction = await transactionsService.getUserTransactionById(
      transactionId,
      req.user.id,
    );

    return res.status(200).json({
      status: "success",
      message: "Transaction retrieved successfully",
      data: {
        transaction,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createTransaction,
  getTransactions,
  getTransactionById,
};
