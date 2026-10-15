const validateCreateTransaction = (input) => {
  const errors = [];

  const { date, amount, type, category_id, description } = input;

  // Validate date.
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push({
      field: "date",
      message: "Date must use YYYY-MM-DD format",
    });
  } else {
    const parsedDate = new Date(`${date}T00:00:00.000Z`);

    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      errors.push({
        field: "date",
        message: "Date must be a valid calendar date",
      });
    }
  }

  // Validate amount.
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    errors.push({
      field: "amount",
      message: "Amount must be a number greater than zero",
    });
  }

  // Validate transaction type.
  if (type !== "income" && type !== "expense") {
    errors.push({
      field: "type",
      message: "Type must be income or expense",
    });
  }

  // Validate category ID.
  if (
    category_id !== undefined &&
    category_id !== null &&
    (!Number.isSafeInteger(category_id) || category_id <= 0)
  ) {
    errors.push({
      field: "category_id",
      message: "Category ID must be a positive integer or null",
    });
  }

  if (type === "expense" && category_id == null) {
    errors.push({
      field: "category_id",
      message: "Category is required for expense transactions",
    });
  }

  // Validate description.
  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    errors.push({
      field: "description",
      message: "Description must be a string or null",
    });
  }

  return errors;
};

export default { validateCreateTransaction };
