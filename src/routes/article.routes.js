import { Router } from "express";
import {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
} from "../controllers/article.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/", getArticles);
router.get("/:id", getArticleById);

router.post("/", authMiddleware, allowRoles("ADMIN"), upload.single("image"), createArticle);
router.put("/:id", authMiddleware, allowRoles("ADMIN"), upload.single("image"), updateArticle);
router.delete("/:id", authMiddleware, allowRoles("ADMIN"), deleteArticle);

export default router;
