import { z } from "zod";
import {
    animalGenderValues,
    animalTypeValues,
    normalizeAnimalGender,
    normalizeAnimalType,
} from "../utils/animalEnums.js";

export const createAnimalSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.preprocess(
        normalizeAnimalType,
        z.enum(animalTypeValues)
    ),
    gender: z.preprocess(
        normalizeAnimalGender,
        z.enum(animalGenderValues)
    ),
    city: z.string().optional(),
    age: z.number().int().nonnegative(),
    breed: z.string().optional(),
    healthStatus: z.string().min(1, "Health status is required"),
    description: z.string().min(1, "Description is required"),
    shelterId: z.string().min(1, "Shelter ID is required"),
});

export const updateAnimalSchema = createAnimalSchema.partial();
