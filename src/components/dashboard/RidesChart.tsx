
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RidesChartProps {
  hourlyRides: number[];
}

const RidesChart: React.FC<RidesChartProps> = ({ hourlyRides }) => {
  // Create an array of objects with time labels for the chart
  const timeLabels = [
    '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', 
    '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', 
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  const chartData = hourlyRides.map((rides, index) => ({
    time: timeLabels[index],
    rides,
  }));

  // Define blue shades for visual variety
  const blueShades = [
    '#87CEEB', '#00BFFF', '#ADD8E6', '#6495ED', 
    '#4682B4', '#87CEEB', '#00BFFF', '#ADD8E6', 
    '#6495ED', '#4682B4', '#87CEEB', '#00BFFF', '#ADD8E6'
  ];

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Rides Today</CardTitle>
      </CardHeader>
      <CardContent className="relative h-[300px]">
        <ChartContainer 
          config={{
            rides: { color: '#00BFFF', label: 'Rides' }
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 10 }}
                tickMargin={8}
              />
              <YAxis
                tickCount={5}
                tick={{ fontSize: 10 }}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                formatter={(value) => [`${value} rides`, 'Rides']}
              />
              <Bar
                dataKey="rides"
                fill="#87CEEB"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RidesChart;
