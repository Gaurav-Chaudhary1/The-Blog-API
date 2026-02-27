import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters long"),
  lastName: z.string().min(2, "Last name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must not exceeds 20 characters long"),
});

export const loginSchema = z.object({
    email: z.email('Invalid email address'),
    password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must not exceeds 20 characters long"),
});