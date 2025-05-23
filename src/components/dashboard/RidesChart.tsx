
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

interface RidesChartProps {
  hourlyRides: number[];
}

const RidesChart: React.FC<RidesChartProps> = ({ hourlyRides }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        const timeLabels = [
          '6:00 AM', '7:00 AM', '8:00 AM', '9:00 AM', 
          '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', 
          '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
        ];

        const blueShades = [
          '#87CEEB', '#00BFFF', '#ADD8E6', '#6495ED', 
          '#4682B4', '#87CEEB', '#00BFFF', '#ADD8E6', 
          '#6495ED', '#4682B4', '#87CEEB', '#00BFFF', '#ADD8E6'
        ];

        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: timeLabels,
            datasets: [{
              label: 'Rides',
              data: hourlyRides,
              backgroundColor: blueShades,
              borderColor: blueShades.map(color => color.replace(')', ', 0.7)')),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              },
              title: {
                display: true,
                text: 'Realtime Ride Shares Today'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0
                }
              }
            },
            maintainAspectRatio: false,
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [hourlyRides]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Rides Today</CardTitle>
      </CardHeader>
      <CardContent className="relative h-[300px]">
        <canvas ref={chartRef}></canvas>
      </CardContent>
    </Card>
  );
};

export default RidesChart;
