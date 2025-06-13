
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Search, UserPlus, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import api from '@/services/api';
import PaginationControls from '@/components/tables/PaginationControls';

const DriversPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [pagination, setPagination] = useState<any>({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0
    });
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
    const [currentRiderId, setCurrentRiderId] = useState<number | null>(null);
    const [isBalanceModalOpen, setIsBalanceModalOpen] = useState<boolean>(false);
    const [currentBalance, setCurrentBalance] = useState<number>(0);
   

  useEffect(() => {
    fetchDrivers(1);
  }, []);

  const fetchDrivers = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.getDrivers(page);

      console.log(response)
      
      if (response) {

        setDrivers(response.users || []);
        setPagination({
          currentPage: page,
          totalPages: response.pagination?.totalPages || 1,
          totalItems: response.pagination?.totalItems || 0
        });
      }
    } catch (error) {
      console.error('Error fetching riders:', error);
      toast({
        title: "Error",
        description: "Failed to load riders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchDrivers(page);
  };

  const handleDelete = async (id) => {
   

       // In a real app, this would show a confirmation dialog and then call the API
       toast({
        title: "In progress",
        description: `Driver with ID ${id} will be deleted`,
        variant: "default"
      });
    try {
      const response = await api.deleteAccount(id, 'driver');
      
      if (response && response.status) {
        toast({
          title: "Success",
          description: "Driver deleted successfully",
        });
        fetchDrivers(pagination.currentPage);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete driver",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting rider:', error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the driver",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCurrentRiderId(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setCurrentRiderId(id);
    setIsDeleteDialogOpen(true);
  };

  const viewBalance = (balance: number) => {
    setCurrentBalance(balance);
    setIsBalanceModalOpen(true);
  };

  const filteredRiders = Array.isArray(drivers) ? drivers.filter(rider => 
    rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.phone.includes(searchTerm)
  ) : [];
  
  
  const handleRefresh = () => {
    fetchDrivers(currentPage);
    toast({
      title: "Refreshed",
      description: "Driver list has been updated.",
    });
  };
  
  const previewBalance = (balance: number) => {
    toast({
      title: "Wallet Balance",
      description: `$${balance.toLocaleString()} USD`,
      variant: "default"
    });
  };
  
  const triggerDelete = (id: number) => {
    // In a real app, this would show a confirmation dialog and then call the API
    toast({
      title: "Driver Deleted",
      description: `Driver with ID ${id} has been deleted.`,
      variant: "default"
    });
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Drivers</h1>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search drivers..."
              className="pl-8"
              value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Drivers List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-12 w-full" />
                ))}
              </div>
            ) : drivers.length === 0 ? (
              <div className="text-center py-10" id="no-drivers-error">
                <p className="text-muted-foreground">No drivers found</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Stripe ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRiders.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell>{driver.name}</TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{driver.country}</TableCell>
                        <TableCell>{driver.stripe_customer_id}</TableCell>
                        <TableCell>
                          <Badge variant={Number(driver.verified) === 1 ? "default" : "secondary"}>
                            {Number(driver.verified) === 1 ? 'Active' : 'Not Verified'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => previewBalance(driver.account_balance)}>
                                View Wallet Balance
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(driver.id)}>
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            
            {/* Pagination */}
            <PaginationControls
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DriversPage;
