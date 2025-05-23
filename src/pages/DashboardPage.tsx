
import React from 'react';
import { Users, Car, Calendar, Compass, TrendingUp } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/dashboard/StatCard';
import TransactionChart from '@/components/dashboard/TransactionChart';
import RidesChart from '@/components/dashboard/RidesChart';
import DispatchStatus from '@/components/dashboard/DispatchStatus';
import PerformanceCard from '@/components/dashboard/PerformanceCard';
import LiveMap from '@/components/dashboard/LiveMap';
import { Skeleton } from '@/components/ui/skeleton';

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const DashboardPage: React.FC = () => {
  const { stats, loading } = useDashboard();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </>
          ) : (
            <>
              <StatCard 
                title="Total Riders"
                value={stats?.users || 0}
                icon={<Users className="h-6 w-6" />}
              />
              <StatCard 
                title="Total Drivers"
                value={stats?.drivers || 0}
                icon={<Users className="h-6 w-6" />}
              />
              <StatCard 
                title="Active Bookings"
                value={stats?.activeBookings?.length || 0}
                icon={<Calendar className="h-6 w-6" />}
              />
              <StatCard 
                title="Registered Vehicles"
                value={stats?.uploadedCars || 0}
                icon={<Car className="h-6 w-6" />}
              />
            </>
          )}
        </div>

        {/* Financial Performance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {loading ? (
            <>
              {[1, 2, 3].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </>
          ) : (
            <>
              <PerformanceCard
                title="Total Deposits"
                amount={formatCurrency(stats?.depositPerformance?.total || 0)}
                percentage={stats?.depositPerformance?.percentagePerformance || 0}
                growthIndicator={stats?.depositPerformance?.growthIndicator || 'positive'}
              />
              <PerformanceCard
                title="Total Withdrawals"
                amount={formatCurrency(stats?.payoutPerformance?.total || 0)}
                percentage={stats?.payoutPerformance?.percentagePerformance || 0}
                growthIndicator={stats?.payoutPerformance?.growthIndicator || 'positive'}
              />
              <PerformanceCard
                title="Ride Share Charges"
                amount={formatCurrency(stats?.cancelChargePerformance?.total || 0)}
                percentage={stats?.cancelChargePerformance?.percentagePerformance || 0}
                growthIndicator={stats?.cancelChargePerformance?.growthIndicator || 'positive'}
              />
            </>
          )}
        </div>

        {/* Charts and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loading ? (
            <>
              {[1, 2].map((_, i) => (
                <Skeleton key={i} className="h-96 w-full" />
              ))}
            </>
          ) : (
            <>
              <TransactionChart 
                inflow={stats?.totalInflow || 0} 
                outflow={stats?.totalOutflow || 0} 
              />
              <RidesChart hourlyRides={stats?.hourlyRides || new Array(13).fill(0)} />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {loading ? (
            <>
              {[1, 2, 3].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </>
          ) : (
            <>
              <div className="lg:col-span-1">
                <DispatchStatus stats={stats?.dispatchStat || []} />
              </div>
              <div className="lg:col-span-2">
                <LiveMap />
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
