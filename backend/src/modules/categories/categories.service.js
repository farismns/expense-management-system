import categoriesRepository from "./categories.repository.js";
import categoriesValidation from "./categories.validation.js";

// Convert duplicate category names into an HTTP 409 error.
const handleCategoryRepositoryError = (error) => {
  if (
    error.code === "23505" &&
    error.constraint === "uq_categories_user_name"
  ) {
    const conflictError = new Error("A category with this name already exists");
    conflictError.status = 409;
    throw conflictError;
  }

  // Preserve errors that are not duplicate category names.
  throw error;
};

const createCategory = async (userId, input) => {
  const errors = categoriesValidation.validateCreateCategory(input);

  if (errors.length > 0) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.details = errors;
    throw error;
  }

  try {
    return await categoriesRepository.create({
      name: input.name.trim(),
      user_id: userId,
    });
  } catch (error) {
    handleCategoryRepositoryError(error);
  }
};

const getCategories = async (userId) => {
  return categoriesRepository.findAllByUserId(userId);
};

const getCategoryById = async (categoryId, userId) => {
  const category = await categoriesRepository.findByIdAndUserId(
    categoryId,
    userId,
  );

  if (!category) {
    const error = new Error("Category not found");
    error.status = 404;
    throw error;
  }

  return category;
};

const updateCategory = async (categoryId, userId, input) => {
  const errors = categoriesValidation.validateCreateCategory(input);

  if (errors.length > 0) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.details = errors;
    throw error;
  }

  let category;

  try {
    category = await categoriesRepository.updateByIdAndUserId(
      categoryId,
      userId,
      input.name.trim(),
    );
  } catch (error) {
    handleCategoryRepositoryError(error);
  }

  if (!category) {
    const error = new Error("Category not found");
    error.status = 404;
    throw error;
  }

  return category;
};

const deleteCategory = async (categoryId, userId) => {
  try {
    const category = await categoriesRepository.deleteByIdAndUserId(
      categoryId,
      userId,
    );

    if (!category) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }

    return category;
  } catch (error) {
    if (
      error.code === "23503" &&
      ["fk_transactions_category", "fk_budgets_category"].includes(
        error.constraint,
      )
    ) {
      const conflictError = new Error(
        "Cannot delete category because it is being used by transactions or budgets",
      );
      conflictError.status = 409;
      throw conflictError;
    }

    throw error;
  }
};

export default {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
