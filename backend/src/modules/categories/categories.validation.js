const VALID_CATEGORY_TYPES = ["income", "expense"];

const validateCreateCategory = (input) => {
  const errors = [];

  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return ["Request body must be a JSON object"];
  }

  if (typeof input.name !== "string" || !input.name.trim()) {
    errors.push("Category name is required");
  } else if (input.name.trim().length > 50) {
    errors.push("Category name must not exceed 50 characters");
  }

  if (!VALID_CATEGORY_TYPES.includes(input.type)) {
    errors.push("Category type must be income or expense");
  }

  return errors;
};

const validateUpdateCategory = (input) => {
  const errors = [];

  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return ["Request body must be a JSON object"];
  }

  if (Object.hasOwn(input, "type")) {
    errors.push("Category type cannot be changed");
  }

  if (typeof input.name !== "string" || !input.name.trim()) {
    errors.push("Category name is required");
  } else if (input.name.trim().length > 50) {
    errors.push("Category name must not exceed 50 characters");
  }

  return errors;
};

export default {
  validateCreateCategory,
  validateUpdateCategory,
};
