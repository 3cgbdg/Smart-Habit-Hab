import { z } from "zod";

export const settingsSchema = z.object({
    email: z.string().email("Invalid email address"),
    newPassword: z.string().optional().refine((val) => !val || val.length >= 6, {
        message: "New password must be at least 6 characters",
    }),
    currentPassword: z.string().optional(),
    darkMode: z.boolean(),
    emailNotifications: z.boolean(),
}).superRefine((data, ctx) => {
    if (data.newPassword && (!data.currentPassword || data.currentPassword.length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Current password is required to change password",
            path: ["currentPassword"],
        });
    }
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
