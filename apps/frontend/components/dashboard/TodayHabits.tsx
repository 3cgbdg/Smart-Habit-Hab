'use client';

import { Typography, Box, Card } from '@mui/material';
import HabitCard from './HabitCard';
import { Habit } from '@/types/habits';
import { CalendarDays, Plus } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import Link from 'next/link';

interface TodayHabitsProps {
  habits: Habit[];
}

const TodayHabits = ({ habits }: TodayHabitsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <Card className="shadow-xs border border-neutral-200 overflow-hidden">
        <Box className="p-4 bg-lightBlue/50 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue" />
            <Typography variant="h6" className="font-bold text-gray-800 text-lg">
              Today&apos;s Habits
            </Typography>
          </div>
          <Link href={ROUTES.HABITS} className="link text-xs flex items-center gap-1 group">
            Manage <Plus className="w-3 h-3" />
          </Link>
        </Box>
        <div className="p-6">
          {habits && habits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {habits.map((h) => (
                <div key={h.id} className="">
                  <HabitCard type="relevant" habit={h} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Typography sx={{ fontSize: '2rem', opacity: 0.2 }} variant="body1">
                🍃
              </Typography>
              <Typography variant="body1" className="text-gray-400 mt-2 font-medium">
                All caught up for today!
              </Typography>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TodayHabits;
