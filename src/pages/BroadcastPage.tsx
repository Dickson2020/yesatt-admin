
import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Megaphone, InfoIcon } from 'lucide-react';
import api from '@/services/api';

const BroadcastPage: React.FC = () => {
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSendBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      toast({
        title: "Error",
        description: "Broadcast message cannot be empty",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    toast({
      title: "Broadcasting",
      description: "Sending broadcast message, this may take up to 2 minutes depending on user base size",
    });
    
    try {
      const response = await api.broadcastMessage(broadcastMessage);
      
      if (response && response.status) {
        toast({
          title: "Success",
          description: "Broadcast message sent successfully",
        });
        
        // Reset form
        setBroadcastMessage('');
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to send broadcast message",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error sending broadcast:', error);
      toast({
        title: "Error",
        description: "An error occurred while sending broadcast message",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Broadcast Email</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Send Broadcast Message</CardTitle>
            <CardDescription>
              Send an email message to all users in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-100 rounded-md">
              <InfoIcon className="h-5 w-5 text-amber-500" />
              <p className="text-sm text-amber-800">
                This message will be sent to all registered users. Use this feature responsibly as it may impact user experience.
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="broadcast-message" className="text-sm font-medium">
                Message Content
              </label>
              <Textarea 
                id="broadcast-message"
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="min-h-[200px]"
                placeholder="Enter your broadcast message here..."
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSendBroadcast} 
              disabled={isSubmitting || !broadcastMessage.trim()}
            >
              <Megaphone className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Broadcasting...' : 'Send Broadcast'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BroadcastPage;
