import z from 'zod';

export const experimentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  habitId: z.string().uuid('Please select a habit'),
  variable: z.string().min(1, 'Variable description is required').max(255, 'Variable is too long'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().nullable(),
});

export type ExperimentFormData = z.infer<typeof experimentSchema>;
