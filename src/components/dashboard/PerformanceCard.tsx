
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PerformanceCardProps {
  title: string;
  amount: string;
  percentage: number;
  growthIndicator: 'positive' | 'negative';
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  title,
  amount,
  percentage,
  growthIndicator
}) => {
  const isPositive = growthIndicator === 'positive';
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{amount}</div>
        <div className="flex items-center mt-1">
          <span className={`inline-flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {percentage}%
          </span>
          <span className="text-gray-500 text-sm ml-2">vs last month</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
