
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Eye, MoreHorizontal, Search, Loader, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import api from '@/services/api';
import { Driver, PaginationData } from '@/types';
import PaginationControls from '@/components/tables/PaginationControls';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const DriversPage: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentDriverId, setCurrentDriverId] = useState<number | null>(null);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState<boolean>(false);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchDrivers(1);
  }, []);

  const fetchDrivers = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.getDrivers(page);
      
      if (response) {
        setDrivers(response.data?.users || []);
        setPagination({
          currentPage: page,
          totalPages: response.pagination?.totalPages || 1,
          totalItems: response.pagination?.totalItems || 0
        });
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast({
        title: "Error",
        description: "Failed to load drivers",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchDrivers(page);
  };

  const handleDelete = async () => {
    if (!currentDriverId) return;
    
    try {
      const response = await api.deleteAccount(currentDriverId, 'driver');
      
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
      console.error('Error deleting driver:', error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the driver",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setCurrentDriverId(null);
    }
  };

  const openDeleteDialog = (id: number) => {
    setCurrentDriverId(id);
    setIsDeleteDialogOpen(true);
  };

  const viewBalance = (balance: number) => {
    setCurrentBalance(balance);
    setIsBalanceModalOpen(true);
  };

  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return <Badge variant="success">Online</Badge>;
    } else {
      return <Badge variant="outline">Offline</Badge>;
    }
  };

  const filteredDrivers = drivers.filter(driver => 
    driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    driver.phone.includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Drivers Management</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500" />
              <Input
                placeholder="Search drivers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">Export</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Drivers</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : drivers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
                <h3 className="text-lg font-medium">No drivers found</h3>
                <p className="text-gray-500">There are no drivers registered in the system.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Stripe ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDrivers.map((driver) => (
                      <TableRow key={driver.id}>
                        <TableCell className="font-medium">{driver.name}</TableCell>
                        <TableCell>{driver.email}</TableCell>
                        <TableCell>{driver.phone}</TableCell>
                        <TableCell>{driver.country}</TableCell>
                        <TableCell>{driver.stripe_customer_id || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge variant={Number(driver.verified) === 1 ? "default" : "outline"}>
                              {Number(driver.verified) === 1 ? 'Active' : 'Not Verified'}
                            </Badge>
                            {getStatusBadge(driver.status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => viewBalance(driver.account_balance)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Wallet Balance
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDeleteDialog(driver.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <PaginationControls
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delete Driver Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the driver
              account and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Balance View Dialog */}
      <AlertDialog open={isBalanceModalOpen} onOpenChange={setIsBalanceModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Wallet Balance</AlertDialogTitle>
            <div className="mt-4 text-center">
              <p className="text-3xl font-bold text-primary">
                ${new Intl.NumberFormat().format(currentBalance)}
              </p>
              <p className="text-sm text-gray-500 mt-1">USD</p>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setIsBalanceModalOpen(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default DriversPage;
