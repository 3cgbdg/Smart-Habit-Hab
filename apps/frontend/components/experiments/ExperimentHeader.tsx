'use client';

import { Box, Button } from '@mui/material';
import { PlusIcon } from 'lucide-react';

interface ExperimentHeaderProps {
    onOpenModal: () => void;
}

const ExperimentHeader = ({ onOpenModal }: ExperimentHeaderProps) => (
    <Box
        sx={{
            display: 'flex',
            gap: 2,
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
        }}
    >
        <h1 className="page-title">Experiments</h1>
        <Button
            onClick={onOpenModal}
            sx={{ borderRadius: 10, gap: 0.5, fontWeight: 600 }}
            variant="contained"
            color="primary"
        >
            <PlusIcon /> Create Experiment
        </Button>
    </Box>
);

export default ExperimentHeader;
