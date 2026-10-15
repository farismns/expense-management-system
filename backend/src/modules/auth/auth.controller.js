import authService from "./auth.service.js";
import authValidation from "./auth.validation.js";

const registerUser = async (req, res, next) => {
  try {
    const errors = authValidation.validateRegistration(req.body ?? {});

    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      });
    }

    const user = await authService.registerUser(req.body);

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const errors = authValidation.validateLogin(req.body ?? {});

    if (errors.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors,
      });
    }

    const result = await authService.authenticateUser(req.body);

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  registerUser,
  loginUser,
};
