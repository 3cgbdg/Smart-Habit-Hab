'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import habitsService from '@/services/HabitsService';
import experimentsService from '@/services/ExperimentsService';
import HabitConsistency from '@/components/analytics/HabitConsistency';
import KeyInsights from '@/components/analytics/KeyInsights';
import TopHabits from '@/components/analytics/TopHabits';
import ExperimentImpact from '@/components/analytics/ExperimentImpact';
import { useAppSelector } from '@/hooks/reduxHooks';

const AnalyticsPage = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setIsHydrated(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const user = useAppSelector((state) => state.profile.user);
  const userId = user?.id;

  const {
    data: weeklyStats,
    isError: isWeeklyError,
    error: weeklyError,
  } = useQuery({
    queryKey: ['weekly-stats', { type: 'analytics' }, userId],

    queryFn: async () => {
      const data = await habitsService.getWeeklyStats(true);
      return data.data;
    },
    staleTime: 60 * 1000,
  });

  const {
    data: habitsData,
    isError: isHabitsError,
    error: habitsError,
  } = useQuery({
    queryKey: ['habits', { type: 'analytics' }, userId],

    queryFn: async () => {
      const res = await habitsService.getMyHabits(1, 4, 'streak', 'DESC');
      return res.data;
    },
    staleTime: 60 * 1000,
  });

  const {
    data: experimentsData,
    isError: isExpError,
    error: expError,
  } = useQuery({
    queryKey: ['experiments', { type: 'analytics' }, userId],

    queryFn: async () => {
      const data = await experimentsService.getMyExperiments(1, 4, true);
      return data?.data?.data || [];
    },
    staleTime: 60 * 1000,
  });

  // Error handling
  useEffect(() => {
    if (isWeeklyError && weeklyError) toast.error(weeklyError.message);
    if (isHabitsError && habitsError) toast.error(habitsError.message);
    if (isExpError && expError) toast.error(expError.message);
  }, [isWeeklyError, weeklyError, isHabitsError, habitsError, isExpError, expError]);

  // memoing the insight message with logic of text definition
  const insightMessage = useMemo(() => {
    if (!habitsData || habitsData.habits.length === 0) return '';
    const avgRate =
      habitsData.habits.reduce((acc, h) => acc + (h.completionRate || 0), 0) /
      habitsData.habits.length;
    if (avgRate > 80)
      return "Impressive! Your average habit completion rate is over 80%. You're maintaining excellent consistency.";
    if (avgRate >= 50)
      return "You're on the right track! Keeping your habits above 50% helps build long-term momentum.";
    return 'Keep going! Focus on one habit at a time to improve your daily consistency.';
  }, [habitsData]);

  if (!isHydrated) return null;

  return (
    <div className="flex flex-col gap-10 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="page-title">Analytics Overview</h1>
        <p className="text-gray">Deep dive into your progress and experiment outcomes.</p>
      </div>

      {/* Consistency & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HabitConsistency data={weeklyStats || { completed: [], missed: [] }} />
        </div>
        <div className="lg:col-span-1">
          <KeyInsights insights={insightMessage} />
        </div>
      </div>

      {/* Top Habits */}
      <TopHabits habits={habitsData?.habits || []} />

      {/* Experiment Impact */}
      <ExperimentImpact data={experimentsData || []} />
    </div>
  );
};

export default AnalyticsPage;
