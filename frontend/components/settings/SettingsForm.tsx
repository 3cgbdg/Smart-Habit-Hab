"use client"

import { useState, useEffect } from "react";
import {
    Box,
    Button,
    CircularProgress
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import profilesService from "@/services/ProfilesService";
import { toast } from "react-toastify";
import AccountSection from "./AccountSection";
import PreferenceSection from "./PreferenceSection";
import { settingsSchema, SettingsFormData } from "@/validation/SettingsSchema";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { fetchProfile } from "@/redux/profileSlice";

const SettingsForm = () => {
    const [saving, setSaving] = useState(false);
    const { user } = useAppSelector((state: any) => state.profile);
    const dispatch = useAppDispatch();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isDirty }
    } = useForm<SettingsFormData>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            email: "",
            newPassword: "",
            currentPassword: "",
            darkMode: false,
            emailNotifications: true,
        }
    });

    // getting current fields into created form
    useEffect(() => {
        if (user) {
            reset({
                email: user.email,
                darkMode: user.darkMode,
                emailNotifications: user.emailNotifications,
                newPassword: "",
                currentPassword: ""
            });
        }
    }, [user, reset]);

    const onSubmit = async (data: SettingsFormData) => {
        setSaving(true);

        const payload: any = {
            darkMode: data.darkMode,
            emailNotifications: data.emailNotifications
        };

        if (data.email !== user?.email) {
            payload.email = data.email;
        }

        if (data.newPassword) {
            payload.newPassword = data.newPassword;
        }

        if (payload.email || payload.newPassword) {
            payload.currentPassword = data.currentPassword;
        }

        await updateProfile(payload);
    };

    const { mutateAsync: updateProfile, isPending } = useMutation({
        mutationFn: async (data: any) => {
            const res = await profilesService.updateProfile(data);
            return res.message || "Settings updated successfully";
        },
        onSuccess: async (message: string) => {
            await dispatch(fetchProfile()).unwrap();
            toast.success(message);
        },
        onError: (err: unknown) => {
            const error = err as AxiosError<{ message: string }>;
            toast.error(error.response?.data?.message || "Failed to update settings");
        },
        onSettled: () => {
            setSaving(false);
        }
    })

    if (isPending) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
        >
            {/* Account Settings */}
            <AccountSection
                register={register}
                errors={errors}
            />

            {/* App Preferences */}
            <PreferenceSection
                control={control}
            />

            {/* Actions */}
            <Box className="flex justify-start">
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={saving || !isDirty}
                    sx={{
                        borderRadius: 10,
                        px: 6,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: 3,
                        '&:hover': { boxShadow: 4 }
                    }}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </Button>
            </Box>
        </Box>
    );
}

export default SettingsForm;
