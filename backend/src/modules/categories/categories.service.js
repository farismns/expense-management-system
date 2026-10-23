import categoriesRepository from "./categories.repository.js";
import categoriesValidation from "./categories.validation.js";

const handleCategoryRepositoryError = (error) => {
  if (
    error.code === "23505" &&
    error.constraint === "uq_categories_user_name"
  ) {
    const conflictError = new Error("A category with this name already exists");
    conflictError.status = 409;
    throw conflictError;
  }

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
      type: input.type,
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
  const errors = categoriesValidation.validateUpdateCategory(input);

  if (errors.length > 0) {
    const error = new Error("Validation failed");
    error.status = 400;
    error.details = errors;
    throw error;
  }

  const existingCategory = await getCategoryById(categoryId, userId);

  if (existingCategory.is_default) {
    const error = new Error("Default categories cannot be modified");
    error.status = 403;
    throw error;
  }

  try {
    const category = await categoriesRepository.updateByIdAndUserId(
      categoryId,
      userId,
      input.name.trim(),
    );

    if (!category) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }

    return category;
  } catch (error) {
    handleCategoryRepositoryError(error);
  }
};

const deleteCategory = async (categoryId, userId) => {
  const existingCategory = await getCategoryById(categoryId, userId);

  if (existingCategory.is_default) {
    const error = new Error("Default categories cannot be deleted");
    error.status = 403;
    throw error;
  }

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
      [
        "fk_transactions_category",
        "fk_transactions_category_owner_type",
        "fk_budgets_category",
      ].includes(error.constraint)
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
