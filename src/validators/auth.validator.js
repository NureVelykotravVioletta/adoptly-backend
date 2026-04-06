import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
    avatarUrl: z.string().url("Invalid avatar URL").optional(),
});

export const loginSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
    email: z.email("Invalid email"),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});