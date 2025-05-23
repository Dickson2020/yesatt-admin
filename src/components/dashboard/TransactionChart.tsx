
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components
Chart.register(...registerables);

interface TransactionChartProps {
  inflow: number;
  outflow: number;
}

const TransactionChart: React.FC<TransactionChartProps> = ({ inflow, outflow }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Create new chart
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Inflow', 'Outflow'],
            datasets: [{
              data: [inflow, outflow],
              backgroundColor: [
                '#87CEEB', // Light blue for inflow
                '#FFA07A', // Light salmon for outflow
              ],
              borderColor: [
                '#ffffff',
                '#ffffff',
              ],
              borderWidth: 2,
              hoverOffset: 4
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom',
              },
              title: {
                display: true,
                text: 'Payments Ratio'
              }
            },
            cutout: '70%',
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
  }, [inflow, outflow]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Transaction Overview</CardTitle>
      </CardHeader>
      <CardContent className="relative h-[300px]">
        <canvas ref={chartRef}></canvas>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
