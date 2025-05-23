
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  className
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            
            {trend && (
              <div className={cn("flex items-center mt-2 text-sm", 
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                <span className="font-medium">{trend.value}%</span>
                <span className="ml-1">{trend.isPositive ? '↑' : '↓'}</span>
                <span className="ml-1 text-gray-500">vs last period</span>
              </div>
            )}
          </div>
          
          <div className="h-12 w-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
