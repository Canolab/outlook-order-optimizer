
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { manageApiKey } from '@/utils/aiUtils';
import { Loader2, Check, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const AISettings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-mini');
  const [aiEnabled, setAiEnabled] = useState(true);
  const { toast } = useToast();
  
  // Load existing API key and settings on component mount
  useEffect(() => {
    const savedKey = manageApiKey.getApiKey();
    if (savedKey) {
      setApiKey(savedKey);
      setIsKeyValid(true); // Assume saved key is valid
    }
    
    // Load other settings if they exist
    const savedModel = localStorage.getItem('openai_model');
    if (savedModel) {
      setSelectedModel(savedModel);
    }
    
    const aiEnabledSetting = localStorage.getItem('ai_enabled');
    if (aiEnabledSetting !== null) {
      setAiEnabled(aiEnabledSetting === 'true');
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
        
        // Save other settings
        localStorage.setItem('openai_model', selectedModel);
        localStorage.setItem('ai_enabled', aiEnabled.toString());
        
        setIsKeyValid(true);
        toast({
          title: "Settings Saved",
          description: "Your OpenAI API key and settings have been saved successfully.",
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

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };

  const handleAiEnabledChange = (checked: boolean) => {
    setAiEnabled(checked);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>OpenAI Integration</CardTitle>
        <CardDescription>
          Configure your OpenAI API integration for email categorization and response generation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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
                  "Save Settings"
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
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Model Selection</h3>
            <div className="space-y-2">
              <Label htmlFor="model-selection">OpenAI Model</Label>
              <Select value={selectedModel} onValueChange={handleModelChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o-mini">GPT-4o-mini (Fast & Efficient)</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o (Most Powerful)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                GPT-4o-mini is faster and more cost-effective, while GPT-4o offers enhanced capabilities for complex tasks.
              </p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-sm font-medium">AI Features</h3>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ai-enabled">Enable AI Processing</Label>
                <p className="text-xs text-muted-foreground">Turn AI-powered features on or off</p>
              </div>
              <Switch 
                id="ai-enabled"
                checked={aiEnabled}
                onCheckedChange={handleAiEnabledChange}
              />
            </div>
            
            <div className="border rounded-md p-4 mt-2 bg-secondary/30">
              <h4 className="text-sm font-medium mb-2">Available AI Capabilities</h4>
              <ul className="text-sm space-y-1.5">
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Email categorization (Order, Inquiry, Support, Other)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Smart response generation based on email content and context</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Price difference analysis for order emails</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Sales recommendations tailored to customer history</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary/50 text-xs text-muted-foreground flex flex-col items-start p-4">
        <p className="mb-1">This application uses OpenAI's models to analyze emails and generate responses.</p>
        <p>Requests are processed directly from your browser to OpenAI using your API key.</p>
        <p className="mt-1">Average usage: ~2,000 tokens per email analysis (~$0.01-0.06 per email depending on model).</p>
      </CardFooter>
    </Card>
  );
};
