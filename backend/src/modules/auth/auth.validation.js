const validateRegistration = ({ email, password, fullname }) => {
  const errors = [];

  if (typeof email !== "string" || !email.trim()) {
    errors.push({
      field: "email",
      message: "Email is required",
    });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push({
      field: "email",
      message: "Email format is invalid",
    });
  }

  if (typeof password !== "string" || !password) {
    errors.push({
      field: "password",
      message: "Password is required",
    });
  } else if (password.length < 8) {
    errors.push({
      field: "password",
      message: "Password must be at least 8 characters long",
    });
  }

  if (typeof fullname !== "string" || !fullname.trim()) {
    errors.push({
      field: "fullname",
      message: "Fullname is required",
    });
  } else if (fullname.trim().length > 100) {
    errors.push({
      field: "fullname",
      message: "Fullname must not exceed 100 characters",
    });
  }

  return errors;
};

const validateLogin = ({ email, password }) => {
  const errors = [];

  if (typeof email !== "string" || !email.trim()) {
    errors.push({
      field: "email",
      message: "Email is required",
    });
  }

  if (typeof password !== "string" || !password) {
    errors.push({
      field: "password",
      message: "Password is required",
    });
  }

  return errors;
};

export default { validateRegistration, validateLogin };
