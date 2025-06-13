
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Search, 
  Loader, 
  Calendar, 
  CreditCard, 
  DollarSign,
  AlertTriangle 
} from 'lucide-react';
import { Transaction, PaginationData } from '@/types';
import api from '@/services/api';
import PaginationControls from '@/components/tables/PaginationControls';

const formatCurrency = (value: string): string => {
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return value;

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numValue);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString();
};

const TransactionsPage: React.FC = () => {

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions(1);
  }, []);

  const fetchTransactions = async (page: number) => {
    try {
      setLoading(true);
      const response = await api.getTransactions(page);

      console.log(response)
      
      if (response) {
        setTransactions(response?.transactions || []);
        if (response.pagination) {
          setPagination({
            currentPage: page,
            totalPages: response.pagination.totalPages || 1,
            totalItems: response.pagination.totalItems || 0
          });
        }
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchTransactions(page);
  };

  const getTransactionTypeIcon = (type: string) => {
    if (type.toLowerCase().includes('credit') || type.toLowerCase().includes('deposit')) {
      return <DollarSign className="h-4 w-4 text-green-500" />;
    } else if (type.toLowerCase().includes('debit') || type.toLowerCase().includes('refund')) {
      return <CreditCard className="h-4 w-4 text-red-500" />;
    } else {
      return <CreditCard className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => 
    transaction.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.transaction_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate summary amounts
  const totalInflow = filteredTransactions .filter(t => t.transaction_type.toLowerCase().includes('credit') || t.transaction_type.toLowerCase().includes('deposit'))
    .reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);


    
  // Calculate summary amounts
  const totalOutflow = filteredTransactions .filter(t => t.transaction_type.toLowerCase().includes('debit') || t.transaction_type.toLowerCase().includes('refund'))
  .reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);

  const totalCharges = filteredTransactions
    .reduce((sum, t) => sum + parseFloat(t.charges || '0'), 0);



    const exportTransactions = () => {
      const csvContent = [
        ["Transaction ID", "Type", "Intent", "Intent Type", "Description", "Amount", "Date", "Charges"],
        ...transactions.map(t => [
          t.transaction_id,
          t.transaction_type,
          t.intent,
          t.intent_type,
          t.description,
          t.amount,
          formatDate(t.transaction_date),
          t.charges
        ])
      ].map(e => e.join(",")).join("\n");
  
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "transactions.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Transaction History</h1>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500" />
              <Input
                placeholder="Transaction ID"
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline"  onClick={exportTransactions}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Inflow</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(totalInflow.toString())}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Outflow</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOutflow.toString())}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
                <h3 className="text-lg font-medium">No transactions found</h3>
                <p className="text-gray-500">There are no transactions matching your search.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Intent</TableHead>
                      <TableHead>Intent Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Charges</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.transaction_id}>
                        <TableCell>
                          <div className="flex items-center">
                            {getTransactionTypeIcon(transaction.transaction_type)}
                            <span className="ml-2">{transaction.transaction_type}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {transaction.transaction_id}
                        </TableCell>
                        <TableCell>{transaction.intent}</TableCell>
                        <TableCell>{transaction.intent_type}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {transaction.description}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
                            <span>{formatDate(transaction.transaction_date)}</span>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(transaction.charges)}</TableCell>
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
    </DashboardLayout>
  );
};

export default TransactionsPage;
