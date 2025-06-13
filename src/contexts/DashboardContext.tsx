
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import api from '@/services/api';
import { DashboardStats } from '@/types';

interface DashboardContextType {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refreshStats: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.getDashboardStats();      
      if (response ) {
        setStats(response);
        setError(null);
      } else {
        setError("Failed to fetch dashboard data");
        toast({
          title: "Error",
          description: "Failed to fetch dashboard data",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("An error occurred while fetching dashboard data");
      toast({
        title: "Error",
        description: "An error occurred while fetching dashboard data",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Set up refresh interval (every 5 minutes)
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const refreshStats = async () => {
    await fetchStats();
  };

  return (
    <DashboardContext.Provider
      value={{
        stats,
        loading,
        error,
        refreshStats,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
