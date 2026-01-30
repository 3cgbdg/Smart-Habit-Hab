"use client"

import habitsService from "@/services/HabitsService";
import quoteService from "@/services/QuoteService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useEffect } from "react";
import TodayHabits from "@/components/dashboard/TodayHabits";
import WeeklyProgress from "@/components/dashboard/WeeklyProgress";
import DailyInspiration from "@/components/dashboard/DailyInspiration";
import ActiveExperiments from "@/components/dashboard/ActiveExperiments";

const Page = () => {

    const { data: quote, isError: isQuoteError, error: quoteError } = useQuery({
        queryKey: ['random-quote'],
        queryFn: async () => {
            const data = await quoteService.getRandomQuote();
            return data.data;
        },
        staleTime: 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,

    })

    useEffect(() => {
        if (isQuoteError && quoteError) {
            toast.error(quoteError.message);
        }
    }, [isQuoteError, quoteError]);

    // get endpoints
    const { data: habits, isError: isHabitsError, error: habitsError } = useQuery({
        queryKey: ['relevant-habits'],
        queryFn: async () => {
            const data = await habitsService.getRelevantHabits();
            return data.data;
        },
        staleTime: 60 * 1000,
        gcTime: 1000 * 60 * 60 * 24,
    })

    const { data: weeklyStats, isError: isWeeklyStatsError, error: weeklyStatsError } = useQuery({
        queryKey: ['weekly-stats'],
        queryFn: async () => {
            const data = await habitsService.getWeeklyStats();
            return data.data;
        },
        staleTime: 60 * 1000,
        gcTime: 1000 * 60 * 60 * 24,
    })

    // handling errors
    useEffect(() => {
        if (isHabitsError && habitsError) {
            toast.error(habitsError.message);
        }
    }, [isHabitsError, habitsError]);


    useEffect(() => {
        if (isWeeklyStatsError && weeklyStatsError) {
            toast.error(weeklyStatsError.message);
        }
    }, [isWeeklyStatsError, weeklyStatsError]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
                <h1 className="page-title">Dashboard</h1>
                <p className="text-gray">Quick overview of your habits and experiments.</p>
            </div>

            <TodayHabits habits={habits || []} />

            <div className="grid grid-cols-4 gap-6 items-start">
                <WeeklyProgress data={weeklyStats || []} />
                <DailyInspiration quote={quote || null} />
            </div>

            <div className="grid grid-cols-3 gap-6">
                <ActiveExperiments />
            </div>
        </div>
    )
}

export default Page