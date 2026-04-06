import { Router } from "express";
import {
    createApplication,
    getMyApplications,
    updateApplicationStatus,
} from "../controllers/application.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = Router();

router.post("/", authMiddleware, allowRoles("USER"), createApplication);
router.get("/my", authMiddleware, allowRoles("USER"), getMyApplications);
router.patch("/:id/status", authMiddleware, allowRoles("ADMIN"), updateApplicationStatus);

export default router;