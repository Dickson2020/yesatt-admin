
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';
import { Booking, PaginationData } from '@/types';
import PaginationControls from '@/components/tables/PaginationControls';

const BookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('pending');
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings(1);
  }, []);

  const fetchBookings = async (page: number, filter = 'pending') => {
    try {
      setLoading(true);
      const response = await api.getBookings(page, filter);

      console.log(response)
      
      if (response) {
        setBookings(response.bookings || []);
        if (response.pagination) {
          setPagination({
            currentPage: page,
            totalPages: response.pagination.totalPages || 1,
            totalItems: response.pagination.totalItems || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchBookings(page);
  };

  const handleFilterChange = (filter: string) => {
    fetchBookings(1, filter)
    setActiveFilter(filter);
  };

  const filteredBookings = bookings.filter(booking => 
    booking.status.toLowerCase() === activeFilter.toLowerCase()
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bookings Management</h1>
          <Button onClick={() => fetchBookings(1)}>
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" onValueChange={handleFilterChange}>
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="accepted">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value={activeFilter}>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : filteredBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No {activeFilter} bookings found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                Booking Code: {booking.booking_code}
                              </span>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="flex items-start space-x-2">
                                <div className="min-w-[24px] mt-1">
                                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">
                                    <MapPin className="h-3 w-3" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">Pickup Location</p>
                                  <p className="text-sm text-gray-600">{booking.place}</p>
                                  <p className="text-xs text-gray-500 mt-0.5">
                                    {booking.pickup_type || booking.pickuptype || 'Standard Pickup'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start space-x-2">
                                <div className="min-w-[24px] mt-1">
                                  <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-primary">
                                    <MapPin className="h-3 w-3" />
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">Dropoff Location</p>
                                  <p className="text-sm text-gray-600">{booking.destination_place}</p>
                                </div>
                              </div>

                              <div className="flex justify-between items-center pt-2 text-sm border-t">
                                <div>
                                  <span className="text-gray-500">Payment Method: </span>
                                  <span className="font-medium">
                                    {booking.payment ? booking.payment.toUpperCase() : 'N/A'}
                                  </span>
                                </div>
                               
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <PaginationControls
                      pagination={pagination}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BookingsPage;
