
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, Check, X, FileText } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import api from '@/services/api';
import { KYCDocument } from '@/types';
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

interface FileImage {
  name: string;
  image: string;
}

const VerificationPage: React.FC = () => {
  const { stats, refreshStats } = useDashboard();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogImages, setDialogImages] = useState<FileImage[]>([]);
  const [selectedKyc, setSelectedKyc] = useState<KYCDocument | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  
  const { toast } = useToast();

  const handleViewDocuments = (kyc: KYCDocument) => {
    try {
      const files = JSON.parse(kyc.files);
      const validFiles = files.filter((file: any) => file?.image?.length > 4);
      
      setDialogImages(validFiles);
      setSelectedKyc(kyc);
      setCurrentImageIndex(0);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error parsing files:', error);
      toast({
        title: 'Error',
        description: 'Could not load document files',
        variant: 'destructive',
      });
    }
  };

  const handleApproveLicence = async () => {
    if (!selectedKyc) return;
    
    setIsApproving(true);
    
    try {
      const response = await api.approveLicence({
        id: selectedKyc.id,
        driver_id: selectedKyc.driver_id,
        email: selectedKyc.email
      });
      
      if (response && response.status) {
        toast({
          title: 'Success',
          description: 'Driver licence approved successfully',
        });
        setIsDialogOpen(false);
        refreshStats();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to approve licence',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error approving licence:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while approving the licence',
        variant: 'destructive',
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectLicence = async () => {
    if (!selectedKyc) return;
    
    setIsRejecting(true);
    
    try {
      const response = await api.rejectLicence({
        id: selectedKyc.id,
        driver_id: selectedKyc.driver_id,
        email: selectedKyc.email
      });
      
      if (response && response.status) {
        toast({
          title: 'Success',
          description: 'Driver licence rejected successfully',
        });
        setIsDialogOpen(false);
        refreshStats();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to reject licence',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error rejecting licence:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while rejecting the licence',
        variant: 'destructive',
      });
    } finally {
      setIsRejecting(false);
    }
  };

  const nextImage = () => {
    if (currentImageIndex < dialogImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Driver License Verification</h1>
          <Button onClick={refreshStats}>
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Verifications</CardTitle>
          </CardHeader>
          <CardContent>
            {!stats?.kyc || stats.kyc.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Pending Verifications</h3>
                <p className="text-gray-500">
                  There are no license verification requests waiting for approval.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.kyc.map((kyc: KYCDocument) => {
                  let fileCount = 0;
                  try {
                    const files = JSON.parse(kyc.files);
                    fileCount = files.filter((file: any) => file?.image?.length > 4).length;
                  } catch (e) {
                    console.error('Error parsing files:', e);
                  }
                  
                  return (
                    <Card key={kyc.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="p-4">
                          <div className="rounded-md bg-gray-100 p-4 text-center mb-4">
                            <FileText className="h-8 w-8 mx-auto text-gray-600 mb-2" />
                            <p className="text-sm font-medium">{fileCount} documents</p>
                          </div>
                          
                          <h3 className="font-medium mb-1">{kyc.name}</h3>
                          <p className="text-sm text-gray-600 mb-4">{kyc.email}</p>
                          
                          <div className="flex flex-col space-y-2">
                            <Button 
                              variant="outline"
                              onClick={() => handleViewDocuments(kyc)}
                              className="w-full"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Preview Documents
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>License Documents</AlertDialogTitle>
            <AlertDialogDescription>
              Review the driver's license documents before approval.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            {dialogImages.length > 0 && (
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-2">
                  <img 
                    src={dialogImages[currentImageIndex]?.image} 
                    alt={`Document ${currentImageIndex + 1}`} 
                    className="mx-auto max-h-[400px] object-contain rounded"
                  />
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Document {currentImageIndex + 1} of {dialogImages.length}
                  </p>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                    >
                      Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={nextImage}
                      disabled={currentImageIndex === dialogImages.length - 1}
                    >
                      Next
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <a 
                    href={dialogImages[currentImageIndex]?.image}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary hover:underline"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download this document
                  </a>
                  
                  {selectedKyc && (
                    <div>
                      <p className="font-medium">{selectedKyc.name}</p>
                      <p className="text-sm text-gray-600">{selectedKyc.email}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel>
              Close
            </AlertDialogCancel>
            <Button 
              variant="outline"
              className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
              onClick={handleRejectLicence}
              disabled={isRejecting}
            >
              <X className="h-4 w-4 mr-2" />
              {isRejecting ? 'Rejecting...' : 'Reject License'}
            </Button>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApproveLicence}
              disabled={isApproving}
            >
              <Check className="h-4 w-4 mr-2" />
              {isApproving ? 'Approving...' : 'Approve License'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default VerificationPage;
