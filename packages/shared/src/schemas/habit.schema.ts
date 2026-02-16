import { z } from 'zod';

export const CreateHabitSchema = z.object({
  name: z.string().min(3, 'Too short name').max(255, 'Too long name'),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type CreateHabitInput = z.infer<typeof CreateHabitSchema>;

export const GetHabitSchema = CreateHabitSchema.extend({
  id: z.string().uuid(),
  streak: z.number(),
  completionRate: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GetHabitResponse = z.infer<typeof GetHabitSchema>;
