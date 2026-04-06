import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
    createReminder,
    getReminders,
    updateReminder,
    deleteReminder,
} from "../controllers/reminder.controller.js";

const router = Router();

router.post("/", authMiddleware, createReminder);
router.get("/", authMiddleware, getReminders);
router.patch("/:id", authMiddleware, updateReminder);
router.delete("/:id", authMiddleware, deleteReminder);

export default router;