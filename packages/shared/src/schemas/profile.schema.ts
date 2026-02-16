import { z } from 'zod';

export const UpdateProfileSchema = z
  .object({
    email: z.string().email('Invalid email address').optional(),
    newPassword: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: 'New password must be at least 6 characters',
      }),
    currentPassword: z.string().optional(),
    darkMode: z.boolean().optional(),
    emailNotifications: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword && (!data.currentPassword || data.currentPassword.length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Current password is required to change password',
        path: ['currentPassword'],
      });
    }
  });

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export const GetProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  darkMode: z.boolean(),
  emailNotifications: z.boolean(),
});

export type GetProfileResponse = z.infer<typeof GetProfileSchema>;
