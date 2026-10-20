import budgetsRepository from "./budgets.repository.js";
import categoriesRepository from "../categories/categories.repository.js";
import { validateBudget } from "./budgets.validation.js";

const createHttpError = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const handleBudgetDatabaseError = (error) => {
  if (
    error.code === "23P01" &&
    error.constraint === "ex_budgets_no_overlapping_period"
  ) {
    throw createHttpError(
      409,
      "A budget already exists for this category during the selected period",
    );
  }

  throw error;
};

const validateInput = (input) => {
  const errors = validateBudget(input);

  if (errors.length > 0) {
    throw createHttpError(400, errors.join(", "));
  }
};

const ensureCategoryOwnership = async (categoryId, userId) => {
  const category = await categoriesRepository.findByIdAndUserId(
    categoryId,
    userId,
  );

  if (!category) {
    throw createHttpError(404, "Category not found");
  }
};

const ensureNoOverlappingPeriod = async ({
  user_id,
  category_id,
  start_date,
  end_date,
  excludeBudgetId = null,
}) => {
  const overlappingBudget = await budgetsRepository.findOverlappingPeriod({
    user_id,
    category_id,
    start_date,
    end_date,
    excludeBudgetId,
  });

  if (overlappingBudget) {
    throw createHttpError(
      409,
      "A budget already exists for this category during the selected period",
    );
  }
};

const createBudget = async (userId, input) => {
  validateInput(input);

  await ensureCategoryOwnership(input.category_id, userId);

  await ensureNoOverlappingPeriod({
    user_id: userId,
    category_id: Number(input.category_id),
    start_date: input.start_date,
    end_date: input.end_date,
  });

  try {
    return await budgetsRepository.create({
      user_id: userId,
      category_id: Number(input.category_id),
      amount: input.amount,
      start_date: input.start_date,
      end_date: input.end_date,
    });
  } catch (error) {
    handleBudgetDatabaseError(error);
  }
};

const getBudgets = async (userId) => {
  return budgetsRepository.findAllByUserId(userId);
};

const getBudgetById = async (budgetId, userId) => {
  const budget = await budgetsRepository.findByIdAndUserId(budgetId, userId);

  if (!budget) {
    throw createHttpError(404, "Budget not found");
  }

  return budget;
};

const updateBudget = async (budgetId, userId, input) => {
  validateInput(input);

  const existingBudget = await budgetsRepository.findByIdAndUserId(
    budgetId,
    userId,
  );

  if (!existingBudget) {
    throw createHttpError(404, "Budget not found");
  }

  await ensureCategoryOwnership(input.category_id, userId);

  await ensureNoOverlappingPeriod({
    user_id: userId,
    category_id: Number(input.category_id),
    start_date: input.start_date,
    end_date: input.end_date,
    excludeBudgetId: Number(budgetId),
  });

  let updatedBudget;

  try {
    updatedBudget = await budgetsRepository.updateByIdAndUserId(
      budgetId,
      userId,
      {
        category_id: Number(input.category_id),
        amount: input.amount,
        start_date: input.start_date,
        end_date: input.end_date,
      },
    );
  } catch (error) {
    handleBudgetDatabaseError(error);
  }

  if (!updatedBudget) {
    throw createHttpError(404, "Budget not found");
  }

  return updatedBudget;
};

const deleteBudget = async (budgetId, userId) => {
  const deletedBudget = await budgetsRepository.deleteByIdAndUserId(
    budgetId,
    userId,
  );

  if (!deletedBudget) {
    throw createHttpError(404, "Budget not found");
  }

  return deletedBudget;
};

export default {
  createBudget,
  getBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
};
