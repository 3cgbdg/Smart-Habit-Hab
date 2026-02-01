"use client"

import { Card, CardContent, Typography } from "@mui/material"

interface DailyInspirationProps {
    quote: {
        content: string;
        author: string;
    } | null;
}

const DailyInspiration = ({ quote }: DailyInspirationProps) => {
    return (
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
                        &quot;{quote?.content || "Loading inspiration..."}&quot;
                    </Typography>   
                    <Typography
                        variant="caption"
                        className="text-gray-500 mt-4 block text-right"
                    >
                        - {quote?.author || "Internal Source"}
                    </Typography>
                </div>
            </CardContent>
        </Card>
    );
};

export default DailyInspiration;
