'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { X } from 'lucide-react';
import ExperimentForm from '@/components/experiments/ExperimentForm';
import { Suspense } from 'react';
import { useExperiments } from '@/hooks/useExperiments';
import ExperimentHeader from '@/components/experiments/ExperimentHeader';
import ExperimentEmptyState from '@/components/experiments/ExperimentEmptyState';
import ExperimentList from '@/components/experiments/ExperimentList';

const PageContent = () => {
  const {
    experimentsData,
    isLoading,
    isHydrated,
    isModalOpen,
    page,
    totalPages,
    openModal,
    closeModal,
    handlePageChange,
    refetch,
  } = useExperiments();

  if (!isHydrated) return null;

  return (
    <Box sx={{ p: 1 }}>
      <ExperimentHeader onOpenModal={openModal} />

      <Box>
        {isLoading ? (
          <Box sx={{ color: 'text.secondary', textAlign: 'center', py: 10 }}>
            Loading experiments...
          </Box>
        ) : !experimentsData?.data?.length ? (
          <ExperimentEmptyState onOpenModal={openModal} />
        ) : (
          <ExperimentList
            experiments={experimentsData.data}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </Box>

      <Dialog
        open={isModalOpen}
        onClose={closeModal}
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
            Create New Experiment
          </Typography>
          <IconButton onClick={closeModal} size="small">
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ border: 'none' }}>
          <Box sx={{ py: 2 }}>
            <ExperimentForm
              mode="create"
              onSuccess={() => {
                closeModal();
                refetch();
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default function ExperimentsPage() {
  return (
    <Suspense fallback={<Box sx={{ p: 4, color: 'text.secondary' }}>Loading experiments...</Box>}>
      <PageContent />
    </Suspense>
  );
}
