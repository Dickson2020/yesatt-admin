
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader, MessageSquare, Send, Image, User, Mail } from 'lucide-react';
import { useDashboard } from '@/contexts/DashboardContext';
import api from '@/services/api';
import { Ticket } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SupportPage: React.FC = () => {
  const { stats, refreshStats } = useDashboard();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [viewTicket, setViewTicket] = useState<Ticket | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    if (stats) {
      setTickets(stats.reports || []);
      setLoading(false);
    }
  }, [stats]);

  const handleViewTicket = (ticket: Ticket) => {
    setViewTicket(ticket);
    setIsViewDialogOpen(true);
  };

  const handleReplyClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsReplyDialogOpen(true);
  };

  const handleSubmitReply = async () => {
    if (!selectedTicket) return;

    try {
      const response = await api.replyTicket({
        name: selectedTicket.name,
        email: selectedTicket.email,
        message: replyMessage,
        id: selectedTicket.id
      });

      if (response && response.status) {
        toast({
          title: 'Success',
          description: 'Support ticket has been replied!',
        });
        setIsReplyDialogOpen(false);
        refreshStats();
        setReplyMessage('');
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to reply to ticket',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error replying to ticket:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while replying to the ticket',
        variant: 'destructive',
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <Button onClick={refreshStats}>
            Refresh
          </Button>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>All Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Support Tickets</h3>
                <p className="text-gray-500">
                  There are no customer support tickets at this time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map(ticket => (
                  <div key={ticket.id} className="flex border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mr-4">
                      <div className="h-10 w-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary">
                        <User className="h-5 w-5" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-medium">{ticket.name}</h3>
                          <p className="text-sm text-gray-500">{ticket.email}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleViewTicket(ticket)}
                          >
                            View
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleReplyClick(ticket)}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm text-gray-700 line-clamp-2">{ticket.message}</p>
                      </div>
                      
                      {ticket.photo && (
                        <div className="mt-2 flex items-center text-xs text-primary">
                          <Image className="h-3.5 w-3.5 mr-1" />
                          Attachment
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Ticket Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Issue Report</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {viewTicket && (
              <>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <p className="font-medium">{viewTicket.name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <p className="text-gray-600">{viewTicket.email}</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50">
                  <p className="whitespace-pre-wrap">{viewTicket.message}</p>
                </div>

                {viewTicket.photo && (
                  <div className="mt-4">
                    <Label className="block mb-2">Attachment:</Label>
                    <a 
                      href={viewTicket.photo} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-primary hover:underline"
                    >
                      <Image className="h-4 w-4 mr-1" />
                      View Attachment
                    </a>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                setIsViewDialogOpen(false);
                if (viewTicket) handleReplyClick(viewTicket);
              }}
            >
              Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reply to Ticket</DialogTitle>
            <DialogDescription>
              Send a reply to the customer's support request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name</Label>
              <Input 
                id="name" 
                value={selectedTicket?.name || ''} 
                disabled 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Customer Email</Label>
              <Input 
                id="email" 
                value={selectedTicket?.email || ''} 
                disabled 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your Reply</Label>
              <textarea
                id="message"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Type your reply here..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitReply} disabled={!replyMessage.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default SupportPage;
