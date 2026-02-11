import { z } from 'zod';

export const CreateHabitSchema = z.object({
    name: z.string().min(3, "Too short name").max(255, "Too long name"),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
});

export type CreateHabitInput = z.infer<typeof CreateHabitSchema>;
