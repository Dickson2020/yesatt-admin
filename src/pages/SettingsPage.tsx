
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useDashboard } from '@/contexts/DashboardContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  UserPlus, 
  Eye, 
  EyeOff, 
  Save, 
  Key, 
  Lock, 
  Send,
  AlertTriangle,
  Megaphone
} from 'lucide-react';
import api from '@/services/api';

const SettingsPage: React.FC = () => {
  const { stats, refreshStats } = useDashboard();
  const { toast } = useToast();
  
  // API Keys
  const [apiKeys, setApiKeys] = useState({
    stripeSecretKey: '',
    stripePublishableApiKey: ''
  });
  
  // New Staff Form
  const [newStaffData, setNewStaffData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'admin',
    country: '',
    phone: ''
  });
  
  // Profile Form
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Password Reset
  const [passwordResetData, setPasswordResetData] = useState({
    otp: '',
    password: ''
  });
  
  // Broadcast Message
  const [broadcastMessage, setBroadcastMessage] = useState('');
  
  // UI States
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showPublishableKey, setShowPublishableKey] = useState(false);
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);
  const [isSubmittingStaff, setIsSubmittingStaff] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [isSubmittingBroadcast, setIsSubmittingBroadcast] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  
  useEffect(() => {
    if (stats) {
      // Initialize API keys
      setApiKeys({
        stripeSecretKey: stats.stripeSecretKey || '',
        stripePublishableApiKey: stats.stripePublishableApiKey || ''
      });
      
      // Initialize profile data
      if (stats.account) {
        setProfileData({
          name: stats.account.name || '',
          email: stats.account.email || '',
          phone: stats.account.phone || ''
        });
      }
    }
  }, [stats]);
  
  // Handle API keys update
  const handleUpdateApiKeys = async () => {
    setIsSubmittingApi(true);
    
    try {
      const response = await api.updateApi(apiKeys);
      
      if (response && response.status) {
        toast({
          title: 'Success',
          description: 'API keys updated successfully',
        });
        refreshStats();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to update API keys',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating API keys:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating API keys',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingApi(false);
    }
  };
  
  // Handle add new staff
  const handleAddStaff = async () => {
    setIsSubmittingStaff(true);
    
    try {
      const response = await api.addNewStaff({
        firstName: newStaffData.firstName,
        lastName: newStaffData.lastName,
        email: newStaffData.email,
        password: newStaffData.password,
        role: newStaffData.role,
        country: newStaffData.country,
        phone: newStaffData.phone
      });
      
      if (response && response.status) {
        toast({
          title: 'Success',
          description: 'New staff member added successfully',
        });
        refreshStats();
        
        // Reset form
        setNewStaffData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          role: 'admin',
          country: '',
          phone: ''
        });
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to add staff member',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while adding staff member',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingStaff(false);
    }
  };
  
  // Handle profile update
  const handleUpdateProfile = async () => {
    setIsSubmittingProfile(true);
    
    try {
      const response = await api.updateBio(profileData);
      
      if (response && response.status) {
        toast({
          title: 'Success',
          description: 'Profile updated successfully',
        });
        refreshStats();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to update profile',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while updating profile',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingProfile(false);
    }
  };
  
  // Handle send OTP
  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    
    try {
      if (!profileData.email) {
        toast({
          title: 'Error',
          description: 'Email is required to send OTP',
          variant: 'destructive',
        });
        return;
      }
      
      const response = await api.sendOtp(profileData.email);
      
      if (response && response.status) {
        toast({
          title: 'Success',
          description: 'OTP sent successfully to your email',
        });
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to send OTP',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while sending OTP',
        variant: 'destructive',
      });
    } finally {
      setIsSendingOtp(false);
    }
  };
  
  // Handle reset password
  const handleResetPassword = async () => {
    setIsSubmittingPassword(true);
    
    try {
      if (!passwordResetData.otp || !passwordResetData.password) {
        toast({
          title: 'Error',
          description: 'OTP and new password are required',
          variant: 'destructive',
        });
        return;
      }
      
      const response = await api.resetPassword({
        email: profileData.email,
        otp: passwordResetData.otp,
        password: passwordResetData.password
      });
      
      if (response && response.status) {
        toast({
          title: 'Success',
          description: 'Password reset successfully',
        });
        
        // Reset form
        setPasswordResetData({
          otp: '',
          password: ''
        });
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to reset password',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while resetting password',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingPassword(false);
    }
  };
  
  // Handle broadcast message
  const handleBroadcastMessage = async () => {
    setIsSubmittingBroadcast(true);
    
    try {
      if (!broadcastMessage.trim()) {
        toast({
          title: 'Error',
          description: 'Broadcast message cannot be empty',
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Broadcasting',
        description: 'Sending broadcast message, this may take up to 2 minutes depending on user base size',
      });
      
      const response = await api.broadcastMessage(broadcastMessage);
      
      if (response && response.status) {
        toast({
          title: 'Success',
          description: 'Broadcast message sent successfully',
        });
        
        // Reset form
        setBroadcastMessage('');
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to send broadcast message',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while sending broadcast message',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingBroadcast(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <Tabs defaultValue="profile">
          <TabsList className="w-full border-b">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="staff">Staff Management</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
            <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your admin profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="bio-name">Full Name</Label>
                  <Input
                    id="bio-name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio-email">Email</Label>
                  <Input
                    id="bio-email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio-phone">Phone</Label>
                  <Input
                    id="bio-phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdateProfile} disabled={isSubmittingProfile}>
                  {isSubmittingProfile ? 'Updating...' : 'Update Profile'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Reset your admin password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                  <p className="text-sm text-gray-500">
                    You'll need to verify your email with a one-time password (OTP).
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={handleSendOtp}
                  disabled={isSendingOtp}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSendingOtp ? 'Sending OTP...' : 'Send OTP to Email'}
                </Button>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="reset-p-otp">OTP Code</Label>
                  <Input
                    id="reset-p-otp"
                    value={passwordResetData.otp}
                    onChange={(e) => setPasswordResetData({...passwordResetData, otp: e.target.value})}
                    placeholder="Enter OTP code"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reset-p-password">New Password</Label>
                  <Input
                    id="reset-p-password"
                    type="password"
                    value={passwordResetData.password}
                    onChange={(e) => setPasswordResetData({...passwordResetData, password: e.target.value})}
                    placeholder="Enter new password"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleResetPassword} disabled={isSubmittingPassword}>
                  {isSubmittingPassword ? 'Resetting...' : 'Reset Password'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Staff Management Tab */}
          <TabsContent value="staff" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Staff</CardTitle>
                <CardDescription>
                  Create new admin user accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="add-staff-first-name">First Name</Label>
                    <Input
                      id="add-staff-first-name"
                      value={newStaffData.firstName}
                      onChange={(e) => setNewStaffData({...newStaffData, firstName: e.target.value})}
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-staff-last-name">Last Name</Label>
                    <Input
                      id="add-staff-last-name"
                      value={newStaffData.lastName}
                      onChange={(e) => setNewStaffData({...newStaffData, lastName: e.target.value})}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="add-staff-email">Email</Label>
                  <Input
                    id="add-staff-email"
                    type="email"
                    value={newStaffData.email}
                    onChange={(e) => setNewStaffData({...newStaffData, email: e.target.value})}
                    placeholder="john.doe@example.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="add-staff-password">Password</Label>
                  <Input
                    id="add-staff-password"
                    type="password"
                    value={newStaffData.password}
                    onChange={(e) => setNewStaffData({...newStaffData, password: e.target.value})}
                    placeholder="Enter a secure password"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="add-staff-role">Role</Label>
                  <select 
                    id="add-staff-role"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={newStaffData.role}
                    onChange={(e) => setNewStaffData({...newStaffData, role: e.target.value})}
                  >
                    <option value="admin">Admin</option>
                    <option value="support">Support</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="add-staff-country">Country</Label>
                  <Input
                    id="add-staff-country"
                    value={newStaffData.country}
                    onChange={(e) => setNewStaffData({...newStaffData, country: e.target.value})}
                    placeholder="United States"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="add-staff-phone">Phone</Label>
                  <Input
                    id="add-staff-phone"
                    value={newStaffData.phone}
                    onChange={(e) => setNewStaffData({...newStaffData, phone: e.target.value})}
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddStaff} disabled={isSubmittingStaff}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  {isSubmittingStaff ? 'Adding...' : 'Add Staff Member'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Current Staff</CardTitle>
                <CardDescription>
                  Manage existing admin users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Role</th>
                        <th className="p-2 text-left">Phone</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.admins?.map((admin) => (
                        <tr key={admin.id} className="border-b">
                          <td className="p-2">{admin.name}</td>
                          <td className="p-2">{admin.email}</td>
                          <td className="p-2 capitalize">{admin.role}</td>
                          <td className="p-2">{admin.phone}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* API Keys Tab */}
          <TabsContent value="api" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your integration with payment systems
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="api-secretStripeKey">Stripe Secret Key</Label>
                    <button 
                      onClick={() => setShowSecretKey(!showSecretKey)}
                      type="button"
                      className="text-xs text-primary flex items-center"
                    >
                      {showSecretKey ? (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Show
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="api-secretStripeKey"
                      type={showSecretKey ? "text" : "password"}
                      value={apiKeys.stripeSecretKey}
                      onChange={(e) => setApiKeys({...apiKeys, stripeSecretKey: e.target.value})}
                      className="pr-10"
                    />
                    <Key className="h-4 w-4 absolute right-3 top-2.5 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="api-stripePublishableApiKey">Stripe Publishable Key</Label>
                    <button 
                      onClick={() => setShowPublishableKey(!showPublishableKey)}
                      type="button"
                      className="text-xs text-primary flex items-center"
                    >
                      {showPublishableKey ? (
                        <>
                          <EyeOff className="h-3 w-3 mr-1" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-3 w-3 mr-1" />
                          Show
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="api-stripePublishableApiKey"
                      type={showPublishableKey ? "text" : "password"}
                      value={apiKeys.stripePublishableApiKey}
                      onChange={(e) => setApiKeys({...apiKeys, stripePublishableApiKey: e.target.value})}
                      className="pr-10"
                    />
                    <Key className="h-4 w-4 absolute right-3 top-2.5 text-gray-400" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleUpdateApiKeys} disabled={isSubmittingApi}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmittingApi ? 'Updating...' : 'Update API Keys'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Broadcast Tab */}
          <TabsContent value="broadcast" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>Broadcast Message</CardTitle>
                <CardDescription>
                  Send a message to all users in the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center pb-4">
                  <Megaphone className="h-5 w-5 text-amber-500 mr-2" />
                  <p className="text-sm text-gray-500">
                    This message will be sent to all users. Use this feature responsibly.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="broadcast-message">Message Content</Label>
                  <textarea 
                    id="broadcast-message"
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    placeholder="Enter your broadcast message here..."
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleBroadcastMessage} 
                  disabled={isSubmittingBroadcast || !broadcastMessage.trim()}
                >
                  <Megaphone className="h-4 w-4 mr-2" />
                  {isSubmittingBroadcast ? 'Broadcasting...' : 'Send Broadcast'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
