import { z } from "zod";

export const createAnimalSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.string().min(1, "Type is required"),
    gender: z.string().min(1, "Gender is required"),
    age: z.number().int().nonnegative(),
    breed: z.string().optional(),
    healthStatus: z.string().min(1, "Health status is required"),
    description: z.string().min(1, "Description is required"),
    shelterId: z.string().min(1, "Shelter ID is required"),
});

export const updateAnimalSchema = createAnimalSchema.partial();