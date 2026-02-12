import z from "zod";

export const habitSchema = z.object({
    name: z.string().min(1, "Name is required").max(255, "Name is too long"),
    description: z.string().optional(),
    isActive: z.boolean(),
});

export type HabitFormData = z.infer<typeof habitSchema>;