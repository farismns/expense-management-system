const isValidDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === value
  );
};

const validateSummaryPeriod = (query) => {
  const errors = [];
  const { startDate, endDate } = query;

  if (!isValidDate(startDate)) {
    errors.push({
      field: "startDate",
      message: "Start date must be a valid date in YYYY-MM-DD format",
    });
  }

  if (!isValidDate(endDate)) {
    errors.push({
      field: "endDate",
      message: "End date must be a valid date in YYYY-MM-DD format",
    });
  }

  // Compare only after both dates have passed calendar validation.
  if (isValidDate(startDate) && isValidDate(endDate) && startDate > endDate) {
    errors.push({
      field: "startDate",
      message: "Start date must not be later than end date",
    });
  }

  return errors;
};

export default {
  validateSummaryPeriod,
};
