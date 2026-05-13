import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    getMe,
    updateMe,
    uploadMyAvatar,
    deleteMyAvatar,
    getMyLikedAnimals,
    likeAnimal,
    unlikeAnimal,
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateMeSchema } from "../validators/user.validator.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, validate(updateMeSchema), updateMe);
router.get("/me/liked-animals", authMiddleware, getMyLikedAnimals);
router.post("/me/liked-animals/:animalId", authMiddleware, likeAnimal);
router.delete("/me/liked-animals/:animalId", authMiddleware, unlikeAnimal);

router.post(
    "/me/avatar",
    authMiddleware,
    upload.single("image"),
    uploadMyAvatar
);

router.delete("/me/avatar", authMiddleware, deleteMyAvatar);

export default router;
