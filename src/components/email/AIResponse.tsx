
import React, { useState } from 'react';
import { AIGeneratedResponse } from '@/types/email';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { X, Check, Send } from 'lucide-react';
import { sendEmail } from '@/utils/msGraph';

interface AIResponseProps {
  aiResponse: AIGeneratedResponse | null;
}

export const AIResponseDisplay: React.FC<AIResponseProps> = ({ aiResponse }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!aiResponse) return null;
  
  const handleCopyResponse = () => {
    navigator.clipboard.writeText(aiResponse.body);
    toast({
      title: "Copied to clipboard",
      description: "The response has been copied to your clipboard",
    });
  };

  const handleStartEditing = () => {
    setEditedSubject(aiResponse.subject);
    setEditedBody(aiResponse.body);
    setIsEditing(true);
  };

  const handleSaveEdits = () => {
    // In a real application, you would update the actual aiResponse here
    toast({
      title: "Response updated",
      description: "Your edited response has been saved",
    });
    setIsEditing(false);
  };

  const handleCancelEdits = () => {
    setIsEditing(false);
    toast({
      description: "Edit cancelled",
    });
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    
    try {
      // Get the current subject and body (either edited or original)
      const subject = isEditing ? editedSubject : aiResponse.subject;
      const body = isEditing ? editedBody : aiResponse.body;
      
      // Send email using our msGraph utility
      const success = await sendEmail(
        "customer@example.com", // In a real app, this would be the customer's email
        subject,
        body
      );
      
      if (success) {
        toast({
          title: "Email sent",
          description: "Your response has been sent successfully",
        });
        
        // If we were editing, exit edit mode
        if (isEditing) {
          setIsEditing(false);
        }
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Failed to send email",
        description: "There was an error sending your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">AI Generated Response</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <div>
              <p className="font-medium text-sm mb-2">Subject</p>
              <Input 
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <p className="font-medium text-sm mb-2">Message</p>
              <Textarea 
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                className="min-h-[200px] w-full"
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="font-medium text-sm">Subject</p>
              <p>{aiResponse.subject}</p>
            </div>
            <div>
              <p className="font-medium text-sm">Message</p>
              <div className="bg-secondary p-3 rounded-md whitespace-pre-line text-sm">
                {aiResponse.body}
              </div>
            </div>
            {aiResponse.recommendation && (
              <div>
                <p className="font-medium text-sm">Sales Recommendation</p>
                <div className="bg-brand-50 border-l-4 border-brand-500 p-3 rounded-md text-sm">
                  {aiResponse.recommendation}
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        {isEditing ? (
          <div className="flex space-x-2">
            <Button onClick={handleSaveEdits} variant="default">
              <Check className="mr-1 h-4 w-4" />
              Save
            </Button>
            <Button onClick={handleCancelEdits} variant="outline">
              <X className="mr-1 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={isSending} className="bg-green-600 hover:bg-green-700 ml-auto">
              <Send className="mr-2 h-4 w-4" />
              {isSending ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Button onClick={handleSendEmail} disabled={isSending} className="bg-green-600 hover:bg-green-700">
              <Send className="mr-2 h-4 w-4" />
              {isSending ? 'Sending...' : 'Send Email'}
            </Button>
            <Button onClick={handleCopyResponse}>
              Copy Response
            </Button>
            <Button variant="outline" onClick={handleStartEditing}>
              Edit Response
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
