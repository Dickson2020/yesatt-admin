
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
        <ChartContainer 
          config={{
            inflow: { color: '#87CEEB', label: 'Inflow' },
            outflow: { color: '#FFA07A', label: 'Outflow' },
          }}
        >
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
              <ChartTooltip 
                content={(props) => (
                  <ChartTooltipContent {...props} />
                )} 
              />
              <ChartLegend
                verticalAlign="bottom"
                content={(props) => (
                  <ChartLegendContent {...props} />
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
