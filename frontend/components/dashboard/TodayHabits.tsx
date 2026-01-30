"use client"

import { Paper, Typography } from "@mui/material"
import HabitCard from "./HabitCard";
import { IHabit } from "@/types/habits";

interface TodayHabitsProps {
    habits: IHabit[];
}

const TodayHabits = ({ habits }: TodayHabitsProps) => {
    return (
        <div className="flex flex-col gap-6">
            <h2 className="section-title">
                Today's Habits
            </h2>

            {habits && habits.length > 0 ?
                <div className="grid grid-cols-3 gap-4">
                    {habits.map(h => (
                        <div key={h.id} className="">
                            <HabitCard type='relevant' habit={h} />
                        </div>
                    ))}
                </div>
                : <Paper elevation={3} className="p-4 text-center text-gray-500  w-full">
                    <Typography sx={{ fontSize: "2rem" }} variant="body1">🗑️.....</Typography>
                </Paper>
            }
        </div>
    );
};

export default TodayHabits;
