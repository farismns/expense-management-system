import summaryRepository from "./summary.repository.js";
import summaryValidation from "./summary.validation.js";

const validatePeriod = (query) => {
  const errors = summaryValidation.validateSummaryPeriod(query);

  if (errors.length > 0) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.details = errors;
    throw error;
  }
};

const getFinancialSummary = async (userId, query) => {
  validatePeriod(query);

  const { startDate, endDate } = query;

  const summary = await summaryRepository.findFinancialSummary(
    userId,
    startDate,
    endDate,
  );

  return {
    totalIncome: summary.total_income,
    totalExpense: summary.total_expense,
    netBalance: summary.net_balance,
    period: {
      startDate,
      endDate,
    },
  };
};

const getExpensesByCategory = async (userId, query) => {
  validatePeriod(query);

  const { startDate, endDate } = query;

  const expenses = await summaryRepository.findExpensesByCategory(
    userId,
    startDate,
    endDate,
  );

  return expenses.map((expense) => ({
    categoryId: expense.category_id,
    categoryName: expense.category_name,
    totalExpense: expense.total_expense,
  }));
};

export default {
  getFinancialSummary,
  getExpensesByCategory,
};
