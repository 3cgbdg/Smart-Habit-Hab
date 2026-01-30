"use client"

import { useQuery } from "@tanstack/react-query"
import habitsService from "@/services/HabitsService"
import { useParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "react-toastify"

const Page = () => {
    const params = useParams();
    const habitId = params.id as string;

    const { data: habit, isError: isHabitError, error: habitError } = useQuery({
        queryKey: ['habit', habitId],
        queryFn: async () => {
            const data = await habitsService.getHabitById(habitId);
            return data.data;
        },
        staleTime: 60 * 1000,
        gcTime: 1000 * 60 * 60 * 24,
    })

    useEffect(() => {
        if (isHabitError && habitError) {
            toast.error(habitError.message);
        }
    }, [isHabitError, habitError]);

    return (
        <div>
            <h1>{habit?.name}</h1>
            <p>{habit?.description}</p>
        </div>
    )
}

export default Page