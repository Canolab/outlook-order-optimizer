
import React from 'react';
import { CheckCircle2, RefreshCw, FileWarning } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProcessingStep = 'idle' | 'extracting' | 'comparing' | 'generating' | 'complete';

interface ProcessingStatusProps {
  processingStep: ProcessingStep;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ processingStep }) => {
  if (processingStep === 'idle') return null;
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Processing Status</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center">
            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-sm">Document received</span>
          </div>
          
          <div className="flex items-center">
            {processingStep === 'extracting' ? (
              <RefreshCw className="h-4 w-4 mr-2 text-brand-500 animate-spin" />
            ) : processingStep === 'comparing' || processingStep === 'generating' || processingStep === 'complete' ? (
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <FileWarning className="h-4 w-4 mr-2 text-muted-foreground" />
            )}
            <span className="text-sm">Extracting order details</span>
          </div>
          
          <div className="flex items-center">
            {processingStep === 'comparing' ? (
              <RefreshCw className="h-4 w-4 mr-2 text-brand-500 animate-spin" />
            ) : processingStep === 'generating' || processingStep === 'complete' ? (
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <FileWarning className="h-4 w-4 mr-2 text-muted-foreground" />
            )}
            <span className="text-sm">Comparing with internal prices</span>
          </div>
          
          <div className="flex items-center">
            {processingStep === 'generating' ? (
              <RefreshCw className="h-4 w-4 mr-2 text-brand-500 animate-spin" />
            ) : processingStep === 'complete' ? (
              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
            ) : (
              <FileWarning className="h-4 w-4 mr-2 text-muted-foreground" />
            )}
            <span className="text-sm">Generating response</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
