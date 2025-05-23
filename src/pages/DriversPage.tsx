
import React, { useState } from 'react';
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

const DriversPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Mock function to simulate fetching drivers
  const fetchDrivers = (page: number = 1) => {
    setLoading(true);
    // Simulating API call
    setTimeout(() => {
      const mockDrivers = Array.from({ length: 10 }, (_, index) => ({
        id: index + 1 + (page - 1) * 10,
        name: `Driver ${index + 1 + (page - 1) * 10}`,
        email: `driver${index + 1 + (page - 1) * 10}@example.com`,
        phone: `+1 555-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        country: ['USA', 'UK', 'Canada', 'Australia', 'Germany'][Math.floor(Math.random() * 5)],
        stripe_customer_id: `cus_${Math.random().toString(36).substring(2, 10)}`,
        verified: Math.random() > 0.3 ? 1 : 0,
        account_balance: Math.floor(Math.random() * 1000)
      }));
      
      setDrivers(mockDrivers);
      setLoading(false);
    }, 1000);
  };
  
  // Fetch drivers on initial load
  React.useEffect(() => {
    fetchDrivers();
  }, []);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchDrivers(page);
  };
  
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
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleRefresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Driver
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
                    {drivers.map((driver) => (
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
                              <DropdownMenuItem onClick={() => triggerDelete(driver.id)}>
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
            <div className="flex justify-center mt-4">
              <nav className="flex items-center space-x-1" id="drivers-list-pagination">
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  &lt;
                </Button>
                {[1, 2, 3].map((page) => (
                  <Button 
                    key={page} 
                    variant={page === currentPage ? "default" : "outline"}
                    size="icon"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="icon" 
                  disabled={currentPage === 3}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  &gt;
                </Button>
              </nav>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DriversPage;
