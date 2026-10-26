import { Router } from "express";
import authenticate from "../../middlewares/authenticate.js";
import usersController from "./users.controller.js";

const router = Router();
router.use(authenticate);
router.get("/me", usersController.getMyProfile);
router.patch("/me", usersController.updateMyProfile);
router.patch("/me/password", usersController.changeMyPassword);
export default router;
