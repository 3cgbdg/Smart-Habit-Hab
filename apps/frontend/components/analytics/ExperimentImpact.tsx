'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { IExperiment } from '@/types/experiments';

interface ExperimentImpactProps {
  data: IExperiment[];
}

const ExperimentImpact = ({ data }: ExperimentImpactProps) => {
  return (
    <Card className="shadow-xs border border-neutral-200 overflow-hidden">
      <Box className="p-4 bg-lightBlue/10 border-b border-neutral-200">
        <Typography variant="h6" className="font-bold text-gray-800 text-lg">
          Experiment Success & Impact
        </Typography>
      </Box>
      <CardContent className="p-6">
        <Typography variant="subtitle2" className="text-gray-500 mb-6">
          Comparing success rates and consistency boost from your latest experiments.
        </Typography>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data || []} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend verticalAlign="bottom" height={36} />
              <Bar
                name="Success Rate (%)"
                dataKey="successRate"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
              <Bar
                name="Consistency Boost (%)"
                dataKey="consistencyBoost"
                fill="#2dd4bf"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperimentImpact;
