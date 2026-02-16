'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import experimentsService from '@/services/ExperimentsService';
import { ITEMS_PER_PAGE, DEFAULT_PAGE } from '@/constants/pagination';
import { ROUTES } from '@/constants/routes';
import { toast } from 'react-toastify';
import { useAppSelector } from '@/hooks/reduxHooks';

export const useExperiments = () => {
    const [isHydrated, setIsHydrated] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useAppSelector((state) => state.profile.user);
    const userId = user?.id;

    const page = Number(searchParams.get('page')) || DEFAULT_PAGE;

    useEffect(() => {
        const handle = requestAnimationFrame(() => {
            setIsHydrated(true);
        });
        return () => cancelAnimationFrame(handle);
    }, []);

    useEffect(() => {
        if (!searchParams.get('page')) {
            router.replace(`${ROUTES.EXPERIMENTS}?page=${DEFAULT_PAGE}`);
        }
    }, [searchParams, router]);

    const {
        data: experimentsData,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['experiments', 'all', page, userId],
        queryFn: async () => {
            const response = await experimentsService.getMyExperiments(page, ITEMS_PER_PAGE);
            return response.data;
        },
        enabled: isHydrated,
    });

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
    }, [error]);

    const handlePageChange = useCallback(
        (value: number) => {
            router.push(`${ROUTES.EXPERIMENTS}?page=${value}`);
        },
        [router],
    );

    const totalPages = useMemo(
        () => (experimentsData ? Math.ceil(experimentsData.total / ITEMS_PER_PAGE) : 0),
        [experimentsData],
    );

    const openModal = useCallback(() => setIsModalOpen(true), []);
    const closeModal = useCallback(() => setIsModalOpen(false), []);

    return {
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
    };
};
