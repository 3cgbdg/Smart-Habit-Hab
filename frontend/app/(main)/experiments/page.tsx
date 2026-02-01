'use client'

import { useState } from "react";
import { Button, Dialog, DialogTitle, DialogContent, IconButton, Typography, Box } from "@mui/material";
import { PlusIcon, X } from "lucide-react";
import ExperimentForm from "@/components/experiments/ExperimentForm";

const Page = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
                    <Typography variant="h6" fontWeight="bold">Create New Experiment</Typography>
                    <IconButton onClick={handleClose} size="small">
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ border: 'none' }}>
                    <Box sx={{ py: 2 }}>
                        <ExperimentForm mode="create" onSuccess={handleClose} />
                    </Box>
                </DialogContent>
            </Dialog>

            <Box sx={{ mt: 4, textAlign: 'center', py: 10, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 4, border: '2px dashed rgba(0,0,0,0.1)' }}>
                <Typography color="text.secondary">
                    No experiments found. Click the button above to start your first one!
                </Typography>
            </Box>
        </Box>
    )
}

export default Page;