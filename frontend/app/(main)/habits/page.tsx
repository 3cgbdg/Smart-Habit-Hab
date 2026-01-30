"use client"

import { useQuery } from "@tanstack/react-query"
import habitsService from "@/services/HabitsService"
import { useEffect } from "react"
import { toast } from "react-toastify"
import HabitCard from "@/components/dashboard/HabitCard"

const Page = () => {

    const { data: habits, isError: isHabitsError, error: habitsError } = useQuery({
        queryKey: ['all-habits'],
        queryFn: async () => {
            const data = await habitsService.getMyHabits();
            return data.data;
        },
        staleTime: 60 * 1000,
        gcTime: 1000 * 60 * 60 * 24,
    })

    useEffect(() => {
        if (isHabitsError && habitsError) {
            toast.error(habitsError.message);
        }
    }, [isHabitsError, habitsError]);

    return (
        <div>
            <div className="flex flex-col gap-6">
                <h1 className="page-title">All Habits</h1>
                <p className="text-gray">Manage your habits and experiments.</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {habits?.map(h => (
                    <div key={h.id} className="">
                        <HabitCard type='all' habit={h} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Page