"use client"

import { Card, CardContent, Typography } from "@mui/material"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IWeeklyStats } from "@/types/habits";

interface WeeklyProgressProps {
    data: IWeeklyStats[];
}

const WeeklyProgress = ({ data }: WeeklyProgressProps) => {
    return (
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
                        <LineChart data={data || []}>
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
    );
};

export default WeeklyProgress;
