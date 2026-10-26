import { Router } from "express";
import authController from "./auth.controller.js";
import meController from "./auth.me.controller.js";
import authenticate from "../../middlewares/authenticate.js";
import passwordController from "./auth.password.controller.js";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/forgot-password", passwordController.requestPasswordReset);
router.post("/reset-password", passwordController.resetPassword);

router.get("/me", authenticate, meController.getCurrentUser);

export default router;
