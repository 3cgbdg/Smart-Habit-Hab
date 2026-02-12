"use client"

import HabitForm from "@/components/habits/HabitForm";

const Page = () => {
    return (
        <div className="flex flex-col gap-6 items-center">
            <div className="flex flex-col gap-2 text-center">
                <h1 className="page-title text-3xl font-bold">Create New Habit</h1>
                <p className="text-gray-500">Define a new goal to track and improve your life.</p>
            </div>

            <HabitForm mode="create" />
        </div>
    );
};

export default Page;
