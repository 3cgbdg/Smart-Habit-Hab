"use client"

import habitsService from "@/services/HabitsService";
import quoteService from "@/services/QuoteService";
import { Button, Card, CardContent, Chip, Paper, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query";
import { Check, Flame } from "lucide-react"
import { toast } from "react-toastify";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect } from "react";
import HabitCard from "@/components/dashboard/HabitCard";

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
    //


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

    //
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6">
                <h1 className="page-title">Dashboard</h1>
                <p className="text-gray">Quick overview of your habits and experiments.</p>
            </div>
            <div className="flex flex-col gap-6">
                <h2 className="section-title">
                    Today's Habits
                </h2>


                {habits && habits.length > 0 ?
                    <div className="grid grid-cols-3">
                        {habits.map(h => (
                            <div key={h.id} className="">
                                <HabitCard habit={h} />
                            </div>
                        ))}
                    </div>
                    : <Paper elevation={3} className="p-4 text-center text-gray-500  w-full">
                        <Typography sx={{ fontSize: "2rem" }} variant="body1">🗑️.....</Typography>
                    </Paper>
                }

            </div>


            <div className="grid grid-cols-4 gap-6 items-start">




                {/* Weekly Progress Section */}

                <Card className="shadow-sm col-span-3">
                    <CardContent>
                        <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
                            Weekly Progress
                        </Typography>

                        <div className="mb-6">
                            <Typography variant="subtitle2" className="text-gray-600 mb-3">
                                Habit Completion Trends
                            </Typography>
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={weeklyStats || []}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="day"
                                        tick={{ fontSize: 12 }}
                                        stroke="#999"
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12 }}
                                        stroke="#999"
                                        allowDecimals={false}
                                    />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ fill: '#3b82f6', r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>



                    </CardContent>
                </Card>


                <Card className="shadow-sm">
                    <CardContent>
                        <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
                            Daily Inspiration
                        </Typography>

                        <div className="bg-blue-50 rounded-lg p-6">
                            <Typography
                                variant="body1"
                                className="text-gray-700 italic leading-relaxed"
                            >
                                "{quote?.content}"
                            </Typography>
                            <Typography
                                variant="caption"
                                className="text-gray-500 mt-4 block text-right"
                            >
                                - {quote?.author}
                            </Typography>
                        </div>
                    </CardContent>
                </Card>
            </div>
            {/* Two Column Layout */}
            <div className="grid  grid-cols-3 gap-6">


                {/* Active Experiments */}
                <Card className="shadow-sm">
                    <CardContent>
                        <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
                            Active Experiments
                        </Typography>

                        <div className="space-y-4">
                            {/* Morning Routine */}
                            <div className="border-l-4 border-blue-500 pl-4 py-2">
                                <div className="flex items-start justify-between mb-2">
                                    <Typography variant="subtitle1" className="font-medium text-gray-800">
                                        Morning Routine Optimization
                                    </Typography>
                                </div>
                                <Chip
                                    label="12 days left"
                                    size="small"
                                    className="bg-blue-100 text-blue-700"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>



        </div>
    )
}

export default Page