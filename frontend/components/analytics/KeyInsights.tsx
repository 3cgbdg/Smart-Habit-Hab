"use client"

import { Card, CardContent, Typography, Box } from "@mui/material"
import { Lightbulb } from "lucide-react";

interface KeyInsightsProps {
    insights: string;
}

const KeyInsights = ({ insights }: KeyInsightsProps) => {
    return (
        <Card className="shadow-xs border border-neutral-200 h-full flex flex-col">
            <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="mb-6 p-4 bg-yellow-50 rounded-2xl">
                    <Lightbulb className="w-10 h-10 text-yellow-500" />
                </div>

                <Typography variant="h5" className="font-bold text-gray-800 mb-6">
                    Key Insights
                </Typography>

                <Typography variant="body1" className="text-gray-600 leading-relaxed max-w-md">
                    {insights || "Start completing habits to see personalized insights about your progress and experiment impacts."}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default KeyInsights;
