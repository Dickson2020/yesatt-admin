
import React, { useRef, useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Megaphone, InfoIcon } from 'lucide-react';
import api from '@/services/api';
import { Editor } from '@tinymce/tinymce-react';

const BroadcastPage: React.FC = () => {
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoaading] = useState(true);
  const { toast } = useToast();
  const editorRef = useRef(null);
 
  
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

      if (editorRef.current) {
        console.log(editorRef.current.getContent());
      }
      
      const response = await api.broadcastMessage(editorRef.current ? editorRef.current.getContent() : broadcastMessage);
      
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
                Message Content {loading && '(Loading editor...)'}

              </label>
              <Editor
              apiKey='g9iv4jdj1r2ogyuni0bk8x9c0vh7vnp9ip2jd5u62nzbh67y'
                onInit={(evt, editor) =>{
                  editorRef.current = editor
                  setLoaading(false)
                }}
                init={{
                  height: 500,
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                  ],
                  toolbar: 'undo redo | formatselect | ' +
                  'bold italic backcolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
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
