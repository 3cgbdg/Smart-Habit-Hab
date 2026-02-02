"use client"

import { Card, CardContent, Typography, Box } from "@mui/material"
import { TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IWeeklyStats } from "@/types/habits";

interface WeeklyProgressProps {
    data: IWeeklyStats[];
}

const WeeklyProgress = ({ data }: WeeklyProgressProps) => {
    return (
        <Card className="shadow-xs border border-neutral-200 overflow-hidden col-span-3">
            <Box className="p-4 bg-lightBlue/50 border-b border-neutral-200 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue" />
                <Typography variant="h6" className="font-bold text-gray-800 text-lg">
                    Weekly Progress
                </Typography>
            </Box>
            <CardContent className="p-6">
                <div className="mb-2">
                    <Typography variant="subtitle2" className="text-gray-500 mb-4">
                        Habit Completion Trends
                    </Typography>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={data || []}>
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
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#3a7ae9ff"
                                strokeWidth={3}
                                dot={{ fill: '#3a7ae9ff', r: 4, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default WeeklyProgress;
