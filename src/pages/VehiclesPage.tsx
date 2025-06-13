
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader, Trash2, Edit, Car, AlertTriangle } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import api from '@/services/api';
import { Vehicle } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const VehiclesPage: React.FC = () => {
  const { stats, loading: statsLoading, refreshStats } = useDashboard();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState(null);

  const { toast } = useToast();

  useEffect(() => {
    if (stats && stats.vehicles) {
      setVehicles(stats.vehicles);
      setLoading(false);
    }
  }, [stats]);

  const refreshVehicles = async () => {
    await refreshStats();
  };


  const [loadingVehicle, setLoadingVehicle] = useState(false);
  const handleEditVehicle = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    const fetchVehicleInfo = async (vin: string) => {
      setLoadingVehicle(true)
      try {
        const response = await api.getVehicleInfo(vin);
        if (response?.status) {
          setFormData(response?.data);
        } else {
          toast({
            title: 'Error',
            description: 'Failed to fetch vehicle information',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Error fetching vehicle info:', error);
        toast({
          title: 'Error',
          description: 'An error occurred while fetching vehicle information',
          variant: 'destructive',
        });
      } finally {
        setLoadingVehicle(false)
      }
    };

    fetchVehicleInfo(vehicle.car_number);
    setIsEditing(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateVehicle = async () => {
    try {
      const response = await api.updateVehicle({
        car_vin: formData.car_number,
        car_name: formData.car_name,
        car_color: formData.car_color,
        seats: formData.seats,
        car_id: formData.car_id
      });

      if (response && response.status) {
        toast({
          title: 'Success',
          description: 'Vehicle updated successfully',
        });
        setIsEditing(false);
        refreshVehicles();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to update vehicle',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating the vehicle',
        variant: 'destructive',
      });
    }
  };

  const confirmDeleteVehicle = async () => {
    if (!currentVehicle) return;

    try {
      const response = await api.deleteVehicle(currentVehicle.id);

      if (response && response.status) {
        toast({
          title: 'Success',
          description: 'Vehicle deleted successfully',
        });
        setIsDeleteDialogOpen(false);
        refreshVehicles();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to delete vehicle',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while deleting the vehicle',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vehicle Management</h1>
          <Button onClick={refreshVehicles}>
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading || statsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : vehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
              <h3 className="text-lg font-medium">No vehicles found</h3>
              <p className="text-gray-500 mb-4">There are no registered vehicles in the system.</p>
              <Button>Add New Vehicle</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {vehicles.map(vehicle => (
                <Card key={vehicle.id} className="overflow-hidden">
                  <CardHeader className="bg-secondary pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{vehicle.car_name}</CardTitle>
                      <Badge>{vehicle.car_model}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary mr-3">
                          <Car className="h-6 w-6" color='#fff'/>
                        </div>
                        <div>
                          <p className="font-medium">{vehicle.car_color} {vehicle.car_name}</p>
                          <p className="text-sm text-gray-500">VIN: {vehicle.car_number}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{vehicle.seats} Seats</p>
                        <p className="text-xs text-gray-500">
                          {vehicle.driver ? `Driver: ${vehicle.driver.name}` : 'No Driver Assigned'}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditVehicle(vehicle)}
                      >
                        <Edit className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50 focus:ring-red-500"
                        onClick={() => handleDeleteVehicle(vehicle)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          </div>
        </div>
      {/* Edit Vehicle Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
        <DialogTitle>More Vehicle Informations</DialogTitle>
        <div className="grid gap-4 py-4 max-h-[400px] overflow-y-auto">
          <h4 className="font-medium mb-2">Vehicle Information</h4>
          {loadingVehicle ? (
            <div className="flex items-center justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : formData ? (
            <div className="grid grid-cols-1 gap-4" style={{ textAlign: 'left' }}>
          {Object.entries(formData[0]).map(([key, value]) => (
            <div key={key} className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-gray-500">{key.replace(/_/g, ' ')}</p>
              <p>{value}</p>
            </div>
          ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {currentVehicle?.driver && (
            <div className="mt-4 border-t pt-4">
          <h4 className="font-medium mb-2">Driver Information</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="text-gray-500">Name:</p>
            <p>{currentVehicle.driver.name}</p>
            <p className="text-gray-500">Email:</p>
            <p>{currentVehicle.driver.email}</p>
            <p className="text-gray-500">Phone:</p>
            <p>{currentVehicle.driver.phone}</p>
            <p className="text-gray-500">Country:</p>
            <p>{currentVehicle.driver.country}</p>
            <p className="text-gray-500">Status:</p>
            <p>{Number(currentVehicle.driver.status) === 0 ? 'Offline' : 'Online'}</p>
          </div>
            </div>
          )}
        </div>
          </DialogHeader>
          <DialogFooter>
        <Button variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Vehicle Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the vehicle
              {currentVehicle && (
                <span className="font-medium"> "{currentVehicle.car_name}"</span>
              )} from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteVehicle}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default VehiclesPage;
