import { z } from 'zod';

export enum ExperimentStatus {
  PLANNED = 'planned',
  RUNNING = 'running',
  FINISHED = 'finished',
}

export const CreateExperimentSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  habitId: z.string().uuid('Please select a habit'),
  variable: z.string().min(1, 'Variable description is required').max(255, 'Variable is too long'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
});

export type CreateExperimentInput = z.infer<typeof CreateExperimentSchema>;

export const GetExperimentSchema = CreateExperimentSchema.extend({
  id: z.string().uuid(),
  status: z.nativeEnum(ExperimentStatus),
  successRate: z.number().optional(),
  duration: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type GetExperimentResponse = z.infer<typeof GetExperimentSchema>;
