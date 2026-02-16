'use client';

import { IExperiment } from '@/types/experiments';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { FlaskConical, Timer, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';

const ActiveExperiments = ({ experiments }: { experiments: IExperiment[] }) => {
  if (!experiments || experiments.length === 0) {
    return (
      <Card className="shadow-xs border border-neutral-200">
        <CardContent className="flex flex-col items-center justify-center py-10 text-center">
          <FlaskConical className="w-12 h-12 text-gray/20 mb-4" />
          <Typography variant="h6" className="text-gray-400 font-medium">
            No active experiments
          </Typography>
          <Link href="/experiments" className="link mt-2">
            Start your first test
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xs border border-neutral-200 overflow-hidden">
      <Box className="p-4 bg-lightBlue/50 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-blue" />
          <Typography variant="h6" className="font-bold text-gray-800 text-lg">
            Latest Experiments
          </Typography>
        </div>
        <Link href="/experiments" className="link text-xs flex items-center gap-1 group">
          View All{' '}
          <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
        </Link>
      </Box>
      <CardContent className="p-0">
        <div className="divide-y divide-neutral-100">
          {experiments.map((experiment) => (
            <div
              key={experiment.id}
              className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Typography className="font-semibold text-gray-900 leading-tight">
                      {experiment.name}
                    </Typography>
                    {experiment.successRate !== undefined && (
                      <div
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${experiment.successRate > 70
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                          }`}
                      >
                        {experiment.successRate}% SUCCESS
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray">
                    <div className="flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5 text-blue" />
                      <span>{Math.round(experiment.duration || 0)} days active</span>
                    </div>
                    {experiment.variable && (
                      <div className="flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-violet" />
                        <span>Testing: {experiment.variable}</span>
                      </div>
                    )}
                  </div>
                </div>
                <Link href={`/experiments/${experiment.id}`}>
                  <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:text-blue transition-colors" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveExperiments;
