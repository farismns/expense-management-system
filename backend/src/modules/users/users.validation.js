const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateProfileUpdate = (input) => {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return ["Request body must be a JSON object"];
  }

  const allowedKeys = ["email", "fullname"];
  const keys = Object.keys(input);

  if (
    keys.length !== allowedKeys.length ||
    keys.some((key) => !allowedKeys.includes(key))
  ) {
    return ["Only email and fullname can be updated"];
  }

  const errors = [];

  if (
    typeof input.email !== "string" ||
    !emailPattern.test(input.email.trim())
  ) {
    errors.push("Email format is invalid");
  }

  if (typeof input.fullname !== "string" || !input.fullname.trim()) {
    errors.push("Fullname is required");
  } else if (input.fullname.trim().length > 100) {
    errors.push("Fullname must not exceed 100 characters");
  }

  return errors;
};

const validatePasswordChange = (input) => {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return ["Request body must be a JSON object"];
  }

  const allowedKeys = ["currentPassword", "newPassword"];
  const keys = Object.keys(input);

  if (
    keys.length !== allowedKeys.length ||
    keys.some((key) => !allowedKeys.includes(key))
  ) {
    return ["Only currentPassword and newPassword are allowed"];
  }

  const errors = [];

  if (typeof input.currentPassword !== "string" || !input.currentPassword) {
    errors.push("Current password is required");
  }

  if (typeof input.newPassword !== "string" || input.newPassword.length < 8) {
    errors.push("New password must be at least 8 characters long");
  } else if (Buffer.byteLength(input.newPassword, "utf8") > 72) {
    errors.push("New password must not exceed 72 bytes");
  }

  return errors;
};

export default {
  validateProfileUpdate,
  validatePasswordChange,
};
