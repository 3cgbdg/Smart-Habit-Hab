'use client'

import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from "@mui/material";
import { PlusIcon, X } from "lucide-react";
import ExperimentForm from "@/components/experiments/ExperimentForm";
import { useQuery } from "@tanstack/react-query";
import experimentsService from "@/services/ExperimentsService";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import ExperimentCard from "@/components/experiments/ExperimentCard";
import { Pagination } from "@mui/material";

const Page = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const itemsPerPage = 10;

    // Force ?page=1 if not present
    useEffect(() => {
        if (!searchParams.get("page")) {
            router.replace('/experiments?page=1');
        }
    }, [searchParams, router]);

    // modal form window funcs
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { data: experimentsData, isLoading, error } = useQuery({
        queryKey: ['all-experiments', page],
        queryFn: async () => {
            const response = await experimentsService.getMyExperiments(page, itemsPerPage);
            return response.data
        },
    });

    // catching errors
    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    const handlePageChange = (value: number) => {
        router.push(`/experiments?page=${value}`);
    };


    const totalPages = useMemo(() => (experimentsData ? Math.ceil(experimentsData.total / itemsPerPage) : 0), [experimentsData]);

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <h1 className="page-title">Experiments</h1>
                <Button onClick={handleOpen} sx={{ borderRadius: 10, gap: 0.5, fontWeight: 600 }} variant="contained" color="primary" >
                    <PlusIcon /> Create Experiment
                </Button>
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: { borderRadius: 3, p: 1 }
                }}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="section-title">Create New Experiment</h2>
                    <IconButton onClick={handleClose} size="small">
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ border: 'none' }}>
                    <Box sx={{ py: 2 }}>
                        <ExperimentForm mode="create" onSuccess={handleClose} />
                    </Box>
                </DialogContent>
            </Dialog>

            {isLoading ? (
                <Typography color="text.secondary">
                    Loading experiments...
                </Typography>
            ) : experimentsData?.data?.length === 0 ? (
                <Box sx={{ mt: 4, textAlign: 'center', py: 10, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 4, border: '2px dashed rgba(0,0,0,0.1)' }}>
                    <Typography color="text.secondary">
                        No experiments found. Click the button above to start your first one!
                    </Typography>
                </Box>
            ) : (
                <>
                    <div className="flex flex-col gap-6">
                        {experimentsData?.data?.map((experiment) => (
                            <ExperimentCard key={experiment.id} experiment={experiment} />
                        ))}
                    </div>

                    {experimentsData && experimentsData.total > itemsPerPage && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(e, value) => handlePageChange(value)}
                                color="primary"
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    )
}

export default Page;