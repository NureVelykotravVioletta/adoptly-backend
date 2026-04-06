import { Router } from "express";
import {
    getAllShelters,
    getShelterById,
    createShelter,
    updateShelter,
    deleteShelter,
} from "../controllers/shelter.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createShelterSchema,
    updateShelterSchema,
} from "../validators/shelter.validator.js";

const router = Router();

router.get("/", getAllShelters);
router.get("/:id", getShelterById);
router.post("/", authMiddleware, allowRoles("ADMIN"), validate(createShelterSchema), createShelter);
router.put("/:id", authMiddleware, allowRoles("ADMIN"), validate(updateShelterSchema), updateShelter);
router.delete("/:id", authMiddleware, allowRoles("ADMIN"), deleteShelter);

export default router;