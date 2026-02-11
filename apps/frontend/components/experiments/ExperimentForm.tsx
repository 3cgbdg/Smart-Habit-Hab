"use client"

import { useMemo, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    TextField,
    Box,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormHelperText
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import experimentsService from "@/services/ExperimentsService";
import habitsService from "@/services/HabitsService";
import { IHabit } from "@/types/habits";
import { toast } from "react-toastify";
import { experimentSchema, ExperimentFormData } from "@/validation/ExperimentFormSchema";
import { IExperimentFormProps } from "@/types/experiments";
import { AxiosError } from "axios";
import { useAppSelector } from "@/hooks/reduxHooks";


const ExperimentForm = ({ mode, initialData, onSuccess }: IExperimentFormProps) => {
    const user = useAppSelector(state => state.profile.user);
    const userId = user?.id;
    const queryClient = useQueryClient();


    const { data: habitsData, isLoading: isLoadingHabits } = useQuery({
        queryKey: ['all-habits-for-select', userId],

        queryFn: () => habitsService.getMyHabits(1, 100),
    });

    const habits = useMemo(() => {
        const data = habitsData?.data;
        const baseHabits = Array.isArray(data)
            ? data
            : (data as unknown as { habits: IHabit[] })?.habits || [];

        // If we have initialData with a habit that's not in the fetched list, add it
        const currentHabitId = initialData?.habitId || initialData?.habit?.id;
        if (initialData?.habit && currentHabitId && !baseHabits.find((h: IHabit) => h.id === currentHabitId)) {
            return [initialData.habit, ...baseHabits];
        }
        return baseHabits;
    }, [habitsData, initialData]);

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<ExperimentFormData>({
        resolver: zodResolver(experimentSchema),
        defaultValues: {
            name: initialData?.name || "",
            habitId: initialData?.habitId || initialData?.habit?.id || "",
            variable: initialData?.variable || "",
            startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
            endDate: initialData?.endDate || "",
        },
    });

    // Reset form when initialData changes (useful for modals)
    useEffect(() => {
        if (initialData) {
            reset({
                name: initialData.name,
                habitId: initialData.habitId || initialData.habit?.id || "",
                variable: initialData.variable,
                startDate: initialData.startDate,
                endDate: initialData.endDate || "",
            });
        }
    }, [initialData, reset]);

    const mutation = useMutation({
        mutationFn: async (data: ExperimentFormData) => {
            if (mode === 'create') {
                return experimentsService.createExperiment(data);
            } else {
                return experimentsService.updateExperiment(initialData!.id, data);
            }
        },
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({ queryKey: ['experiments'] });
            queryClient.invalidateQueries({ queryKey: ['experiment', initialData?.id, userId] });
            onSuccess();
        },

        onError: (error: unknown) => {
            const err = error as AxiosError<{ message: string }>;
            toast.error(err?.response?.data?.message || err.message || "Something went wrong");
        }
    });

    const onSubmit = (data: ExperimentFormData) => {
        const payload = {
            ...data,
            endDate: data.endDate || null,
        };
        mutation.mutate(payload as ExperimentFormData);
    };


    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                width: '100%',
            }}
        >
            <TextField
                label="Experiment Name"
                {...register("name")}
                error={!!errors.name}
                helperText={errors.name?.message}
                fullWidth
                variant="outlined"
            />

            <FormControl fullWidth error={!!errors.habitId}>
                <InputLabel id="habit-select-label">Related Habit</InputLabel>
                <Controller
                    name="habitId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            labelId="habit-select-label"
                            label="Related Habit"
                            {...field}
                            disabled={isLoadingHabits}
                        >
                            {habits.map((habit: IHabit) => (
                                <MenuItem key={habit.id} value={habit.id}>
                                    {habit.name}
                                </MenuItem>
                            ))}
                            {habits.length === 0 && !isLoadingHabits && (
                                <MenuItem disabled>No habits found</MenuItem>
                            )}
                        </Select>
                    )}
                />
                <FormHelperText>{errors.habitId?.message}</FormHelperText>
            </FormControl>

            <TextField
                label="Variable to Test"
                placeholder="e.g., Morning vs Evening, Cold vs Warm"
                {...register("variable")}
                error={!!errors.variable}
                helperText={errors.variable?.message}
                fullWidth
                variant="outlined"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    label="Start Date"
                    type="date"
                    {...register("startDate")}
                    error={!!errors.startDate}
                    helperText={errors.startDate?.message}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="End Date (Optional)"
                    type="date"
                    {...register("endDate")}
                    error={!!errors.endDate}
                    helperText={errors.endDate?.message}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                />
            </Box>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={mutation.isPending}
                sx={{ borderRadius: 10, py: 1.5, fontWeight: 600, mt: 1 }}
            >
                {mutation.isPending ? "Saving..." : mode === 'create' ? "Create Experiment" : "Update Experiment"}
            </Button>
        </Box>
    );
};

export default ExperimentForm;
