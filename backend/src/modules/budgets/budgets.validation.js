const validateBudget = ({ category_id, amount, start_date, end_date }) => {
  const errors = [];

  // Category ID must be a positive integer.
  if (
    category_id === undefined ||
    !Number.isInteger(Number(category_id)) ||
    Number(category_id) <= 0
  ) {
    errors.push("category_id must be a positive integer");
  }

  // Amount must be a finite number greater than zero.
  const parsedAmount = Number(amount);

  if (
    amount === undefined ||
    amount === null ||
    amount === "" ||
    !Number.isFinite(parsedAmount) ||
    parsedAmount <= 0
  ) {
    errors.push("amount must be a number greater than 0");
  }

  // Validate date format and calendar validity.
  const isValidDate = (value) => {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return false;
    }

    const date = new Date(`${value}T00:00:00.000Z`);

    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  };

  if (!isValidDate(start_date)) {
    errors.push("start_date must be a valid date in YYYY-MM-DD format");
  }

  if (!isValidDate(end_date)) {
    errors.push("end_date must be a valid date in YYYY-MM-DD format");
  }

  // Start date must not be after end date.
  if (
    isValidDate(start_date) &&
    isValidDate(end_date) &&
    start_date > end_date
  ) {
    errors.push("start_date must not be after end_date");
  }

  return errors;
};

export { validateBudget };
