import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import {
    addAnimalImage,
    deleteAnimalImage,
} from "../controllers/animal-image.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.post(
    "/:id/images",
    authMiddleware,
    allowRoles("ADMIN"),
    upload.single("image"),
    addAnimalImage
);router.delete("/images/:imageId", authMiddleware, allowRoles("ADMIN"), deleteAnimalImage);

export default router;