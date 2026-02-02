'use client'

import { Box, Typography } from "@mui/material";
import { IExperiment } from "@/types/experiments";

const ExperimentCard = ({ experiment }: { experiment: IExperiment }) => {
    return (
        <Box>
            <Typography variant="h6">{experiment.name}</Typography>
            <Typography variant="body2">{experiment.variable}</Typography>
            <Typography variant="body2">{experiment.startDate}</Typography>
            <Typography variant="body2">{experiment.endDate}</Typography>
        </Box>
    )
}

export default ExperimentCard