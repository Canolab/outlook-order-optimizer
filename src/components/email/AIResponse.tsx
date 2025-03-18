
import React from 'react';
import { AIGeneratedResponse } from '@/types/email';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AIResponseProps {
  aiResponse: AIGeneratedResponse | null;
}

export const AIResponseDisplay: React.FC<AIResponseProps> = ({ aiResponse }) => {
  const { toast } = useToast();

  if (!aiResponse) return null;
  
  const handleCopyResponse = () => {
    navigator.clipboard.writeText(aiResponse.body);
    toast({
      title: "Copied to clipboard",
      description: "The response has been copied to your clipboard",
    });
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">AI Generated Response</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
      </CardContent>
      <CardFooter>
        <div className="flex space-x-2">
          <Button onClick={handleCopyResponse}>
            Copy Response
          </Button>
          <Button variant="outline">
            Edit Response
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
