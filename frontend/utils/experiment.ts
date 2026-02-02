import { ExperimentStatus } from "@/types/experiments";

export const ExperimentUtils = {

    getStatusStyles(status: ExperimentStatus) {
        switch (status) {
            case ExperimentStatus.RUNNING:
                return {
                    bg: 'rgba(235, 245, 255, 1)',
                    color: 'rgba(37, 150, 243, 1)',
                    label: 'Running'
                };
            case ExperimentStatus.FINISHED:
                return {
                    bg: 'rgba(240, 243, 245, 1)',
                    color: 'rgba(100, 116, 139, 1)',
                    label: 'Finished'
                };
            case ExperimentStatus.PLANNED:
            default:
                return {
                    bg: 'rgba(255, 247, 237, 1)',
                    color: 'rgba(249, 115, 22, 1)',
                    label: 'Planned'
                };
        }
    }
}