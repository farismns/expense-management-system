import { Router } from "express";
import authController from "./auth.controller.js";
import meController from "./auth.me.controller.js";
import authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

router.get("/me", authenticate, meController.getCurrentUser);

export default router;
