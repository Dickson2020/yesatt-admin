import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import api from '@/services/api';

const KYCVerification = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [kycList, setKYCList] = useState<any[]>([]);

  useEffect(() => {
    fetchKYCRequests();
  }, []);

  const fetchKYCRequests = async () => {
    try {
      setLoading(true);
      const response = await api.getKYCRequests();
    if(response?.status){
        setKYCList(response?.data || []);
    }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load KYC requests.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number, driverId: number, email: string) => {
    try {
      await api.approveLicence(id, driverId, email);
      toast({ title: 'Approved', description: 'KYC approved successfully.' });
      fetchKYCRequests();
    } catch {
      toast({ title: 'Error', description: 'Failed to approve KYC.', variant: 'destructive' });
    }
  };

  const handleReject = async (id: number, driverId: number, email: string) => {
    try {
      await api.rejectLicence(id, driverId, email);
      toast({ title: 'Rejected', description: 'KYC rejected successfully.' });
      fetchKYCRequests();
    } catch {
      toast({ title: 'Error', description: 'Failed to reject KYC.', variant: 'destructive' });
    }
  };

  const renderDocumentLinks = (filesJson: string) => {
    try {
      const files = JSON.parse(filesJson);
      const validFiles = files.filter((f: any) => f?.image?.length > 4);
      return (
        <div className="flex flex-col gap-2">
          {validFiles?.map((file: any, idx: number) => (
            <a
              key={idx}
              href={file.image}
              download
              className="text-blue-600 underline text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download Doc #{idx + 1}
            </a>
          ))}
        </div>
      );
    } catch (e) {
      return <span className="text-red-500 text-xs">Invalid file data</span>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">KYC Verification</h1>
        <Card>
          <CardHeader>
            <CardTitle>Verification Requests</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 4 })?.map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : kycList.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No verification requests!</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Documents</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kycList?.map((kyc) => (
                      <TableRow key={kyc.id}>
                        <TableCell>{kyc.name}</TableCell>
                        <TableCell>{kyc.email}</TableCell>
                        <TableCell>{renderDocumentLinks(kyc.files)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{kyc.status || 'Pending'}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(kyc.id, kyc.driver_id, kyc.email)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(kyc.id, kyc.driver_id, kyc.email)}
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default KYCVerification;
