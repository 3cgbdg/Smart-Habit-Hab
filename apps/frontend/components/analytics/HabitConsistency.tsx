"use client"

import { Card, CardContent, Typography, Box } from "@mui/material"
import { Activity } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useHabitChartData } from "@/hooks/useHabitChartData";
import { IWeekStats } from "@/types/habits";

interface HabitConsistencyProps {
    data: IWeekStats;
}

const HabitConsistency = ({ data }: HabitConsistencyProps) => {

    // use custom hook for caching data with formatted dates
    const chartData = useHabitChartData(data);

    return (
        <Card className="shadow-xs border border-neutral-200 overflow-hidden col-span-2">
            <Box className="p-4 bg-lightBlue/10 border-b border-neutral-200 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue" />
                <Typography variant="h6" className="font-bold text-gray-800 text-lg">
                    Habit Consistency (Last 7 Days)
                </Typography>
            </Box>
            <CardContent className="p-6">
                <Typography variant="subtitle2" className="text-gray-500 mb-6">
                    Daily overview of completed vs. missed habits.
                </Typography>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                            <XAxis
                                dataKey="day"
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fontSize: 12, fill: '#94a3b8' }}
                                axisLine={false}
                                tickLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '12px',
                                    border: 'none',
                                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                }}
                            />
                            <Legend verticalAlign="bottom" height={36} />
                            <Line
                                name="Completed"
                                type="monotone"
                                dataKey="completed"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                            <Line
                                name="Missed"
                                type="monotone"
                                dataKey="missed"
                                stroke="#ef4444"
                                strokeWidth={3}
                                dot={{ fill: '#ef4444', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default HabitConsistency;
