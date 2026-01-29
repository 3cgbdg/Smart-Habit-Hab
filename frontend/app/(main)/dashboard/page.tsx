"use client"

import { Button, Card, CardContent, Chip, Paper, Typography } from "@mui/material"
import { Check } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Page = () => {

    const habitData = [
        { day: 'Mon', value: 2 },
        { day: 'Tue', value: 3 },
        { day: 'Wed', value: 4 },
        { day: 'Thu', value: 2.5 },
        { day: 'Fri', value: 4 },
        { day: 'Sat', value: 3 },
        { day: 'Sun', value: 2 },
    ];

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
                <div className="grid grid-cols-3">
                    <Paper
                        elevation={3}
                        className="flex flex-col min-h-[140px]"
                        sx={{ p: 4, width: "100%", borderRadius: 3 }}
                    >

                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg leading-7 font-medium">Medium1</h3>
                            <p className="text-sm leading-5 text-gray-500">Smthing</p>
                        </div>

                        <Button
                            className="w-fit"
                            variant="contained"
                            color="primary"
                            sx={{
                                mt: "auto",
                                ml: "auto",
                                borderRadius: 2,
                                height: 44,
                            }}
                        >
                            <Check size={20} />
                        </Button>
                    </Paper>

                </div>
            </div>

            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto space-y-6">

                    {/* Weekly Progress Section */}
                    <Card className="shadow-sm">
                        <CardContent>
                            <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
                                Weekly Progress
                            </Typography>

                            <div className="mb-6">
                                <Typography variant="subtitle2" className="text-gray-600 mb-3">
                                    Habit Completion Trends
                                </Typography>
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={habitData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <XAxis
                                            dataKey="day"
                                            tick={{ fontSize: 12 }}
                                            stroke="#999"
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12 }}
                                            stroke="#999"
                                        />
                                        <Tooltip />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ fill: '#3b82f6', r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Two Column Layout */}
                    <div className="grid  grid-cols-3 gap-6">

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
                                        "The journey of a thousand miles begins with a single step."
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        className="text-gray-500 mt-4 block text-right"
                                    >
                                        - Lao Tzu
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>

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

                               =
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Page