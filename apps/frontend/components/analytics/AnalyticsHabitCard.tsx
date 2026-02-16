'use client';

import { Card, CardContent, Typography } from '@mui/material';
import { Flame, Trophy } from 'lucide-react';
import { Habit } from '@/types/habits';

const AnalyticsHabitCard = ({ habit }: { habit: Habit }) => {
  return (
    <Card
      className="shadow-xs border border-neutral-200"
      sx={{
        borderRadius: 4,
        flex: 1,
        minWidth: '240px',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' },
      }}
    >
      <CardContent className="p-5">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-2 bg-blue-50 rounded-xl">
            <Trophy className="w-5 h-5 text-blue-600" />
          </div>
          <Typography variant="h6" className="font-bold text-gray-800 text-base truncate">
            {habit.name}
          </Typography>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1.5 text-orange-600 font-medium">
            <Flame className="w-4 h-4" />
            <span>Streak: {habit.streak || 0} days</span>
          </div>
          <div className="text-gray-500 font-medium">
            Rate: <span className="text-green-600">{habit.completionRate || 0}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsHabitCard;
