"use client"

import { Card, CardContent, Typography, Box } from "@mui/material"
import { Quote } from "lucide-react";

interface DailyInspirationProps {
    quote: {
        content: string;
        author: string;
    } | null;
}

const DailyInspiration = ({ quote }: DailyInspirationProps) => {
    return (
        <Card className="shadow-xs border border-neutral-200 overflow-hidden h-full">
            <Box className="p-4 bg-lightBlue/50 border-b border-neutral-200 flex items-center gap-2">
                <Quote className="w-5 h-5 text-blue rotate-180" />
                <Typography variant="h6" className="font-bold text-gray-800 text-lg">
                    Daily Inspiration
                </Typography>
            </Box>
            <CardContent className="p-6">
                <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden group">
                    <Quote className="absolute -right-4 -top-4 w-24 h-24 text-blue/5 rotate-180 group-hover:scale-110 transition-transform duration-500" />
                    <Typography
                        variant="body1"
                        className="text-gray-700 italic leading-relaxed relative z-10 text-lg"
                    >
                        &quot;{quote?.content || "Loading inspiration..."}&quot;
                    </Typography>
                    <Typography
                        variant="caption"
                        className="text-gray-500 mt-6 block text-right font-medium tracking-wide uppercase"
                    >
                        — {quote?.author || "Internal Source"}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
};

export default DailyInspiration;
