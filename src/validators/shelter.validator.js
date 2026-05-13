import { z } from "zod";

export const createShelterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    city: z.string().min(1, "City is required"),
    address: z.string().min(1, "Address is required"),
    phone: z.string().min(1, "Phone is required"),
    email: z.email("Invalid email"),
    foundationDate: z.string().optional(),
    workingHours: z.string().optional(),
});

export const updateShelterSchema = createShelterSchema.partial();
