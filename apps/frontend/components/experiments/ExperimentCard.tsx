'use client';

import { Box, Typography, useTheme } from '@mui/material';
import type { IExperiment } from '@/types/experiments';
import { TrendingUp, Circle } from 'lucide-react';
import { ExperimentUtils } from '@/utils/experiment';
import { useRouter } from 'next/navigation';

interface ExperimentCardProps {
  experiment: IExperiment;
}

const ExperimentCard = ({ experiment }: ExperimentCardProps) => {
  const theme = useTheme();
  const router = useRouter();

  const statusProps = ExperimentUtils.getStatusStyles(experiment.status || 'planned');

  return (
    <Box
      onClick={() => router.push(`/experiments/${experiment.id}`)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 4,
        boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        border: '1px solid rgba(0,0,0,0.05)',
        gap: 4,
        width: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      }}
    >
      <Box sx={{ flex: 2, minWidth: 200 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'text.primary',
            lineHeight: 1.2,
          }}
        >
          {experiment.name}
        </Typography>
      </Box>

      {/* Habit Section */}
      <Box sx={{ flex: 1.5 }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}
        >
          Habit
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {experiment.habit?.name || 'N/A'}
        </Typography>
      </Box>

      {/* Variable Section */}
      <Box sx={{ flex: 2 }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}
        >
          Variable
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {experiment.variable}
        </Typography>
      </Box>

      {/* Status Section */}
      <Box sx={{ flex: 1.5 }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}
        >
          Status
        </Typography>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 1.5,
            py: 0.5,
            borderRadius: 10,
            bgcolor: statusProps.bg,
            color: statusProps.color,
          }}
        >
          <Circle size={8} fill="currentColor" />
          <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'capitalize' }}>
            {statusProps.label}
          </Typography>
        </Box>
      </Box>

      {/* Success % Section */}
      <Box sx={{ flex: 1, textAlign: 'right' }}>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 500, display: 'block', mb: 0.5 }}
        >
          Success %
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
            {experiment.successRate || 0}%
          </Typography>
          <TrendingUp size={18} color={theme.palette.success.main} />
        </Box>
      </Box>
    </Box>
  );
};

export default ExperimentCard;
