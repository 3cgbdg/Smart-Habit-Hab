import { Box, Card, CardContent, Typography, Stack, Divider, Switch } from "@mui/material";
import { Settings as SettingsIcon, Moon, Bell } from "lucide-react";
import { Control, Controller } from "react-hook-form";
import { SettingsFormData } from "@/validation/SettingsSchema";

interface PreferenceSectionProps {
    control: Control<SettingsFormData>;
}

const PreferenceSection = ({
    control
}: PreferenceSectionProps) => {
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
                <SettingsIcon className="w-5 h-5 text-blue" />
                <Typography variant="h6" className="font-bold text-gray-800 text-lg">
                    App Preferences
                </Typography>
            </Box>
            <CardContent className="p-6">
                <Typography variant="subtitle2" className="text-gray-500 mb-6 font-medium">
                    Customize your app experience.
                </Typography>

                <Stack spacing={3}>
                    {/* Dark Mode (Processing stage) */}
                    <Box className="flex items-center justify-between">
                        <Box className="flex items-center gap-3">
                            <Moon className="w-5 h-5 text-gray-500" />
                            <Box>
                                <Typography variant="subtitle1" className="font-medium text-gray-800">
                                    Dark Mode
                                </Typography>
                                <Typography variant="body2" className="text-gray-500">
                                    Switch to a dark color scheme.
                                </Typography>
                            </Box>
                        </Box>
                        <Controller
                            name="darkMode"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    color="primary"
                                />
                            )}
                        />
                    </Box>

                    <Divider />

                    <Box className="flex items-center justify-between">
                        <Box className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-gray-500" />
                            <Box>
                                <Typography variant="subtitle1" className="font-medium text-gray-800">
                                    Email Notifications
                                </Typography>
                                <Typography variant="body2" className="text-gray-500">
                                    Receive updates and reminders via email.
                                </Typography>
                            </Box>
                        </Box>
                        <Controller
                            name="emailNotifications"
                            control={control}
                            render={({ field }) => (
                                <Switch
                                    checked={field.value}
                                    onChange={(e) => field.onChange(e.target.checked)}
                                    color="primary"
                                />
                            )}
                        />
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default PreferenceSection;
