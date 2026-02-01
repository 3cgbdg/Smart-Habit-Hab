"use client"

import { useQuery } from "@tanstack/react-query"
import habitsService from "@/services/HabitsService"
import { useEffect, useMemo } from "react"
import { toast } from "react-toastify"
import HabitCard from "@/components/dashboard/HabitCard"
import { Button, Pagination, Box } from "@mui/material"
import { useRouter, useSearchParams } from "next/navigation"

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 1;
    const itemsPerPage = 1;
    const { data: habitsData, isError: isHabitsError, error: habitsError } = useQuery({
        queryKey: ['all-habits', page],
        queryFn: async () => {
            const data = await habitsService.getMyHabits(page, itemsPerPage);
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




    const handlePageChange = (value: number) => {
        router.push(`/habits?page=${value}`);
    };

    const totalPages = useMemo(() => (habitsData ? Math.ceil(habitsData.total / itemsPerPage) : 0), [habitsData])
    return (
        <div className="flex flex-col gap-6">
            <div className="flex  gap-6 justify-between items-center">
                <h1 className="page-title">All Habits</h1>
                <Button sx={{ borderRadius: 10, fontWeight: 600 }} variant="contained" color="primary" onClick={() => router.push('/habits/new')}>
                    Create Habit
                </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {habitsData?.habits?.map(h => (
                    <div key={h.id} className="">
                        <HabitCard type='all' habit={h} />
                    </div>
                ))}
            </div>

            {habitsData && habitsData.total > itemsPerPage && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={(e, value) => handlePageChange(value)}
                        color="primary"
                    />
                </Box>
            )}
        </div>
    )
}

export default Page