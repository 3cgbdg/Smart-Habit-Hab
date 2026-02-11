"use client"

import { useQuery } from "@tanstack/react-query"
import habitsService from "@/services/HabitsService"
import { useParams } from "next/navigation"
import HabitForm from "@/components/habits/HabitForm"
import { useAppSelector } from "@/hooks/reduxHooks";


const Page = () => {
    const user = useAppSelector(state => state.profile.user);
    const userId = user?.id;

    const { id } = useParams() as { id: string };



    const { data: habit, isLoading } = useQuery({
        queryKey: ['habit', id, userId],

        queryFn: async () => {
            const res = await habitsService.getHabitById(id);
            return res.data;
        },
    })

    if (isLoading) return <div className="p-10 text-center">Loading habit details...</div>

    return (
        <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-col gap-2 text-center">
                <h1 className="page-title text-3xl font-bold">Edit Habit</h1>
                <p className="text-gray-500">Update your habit details below.</p>
            </div>

            {habit && <HabitForm mode="update" initialData={habit} />}
        </div>
    )
}

export default Page;