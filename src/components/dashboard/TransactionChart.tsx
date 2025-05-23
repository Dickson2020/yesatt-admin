
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface TransactionChartProps {
  inflow: number;
  outflow: number;
}

const TransactionChart: React.FC<TransactionChartProps> = ({ inflow, outflow }) => {
  const data = [
    { name: 'Inflow', value: inflow },
    { name: 'Outflow', value: outflow },
  ];
  
  const COLORS = ['#87CEEB', '#FFA07A'];
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Transaction Overview</CardTitle>
      </CardHeader>
      <CardContent className="relative h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend
              verticalAlign="bottom"
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
