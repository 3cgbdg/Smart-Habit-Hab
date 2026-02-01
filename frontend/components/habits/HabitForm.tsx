"use client"

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField, Box, FormControlLabel, Switch } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import habitsService from "@/services/HabitsService";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { HabitFormData, habitSchema } from "@/validation/HabitFormSchema";
import { IHabitFormProps } from "@/types/habits";
import { AxiosError } from "axios";




const HabitForm = ({ mode, initialData }: IHabitFormProps) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<HabitFormData>({
        resolver: zodResolver(habitSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            isActive: typeof initialData?.isActive === 'boolean' ? initialData.isActive : true,
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: HabitFormData) => {
            if (mode === 'create') {
                return habitsService.createHabit(data);
            } else {
                return habitsService.updateHabit(initialData!.id, data);
            }
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['all-habits'] });
            queryClient.invalidateQueries({ queryKey: ['relevant-habits'] });
            if (initialData?.id) {
                queryClient.invalidateQueries({ queryKey: ['habit', initialData.id] });
            }
            router.push('/habits');
        },
        onError: (error: unknown) => {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err?.response?.data?.message || err.message || "Something went wrong");
        }
    });

    const onSubmit = (data: HabitFormData) => {
        mutation.mutate(data);
    };

    return (
        <>
             
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        maxWidth: 500,
                        width: '100%',
                        bgcolor: 'background.paper',
                        p: 4,
                        borderRadius: 2,
                        boxShadow: 3
                    }}
                >
                    <TextField
                        label="Habit Name"
                        {...register("name")}
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        fullWidth
                        variant="outlined"
                    />

                    <TextField
                        label="Description"
                        {...register("description")}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                    />

                    <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={field.value}
                                        onChange={(e) => field.onChange(e.target.checked)}
                                        color="primary"
                                    />
                                }
                                label="Status Active"
                            />
                        )}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={mutation.isPending}
                        sx={{ borderRadius: 10, py: 1.5, fontWeight: 600 }}
                    >
                        {mutation.isPending ? "Saving..." : mode === 'create' ? "Create Habit" : "Update Habit"}
                    </Button>
                </Box>
            
        </>
    );
};

export default HabitForm;
