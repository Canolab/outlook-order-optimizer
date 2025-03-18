
import React, { useState } from 'react';
import { AIGeneratedResponse } from '@/types/email';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { X, Check } from 'lucide-react';

interface AIResponseProps {
  aiResponse: AIGeneratedResponse | null;
}

export const AIResponseDisplay: React.FC<AIResponseProps> = ({ aiResponse }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');

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
          </div>
        ) : (
          <div className="flex space-x-2">
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
