import summaryService from "./summary.service.js";

const getFinancialSummary = async (req, res, next) => {
  try {
    const summary = await summaryService.getFinancialSummary(
      req.user.id,
      req.query,
    );

    res.status(200).json({
      status: "success",
      message: "Financial summary retrieved successfully",
      data: {
        summary,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getExpensesByCategory = async (req, res, next) => {
  try {
    const expenses = await summaryService.getExpensesByCategory(
      req.user.id,
      req.query,
    );

    res.status(200).json({
      status: "success",
      message: "Expenses by category retrieved successfully",
      data: {
        expenses,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getFinancialSummary,
  getExpensesByCategory,
};
