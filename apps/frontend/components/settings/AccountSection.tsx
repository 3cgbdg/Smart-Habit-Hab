import { Box, Card, CardContent, Typography, TextField } from "@mui/material";
import { User } from "lucide-react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { SettingsFormData } from "@/validation/SettingsSchema";

interface AccountSectionProps {
    register: UseFormRegister<SettingsFormData>;
    errors: FieldErrors<SettingsFormData>;
}

const AccountSection = ({
    register,
    errors
}: AccountSectionProps) => {
    return (
        <Card
            elevation={3}
            sx={{
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider'
            }}
        >
            <Box sx={{ p: 2, bgcolor: 'var(--color-lightBlue)', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                <User className="w-5 h-5 text-blue" />
                <Typography variant="h6" className="font-bold text-gray-800 text-lg">
                    Account Settings
                </Typography>
            </Box>
            <CardContent className="p-6">

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <TextField
                        label="Email Address"
                        fullWidth
                        {...register("email")}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        placeholder="name@example.com"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="New Password"
                        fullWidth
                        type="password"
                        {...register("newPassword")}
                        error={!!errors.newPassword}
                        helperText={errors.newPassword?.message}
                        placeholder="Enter new password (optional)"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />

                    <TextField
                        label="Current Password"
                        fullWidth
                        type="password"
                        {...register("currentPassword")}
                        error={!!errors.currentPassword}
                        helperText={errors.currentPassword?.message || "Required for email or password changes"}
                        placeholder="Enter current password to save changes"
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default AccountSection;
