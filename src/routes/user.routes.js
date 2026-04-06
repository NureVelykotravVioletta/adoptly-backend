import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    getMe,
    updateMe,
    uploadMyAvatar,
    deleteMyAvatar,
} from "../controllers/user.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { updateMeSchema } from "../validators/user.validator.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, validate(updateMeSchema), updateMe);

router.post(
    "/me/avatar",
    authMiddleware,
    upload.single("image"),
    uploadMyAvatar
);

router.delete("/me/avatar", authMiddleware, deleteMyAvatar);

export default router;