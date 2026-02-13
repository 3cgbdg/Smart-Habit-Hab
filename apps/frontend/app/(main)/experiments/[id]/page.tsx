'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import experimentsService from '@/services/ExperimentsService';
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { ArrowLeft, Edit2, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ExperimentForm from '@/components/experiments/ExperimentForm';
import ExperimentDetailStats from '@/components/experiments/ExperimentDetailStats';
import ExperimentDetailInfo from '@/components/experiments/ExperimentDetailInfo';
import { useAppSelector } from '@/hooks/reduxHooks';

const ExperimentDetailsPage = () => {
  const user = useAppSelector((state) => state.profile.user);
  const userId = user?.id;

  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsHydrated(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const {
    data: experiment,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['experiment', id, userId],

    queryFn: async () => {
      const res = await experimentsService.getExperimentById(id);
      return res.data;
    },
    enabled: !!id,
  });

  if (!isHydrated) return null;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!experiment) {
    return (
      <Box sx={{ textAlign: 'center', py: 10 }}>
        <Typography variant="h6">Experiment not found</Typography>
        <Button variant="text" onClick={() => router.push('/experiments')} sx={{ mt: 2 }}>
          Go back to list
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 896, mx: 'auto', p: 1, pb: 10 }}>
      {/* Header / Nav */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 6 }}>
        <Button
          startIcon={<ArrowLeft size={20} />}
          onClick={() => router.push('/experiments')}
          sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none' }}
        >
          Back to Experiments
        </Button>

        <Button
          variant="contained"
          startIcon={<Edit2 size={18} />}
          onClick={() => setIsEditOpen(true)}
          sx={{ borderRadius: 10, fontWeight: 600, textTransform: 'none', px: 3 }}
        >
          Edit Experiment
        </Button>
      </Box>

      <Box sx={{ mb: 8 }}>
        <h1 className="page-title">{experiment.name}</h1>
        <Typography
          variant="body1"
          sx={{ color: 'var(--color-gray)', mt: 1.5, fontSize: '1.1rem' }}
        >
          Tracking the impact of <strong>{experiment.variable}</strong> on{' '}
          <strong>{experiment.habit?.name}</strong>.
        </Typography>
      </Box>

      <ExperimentDetailStats
        successRate={experiment.successRate || 0}
        startDate={experiment.startDate || ''}
      />

      <ExperimentDetailInfo experiment={experiment} />

      {/* Edit Modal */}
      <Dialog
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3, p: 1 },
        }}
      >
        <DialogTitle
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
        >
          <Typography
            component="span"
            className="section-title"
            sx={{ fontSize: '1.25rem', fontWeight: 600 }}
          >
            Edit Experiment
          </Typography>
          <IconButton onClick={() => setIsEditOpen(false)} size="small">
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <ExperimentForm
              mode="update"
              initialData={experiment}
              onSuccess={() => {
                setIsEditOpen(false);
                refetch();
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default ExperimentDetailsPage;
