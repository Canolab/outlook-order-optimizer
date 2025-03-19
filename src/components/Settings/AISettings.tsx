
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { manageApiKey } from '@/utils/aiUtils';
import { Loader2, Check, X } from 'lucide-react';

export const AISettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);
  const { toast } = useToast();
  
  // Load existing API key on component mount
  useEffect(() => {
    const savedKey = manageApiKey.getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeyValid(true); // Assume saved key is valid
    }
  }, []);
  
  const handleSaveApiKey = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter an OpenAI API key.",
        variant: "destructive",
      });
      return;
    }
    
    setIsValidating(true);
    
    try {
      // Validate the API key
      const isValid = await manageApiKey.validateApiKey(apiKey);
      
      if (isValid) {
        setIsSaving(true);
        manageApiKey.saveApiKey(apiKey);
        
        setIsKeyValid(true);
        toast({
          title: "API Key Saved",
          description: "Your OpenAI API key has been saved successfully.",
        });
      } else {
        setIsKeyValid(false);
        toast({
          title: "Invalid API Key",
          description: "The API key you entered is invalid. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error validating API key:", error);
      setIsKeyValid(false);
      toast({
        title: "Validation Error",
        description: "An error occurred while validating your API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
      setIsSaving(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Settings</CardTitle>
        <CardDescription>
          Configure your AI integration for email categorization and response generation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="api-key" className="text-sm font-medium">
              OpenAI API Key
            </label>
            <div className="flex space-x-2">
              <Input
                id="api-key"
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleSaveApiKey} 
                disabled={isValidating || isSaving}
              >
                {isValidating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validating
                  </>
                ) : isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving
                  </>
                ) : (
                  "Save Key"
                )}
              </Button>
            </div>
            
            {isKeyValid !== null && (
              <div className={`mt-2 flex items-center text-sm ${isKeyValid ? 'text-green-500' : 'text-red-500'}`}>
                {isKeyValid ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    API key is valid
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    API key is invalid
                  </>
                )}
              </div>
            )}
            
            <p className="text-xs text-muted-foreground mt-1">
              Your API key is stored locally in your browser and is only used to make requests to OpenAI's API.
            </p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">AI Features</h3>
            <ul className="text-sm space-y-1">
              <li>• Email categorization (Order, Inquiry, Support)</li>
              <li>• Response generation based on email content</li>
              <li>• Price difference analysis for order emails</li>
              <li>• Sales recommendations</li>
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/50 text-xs text-muted-foreground">
        The application uses OpenAI's API to analyze emails and generate appropriate responses. 
        A valid API key is required for these features to work.
      </CardFooter>
    </Card>
  );
};
