import categoriesService from "./categories.service.js";
import categoriesValidation from "./categories.validation.js";

const createCategory = async (req, res, next) => {
  try {
    const input = req.body ?? {};
    const errors = categoriesValidation.validateCreateCategory(input);

    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      });
    }

    const category = await categoriesService.createCategory(req.user.id, input);

    return res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoriesService.getCategories(req.user.id);

    return res.status(200).json({
      status: "success",
      message: "Categories retrieved successfully",
      data: { categories },
    });
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid category ID",
      });
    }

    const category = await categoriesService.getCategoryById(
      categoryId,
      req.user.id,
    );

    return res.status(200).json({
      status: "success",
      message: "Category retrieved successfully",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid category ID",
      });
    }

    const category = await categoriesService.updateCategory(
      categoryId,
      req.user.id,
      req.body ?? {},
    );

    return res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid category ID",
      });
    }

    const category = await categoriesService.deleteCategory(
      categoryId,
      req.user.id,
    );

    return res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
      data: { category },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
