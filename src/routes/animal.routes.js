import { Router } from "express";
import {
    getAllAnimals,
    getAnimalById,
    createAnimal,
    updateAnimal,
    deleteAnimal,
} from "../controllers/animal.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
    createAnimalSchema,
    updateAnimalSchema,
} from "../validators/animal.validator.js";

const router = Router();

router.get("/", getAllAnimals);
router.get("/:id", getAnimalById);
router.post("/", authMiddleware, allowRoles("ADMIN"), validate(createAnimalSchema), createAnimal);
router.put("/:id", authMiddleware, allowRoles("ADMIN"), validate(updateAnimalSchema), updateAnimal);
router.delete("/:id", authMiddleware, allowRoles("ADMIN"), deleteAnimal);

export default router;