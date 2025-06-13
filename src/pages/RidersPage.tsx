
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
import { User, PaginationData } from '@/types';
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

const RidersPage: React.FC = () => {
  const [riders, setRiders] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentRiderId, setCurrentRiderId] = useState<number | null>(null);
  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState<boolean>(false);
  const [currentBalance, setCurrentBalance] = useState<number>(0);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchRiders(1);
  }, []);

  const fetchRiders = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.getRiders(page);

      console.log(response)
      
      if (response) {

        setRiders(response.users || []);
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
    fetchRiders(page);
  };

  const handleDelete = async () => {
    if (!currentRiderId) return;
    
    try {
      const response = await api.deleteAccount(currentRiderId);
      
      if (response && response.status) {
        toast({
          title: "Success",
          description: "Rider deleted successfully",
        });
        fetchRiders(pagination.currentPage);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to delete rider",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting rider:', error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the rider",
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

  const filteredRiders = Array.isArray(riders) ? riders.filter(rider => 
    rider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rider.phone.includes(searchTerm)
  ) : [];


  const exportRiders = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Country", "Stripe ID", "Status"],
      ...riders.map(rider => [
        rider.name,
        rider.email,
        rider.phone,
        rider.country,
        rider.stripe_customer_id || "N/A",
        Number(rider.verified) === 1 ? "Active" : "Not Verified"
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "riders.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Riders Management</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500" />
              <Input
                placeholder="Search riders..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={exportRiders}>Export</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Riders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : riders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
                <h3 className="text-lg font-medium">No riders found</h3>
                <p className="text-gray-500">There are no riders registered in the system.</p>
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
                    {filteredRiders.map((rider) => (
                      <TableRow key={rider.id}>
                        <TableCell className="font-medium">{rider.name}</TableCell>
                        <TableCell>{rider.email}</TableCell>
                        <TableCell>{rider.phone}</TableCell>
                        <TableCell>{rider.country}</TableCell>
                        <TableCell>{rider.stripe_customer_id || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={Number(rider.verified) === 1 ? "default" : "outline"}>
                            {Number(rider.verified) === 1 ? 'Active' : 'Not Verified'}
                          </Badge>
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
                              <DropdownMenuItem onClick={() => viewBalance(rider.account_balance)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Wallet Balance
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openDeleteDialog(rider.id)}>
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

      {/* Delete Rider Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the rider
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

export default RidersPage;
