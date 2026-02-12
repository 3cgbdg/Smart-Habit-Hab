"use client"

import { Box } from "@mui/material";
import SettingsForm from "@/components/settings/SettingsForm";

const Page = () => {
    return (
        <Box className="flex flex-col gap-8 max-w-4xl mx-auto pb-10">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <h1 className="page-title">Settings</h1>
                <p className="text-gray">Manage your personal information and application preferences.</p>
            </div>

            <SettingsForm />
        </Box>
    );
};

export default Page;
