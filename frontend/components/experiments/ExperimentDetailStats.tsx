import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import { TrendingUp, Clock } from "lucide-react";

interface ExperimentDetailStatsProps {
    successRate: number;
    startDate: string;
}

const ExperimentDetailStats = ({ successRate, startDate }: ExperimentDetailStatsProps) => {
    const theme = useTheme();

    const daysRunning = Math.floor(
        (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mb: 4 }}>
            <Card elevation={0} sx={{ bgcolor: 'rgba(76, 175, 80, 0.05)', border: '1px solid rgba(76, 175, 80, 0.1)', borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ p: 1, bgcolor: 'success.main', borderRadius: 2, color: 'white' }}>
                            <TrendingUp size={24} />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600} color="success.main">
                            Success Rate
                        </Typography>
                    </Box>
                    <Typography variant="h3" fontWeight={800} color="text.primary">
                        {successRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Overall performance during experiment
                    </Typography>
                </CardContent>
            </Card>

            <Card elevation={0} sx={{ bgcolor: 'rgba(33, 150, 243, 0.05)', border: '1px solid rgba(33, 150, 243, 0.1)', borderRadius: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 2, color: 'white' }}>
                            <Clock size={24} />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600} color="primary.main">
                            Duration
                        </Typography>
                    </Box>
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
