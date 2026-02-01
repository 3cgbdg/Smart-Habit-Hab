"use client"

import { Card, CardContent } from "@mui/material"
import { Button } from "@mui/material"
import { Check, CircleCheckBig, Flame, Minus } from "lucide-react"
import { IHabit } from "@/types/habits"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import habitsService from "@/services/HabitsService"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation";

const HabitCard = ({ habit, type }: { habit: IHabit, type: 'relevant' | 'all' }) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const handleCompleteHabit = () => {
        mutation.mutate();
    }

    const mutation = useMutation({
        mutationFn: async () => { const res = await habitsService.completeHabit(habit.id); return res; },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: [type === 'relevant' ? 'relevant-habits' : 'all-habits'] });
            queryClient.invalidateQueries({ queryKey: ['weekly-stats'] });
        }
    });

    const handleSkipHabit = () => {
        skipMutation.mutate();
    }

    const skipMutation = useMutation({
        mutationFn: async () => { const res = await habitsService.skipHabit(habit.id); return res; },
        onSuccess: (data) => {
            toast.success(data.message);
            queryClient.invalidateQueries({ queryKey: [type === 'relevant' ? 'relevant-habits' : 'all-habits'] });
            queryClient.invalidateQueries({ queryKey: ['weekly-stats'] });
        }
    });

    const handleEditHabit = () => {
        router.push(`/habits/${habit.id}`);
    }



    return (
        <Card
            elevation={3}
            sx={{ p: 1, width: "100%", borderRadius: 3 }}
        >
            <CardContent className="flex flex-col min-h-[140px]">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg leading-7 font-medium">{habit.name}</h3>
                    <p className="text-sm leading-5 text-gray-500 flex items-center gap-1">
                        <Flame size={20} color="red" />
                        {habit.streak || 0} Day Streak
                    </p>
                    <p className="text-sm leading-5 text-gray-500 flex items-center gap-1">
                        <CircleCheckBig size={20} color="green" />
                        Completion Rate: {habit.completionRate || 0}%
                    </p>

                </div>
                <div className="flex justify-end mt-10 gap-2">
                    {type === 'relevant' ? (
                        <>
                            <Button
                                className="w-fit"
                                variant="contained"
                                color="error"
                                sx={{

                                    mt: "auto",
                                    borderRadius: 50,
                                    height: 44,
                                }}
                                onClick={handleSkipHabit}
                            >
                                <Minus size={20} />
                            </Button>
                            <Button
                                className="w-fit"
                                variant="contained"
                                color="primary"
                                sx={{

                                    mt: "auto",
                                    borderRadius: 50,
                                    height: 44,
                                }}
                                onClick={handleCompleteHabit}
                            >
                                <Check size={20} />
                            </Button>
                        </>


                    ) :
                        <Button
                            className="w-fit flex justify-end"
                            variant="outlined"
                            color="inherit"
                            sx={{

                                mt: "auto",
                                borderRadius: 50,
                                height: 44,
                            }}
                            onClick={handleEditHabit}
                        >
                            Edit
                        </Button>

                    }
                </div>
            </CardContent>
        </Card>
    )
}

export default HabitCard