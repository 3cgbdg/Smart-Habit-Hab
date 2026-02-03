'use client'

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import experimentsService from "@/services/ExperimentsService";
import {
    Box,
    Typography,
    Button,
    IconButton,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent
} from "@mui/material";
import { ArrowLeft, Edit2, X } from "lucide-react";
import { useState } from "react";
import ExperimentForm from "@/components/experiments/ExperimentForm";
import ExperimentDetailStats from "@/components/experiments/ExperimentDetailStats";
import ExperimentDetailInfo from "@/components/experiments/ExperimentDetailInfo";

const ExperimentDetailsPage = () => {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { data: experimentRes, isLoading, refetch } = useQuery({
        queryKey: ['experiment', id],
        queryFn: () => experimentsService.getExperimentById(id),
        enabled: !!id,
    });

    const experiment = experimentRes?.data;

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
        <Box sx={{ maxWidth: 900, mx: 'auto', p: 1 }}>
            {/* Header / Nav */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Button
                    startIcon={<ArrowLeft size={20} />}
                    onClick={() => router.push('/experiments')}
                    sx={{ color: 'text.secondary', fontWeight: 600 }}
                >
                    Back to Experiments
                </Button>

                <Button
                    variant="contained"
                    startIcon={<Edit2 size={18} />}
                    onClick={() => setIsEditOpen(true)}
                    sx={{ borderRadius: 10, fontWeight: 600 }}
                >
                    Edit Experiment
                </Button>
            </Box>

            <Box sx={{ mb: 6 }}>
                <h1 className="page-title">{experiment.name}</h1>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Tracking the impact of <strong>{experiment.variable}</strong> on <strong>{experiment.habit?.name}</strong>.
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
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography component="span" className="section-title" sx={{ fontSize: '1.25rem', fontWeight: 600 }}>
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
