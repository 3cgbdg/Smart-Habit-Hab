"use client"

import { Typography, Box } from "@mui/material"
import { IHabit } from "@/types/habits"
import AnalyticsHabitCard from "./AnalyticsHabitCard";

interface TopHabitsProps {
    habits: IHabit[];
}

const TopHabits = ({ habits }: TopHabitsProps) => {
    return (
        <Box className="flex flex-col gap-4">
            <Typography variant="h5" className="font-bold text-gray-800">
                Top Habits
            </Typography>
            <Box className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {habits.length > 0 ? (
                    habits.map(habit => (
                        <AnalyticsHabitCard key={habit.id} habit={habit} />
                    ))
                ) : (
                    <Typography className="text-gray-500 py-4 italic">
                        No habits found. Start your journey today!
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default TopHabits;
