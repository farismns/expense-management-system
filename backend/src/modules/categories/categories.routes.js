import { Router } from "express";
import authenticate from "../../middlewares/authenticate.js";
import categoriesController from "./categories.controller.js";

const router = Router();

router.use(authenticate);

router.get("/", categoriesController.getCategories);
router.get("/:id", categoriesController.getCategoryById);
router.post("/", categoriesController.createCategory);
router.patch("/:id", categoriesController.updateCategory);
router.delete("/:id", categoriesController.deleteCategory);

export default router;
