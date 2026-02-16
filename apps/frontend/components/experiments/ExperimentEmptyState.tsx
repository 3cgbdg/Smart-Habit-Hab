'use client';

import { Box, Typography } from '@mui/material';

interface ExperimentEmptyStateProps {
    onOpenModal: () => void;
}

const ExperimentEmptyState = ({ onOpenModal }: ExperimentEmptyStateProps) => (
    <Box
        sx={{
            mt: 4,
            textAlign: 'center',
            py: 10,
            bgcolor: 'rgba(0,0,0,0.02)',
            borderRadius: 4,
            border: '2px dashed rgba(0,0,0,0.1)',
            cursor: 'pointer',
        }}
        onClick={onOpenModal}
    >
        <Typography color="text.secondary">
            No experiments found. Click here or use the button above to start your first one!
        </Typography>
    </Box>
);

export default ExperimentEmptyState;
