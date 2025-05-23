
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DispatchStatusProps {
  stats: {
    waiting: number;
    onTheWay: number;
    arriving: number;
  };
}

const DispatchStatus: React.FC<DispatchStatusProps> = ({ stats }) => {
  // Calculate percentages for the progress bars
  const total = stats.waiting + stats.onTheWay + stats.arriving;
  
  // Prevent division by zero
  const waitingPercent = total > 0 ? Math.round((stats.waiting / total) * 100) : 0;
  const onTheWayPercent = total > 0 ? Math.round((stats.onTheWay / total) * 100) : 0;
  const arrivingPercent = total > 0 ? Math.round((stats.arriving / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispatch Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-100 rounded-full"></div>
              <span className="text-sm font-medium">Waiting</span>
            </div>
            <span className="text-sm text-muted-foreground">{stats.waiting} rides</span>
          </div>
          <Progress 
            value={waitingPercent} 
            className="h-2 bg-red-100" 
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm font-medium">On the way</span>
            </div>
            <span className="text-sm text-muted-foreground">{stats.onTheWay} rides</span>
          </div>
          <Progress 
            value={onTheWayPercent} 
            className="h-2 bg-red-500" 
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-900 rounded-full"></div>
              <span className="text-sm font-medium">Arriving</span>
            </div>
            <span className="text-sm text-muted-foreground">{stats.arriving} rides</span>
          </div>
          <Progress 
            value={arrivingPercent} 
            className="h-2 bg-red-900" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DispatchStatus;
