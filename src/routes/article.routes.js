import { Router } from "express";
import {
    getArticles,
    getArticleById,
    createArticle,
    deleteArticle,
} from "../controllers/article.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", getArticles);
router.get("/:id", getArticleById);

router.post("/", authMiddleware, allowRoles("ADMIN"), createArticle);
router.delete("/:id", authMiddleware, allowRoles("ADMIN"), deleteArticle);

export default router;