"use client"

import { Card, CardContent, Chip, Typography } from "@mui/material"

const ActiveExperiments = () => {
    return (
        <Card className="shadow-sm">
            <CardContent>
                <Typography variant="h6" className="font-semibold mb-4 text-gray-800">
                    Active Experiments
                </Typography>

                <div className="space-y-4">
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
    );
};

export default ActiveExperiments;
