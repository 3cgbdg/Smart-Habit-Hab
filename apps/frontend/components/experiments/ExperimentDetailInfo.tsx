import { Box, Card, Typography, Divider } from '@mui/material';
import { Target, Beaker, Calendar, Circle } from 'lucide-react';
import type { Experiment } from '@/types/experiments';
import { ExperimentUtils } from '@/utils/experiment';

interface ExperimentDetailInfoProps {
  experiment: Experiment;
}

const ExperimentDetailInfo = ({ experiment }: ExperimentDetailInfoProps) => {
  const statusProps = ExperimentUtils.getStatusStyles(experiment.status || 'planned');

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        mb: 4,
      }}
    >
      <Box
        sx={{
          p: 3,
          bgcolor: 'var(--color-lightBlue)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Beaker className="w-5 h-5 text-blue" />
        <Typography variant="h6" className="font-bold text-gray-800 text-lg">
          Experiment Configuration
        </Typography>
      </Box>

      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                display: 'block',
                mb: 1.5,
              }}
            >
              Target Habit
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ p: 1, bgcolor: 'primary.main', borderRadius: 1.5, color: 'white' }}>
                <Target size={20} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                {experiment.habit?.name}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                display: 'block',
                mb: 1.5,
              }}
            >
              Variable Tested
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: 'grey.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'grey.100',
              }}
            >
              <Typography variant="body1" fontWeight={600} color="text.primary">
                {experiment.variable}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                display: 'block',
                mb: 1.5,
              }}
            >
              Timeline
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Calendar className="text-gray-400" size={20} />
              <Typography variant="body1" fontWeight={500}>
                {experiment.startDate}{' '}
                {experiment.endDate ? ` — ${experiment.endDate}` : '(ongoing)'}
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                display: 'block',
                mb: 1.5,
              }}
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
              <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                {statusProps.label}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};

export default ExperimentDetailInfo;
