import { ExperimentUtils } from "@/utils/experiment";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { TrendingUp, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface ExperimentDetailStatsProps {
    successRate: number;
    startDate: string;
}

const ExperimentDetailStats = ({ successRate, startDate }: ExperimentDetailStatsProps) => {
    const [daysRunning, setDaysRunning] = useState<number>(0);

    useEffect(() => {
        if (startDate) {
            const handle = requestAnimationFrame(() => {
                setDaysRunning(ExperimentUtils.getDaysRunning(startDate));
            });
            return () => cancelAnimationFrame(handle);
        }
    }, [startDate]);

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
            <Card
                elevation={3}
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Box sx={{ p: 2, bgcolor: 'var(--color-lightBlue)', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUp className="w-5 h-5 text-blue" />
                    <Typography variant="h6" className="font-bold text-gray-800 text-lg">
                        Success Rate
                    </Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h3" fontWeight={800} color="text.primary">
                        {successRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Overall performance during experiment
                    </Typography>
                </CardContent>
            </Card>

            <Card
                elevation={3}
                sx={{
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider'
                }}
            >
                <Box sx={{ p: 2, bgcolor: 'var(--color-lightBlue)', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Clock className="w-5 h-5 text-blue" />
                    <Typography variant="h6" className="font-bold text-gray-800 text-lg">
                        Duration
                    </Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h3" fontWeight={800} color="text.primary">
                        {daysRunning < 0 ? 0 : daysRunning} <Typography component="span" variant="h5" fontWeight={600}>days</Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Time since experiment started
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default ExperimentDetailStats;
