
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface DispatchStatusItem {
  name: string;
  value: string;
}

interface DispatchStatusProps {
  stats: DispatchStatusItem[];
}

const DispatchStatus: React.FC<DispatchStatusProps> = ({ stats }) => {
  if (!stats || stats.length < 3) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dispatch Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No dispatch data available</p>
        </CardContent>
      </Card>
    );
  }

  // Extract values and convert to numbers
  const waitingValue = parseFloat(stats[0]?.value || '0');
  const onTheWayValue = parseFloat(stats[1]?.value || '0');
  const arrivingValue = parseFloat(stats[2]?.value || '0');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispatch Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Waiting</span>
            <span className="text-sm font-medium">{waitingValue}%</span>
          </div>
          <Progress value={waitingValue} className="h-2 bg-gray-200" indicatorClassName="bg-amber-400" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">On The Way</span>
            <span className="text-sm font-medium">{onTheWayValue}%</span>
          </div>
          <Progress value={onTheWayValue} className="h-2 bg-gray-200" indicatorClassName="bg-primary" />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Arriving</span>
            <span className="text-sm font-medium">{arrivingValue}%</span>
          </div>
          <Progress value={arrivingValue} className="h-2 bg-gray-200" indicatorClassName="bg-green-600" />
        </div>
      </CardContent>
    </Card>
  );
};

export default DispatchStatus;
