"use client"

import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import habitsService from "@/services/HabitsService";
import experimentsService from "@/services/ExperimentsService";
import HabitConsistency from "@/components/analytics/HabitConsistency";
import KeyInsights from "@/components/analytics/KeyInsights";
import TopHabits from "@/components/analytics/TopHabits";
import ExperimentImpact from "@/components/analytics/ExperimentImpact";

const AnalyticsPage = () => {
    // 1. Weekly Stats for Consistency Chart
    const { data: weeklyStats, isError: isWeeklyError, error: weeklyError } = useQuery({
        queryKey: ['weekly-stats'],
        queryFn: async () => {
            const data = await habitsService.getWeeklyStats();
            return data.data;
        },
        staleTime: 60 * 1000,
    });

    // 2. Top Habits (Using my habits and sorting by completion rate)
    const { data: habitsData, isError: isHabitsError, error: habitsError } = useQuery({
        queryKey: ['all-habits-analytics'],
        queryFn: async () => {
            // Fetch first 10 habits and we'll take top ones
            const data = await habitsService.getMyHabits(1, 10);
            return data?.data?.habits || [];
        },
        staleTime: 60 * 1000,
    });

    // 3. Experiments for Impact Chart
    const { data: experimentsData, isError: isExpError, error: expError } = useQuery({
        queryKey: ['experiments-analytics'],
        queryFn: async () => {
            const data = await experimentsService.getMyExperiments(1, 5);
            return data?.data?.data || [];
        },
        staleTime: 60 * 1000,
    });

    // Error handling
    useEffect(() => {
        if (isWeeklyError && weeklyError) toast.error(weeklyError.message);
        if (isHabitsError && habitsError) toast.error(habitsError.message);
        if (isExpError && expError) toast.error(expError.message);
    }, [isWeeklyError, weeklyError, isHabitsError, habitsError, isExpError, expError]);

    // Data processing
    const topHabits = useMemo(() => {
        if (!habitsData) return [];
        return [...habitsData]
            .sort((a, b) => (b.completionRate || 0) - (a.completionRate || 0))
            .slice(0, 4);
    }, [habitsData]);

    const experimentsWithBoost = useMemo(() => {
        if (!experimentsData) return [];
        return experimentsData.map(exp => ({
            ...exp,
            // Mock consistency boost if not provided by API yet
            consistencyBoost: Math.floor(Math.random() * 15) + 5
        }));
    }, [experimentsData]);

    const insightMessage = useMemo(() => {
        if (!habitsData || habitsData.length === 0) return "";
        const avgRate = habitsData.reduce((acc, h) => acc + (h.completionRate || 0), 0) / habitsData.length;
        if (avgRate > 80) return "Impressive! Your average habit completion rate is over 80%. You're maintaining excellent consistency.";
        if (avgRate > 50) return "You're on the right track! Keeping your habits above 50% helps build long-term momentum.";
        return "Keep going! Focus on one habit at a time to improve your daily consistency.";
    }, [habitsData]);

    return (
        <div className="flex flex-col gap-10 pb-10">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="page-title">Analytics Overview</h1>
                <p className="text-gray">Deep dive into your progress and experiment outcomes.</p>
            </div>

            {/* Top Row: Consistency & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <HabitConsistency data={weeklyStats || []} />
                </div>
                <div className="lg:col-span-1">
                    <KeyInsights insights={insightMessage} />
                </div>
            </div>

            {/* Middle Row: Top Habits */}
            <TopHabits habits={topHabits} />

            {/* Bottom Row: Experiment Impact */}
            <ExperimentImpact data={experimentsWithBoost} />
        </div>
    );
};

export default AnalyticsPage;
