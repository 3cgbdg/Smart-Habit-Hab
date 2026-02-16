'use client';

import { Box, Pagination } from '@mui/material';
import ExperimentCard from './ExperimentCard';
import { Experiment } from '@/types/experiments';

interface ExperimentListProps {
  experiments: Experiment[];
  page: number;
  totalPages: number;
  onPageChange: (value: number) => void;
}

const ExperimentList = ({ experiments, page, totalPages, onPageChange }: ExperimentListProps) => (
  <>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {experiments.map((experiment) => (
        <ExperimentCard key={experiment.id} experiment={experiment} />
      ))}
    </Box>

    {totalPages > 1 && (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => onPageChange(value)}
          color="primary"
        />
      </Box>
    )}
  </>
);

export default ExperimentList;
