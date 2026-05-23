import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    getMe,
    login,
    register,
    forgotPassword,
    resetPassword,
    googleLogin,
} from "../controllers/auth.controller.js";
import {
    loginSchema,
    registerSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    googleLoginSchema,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", validate(googleLoginSchema), googleLogin);
router.get("/me", authMiddleware, getMe);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

export default router;