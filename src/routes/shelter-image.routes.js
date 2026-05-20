import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
    addShelterImage,
    deleteShelterImage,
    deleteShelterImageByUrl,
} from "../controllers/shelter-image.controller.js";

const router = Router();

router.post(
    "/:id/images",
    authMiddleware,
    allowRoles("ADMIN"),
    upload.single("image"),
    addShelterImage
);

router.post(
    "/:id/photo",
    authMiddleware,
    allowRoles("ADMIN"),
    upload.single("image"),
    addShelterImage
);

router.delete(
    "/:id/photo/:url",
    authMiddleware,
    allowRoles("ADMIN"),
    deleteShelterImageByUrl
);

router.delete(
    "/images/:imageId",
    authMiddleware,
    allowRoles("ADMIN"),
    deleteShelterImage
);

export default router;
