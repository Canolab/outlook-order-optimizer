
import React, { useState } from 'react';
import { Email, Attachment, OrderDetails, AIGeneratedResponse } from '@/types/email';
import { processPdfWithDocumentAI, comparePricesWithERP, calculateMargin } from '@/utils/documentProcessing';
import { generateResponseWithAI, generateGenericResponse } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MessageSquareText } from 'lucide-react';

// Import refactored components
import { AttachmentsList } from './email/AttachmentsList';
import { ProcessingStatus } from './email/ProcessingStatus';
import { OrderDetailsDisplay } from './email/OrderDetails';
import { PriceComparisonDisplay } from './email/PriceComparison';
import { AIResponseDisplay } from './email/AIResponse';
import { EmailContent } from './email/EmailContent';

interface EmailDetailProps {
  email: Email | null;
  onClose: () => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email, onClose }) => {
  const [processingAttachment, setProcessingAttachment] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [priceComparison, setPriceComparison] = useState<any | null>(null);
  const [aiResponse, setAiResponse] = useState<AIGeneratedResponse | null>(null);
  const [processingStep, setProcessingStep] = useState<
    'idle' | 'extracting' | 'comparing' | 'generating' | 'complete'
  >('idle');
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const { toast } = useToast();

  if (!email) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select an email to view</p>
      </div>
    );
  }

  const handleProcessAttachment = async (attachment: Attachment) => {
    if (!attachment.isPdf) {
      toast({
        title: "Cannot process attachment",
        description: "Only PDF attachments can be processed",
        variant: "destructive",
      });
      return;
    }

    setProcessingAttachment(attachment.id);
    setProcessingStep('extracting');
    
    try {
      // Step 1: Extract order details from PDF
      const extractedDetails = await processPdfWithDocumentAI(attachment);
      setOrderDetails(extractedDetails);
      
      if (extractedDetails) {
        setProcessingStep('comparing');
        
        // Step 2: Compare with internal price list
        const itemsWithPrices = await comparePricesWithERP(extractedDetails.items);
        const updatedOrderDetails = {
          ...extractedDetails,
          items: itemsWithPrices
        };
        setOrderDetails(updatedOrderDetails);
        
        // Calculate margins
        const marginInfo = calculateMargin(itemsWithPrices);
        setPriceComparison(marginInfo);
        
        setProcessingStep('generating');
        
        // Step 3: Generate AI response
        const response = await generateResponseWithAI(
          email.subject,
          email.body,
          updatedOrderDetails,
          marginInfo
        );
        
        setAiResponse(response);
        setProcessingStep('complete');
        
        toast({
          title: "Processing complete",
          description: "Order analyzed and response generated",
        });
      }
    } catch (error) {
      console.error('Error processing attachment:', error);
      toast({
        title: "Processing failed",
        description: "An error occurred while processing the attachment",
        variant: "destructive",
      });
    } finally {
      setProcessingAttachment(null);
    }
  };

  const handleGenerateResponse = async () => {
    if (!email) return;
    
    setIsGeneratingResponse(true);
    
    try {
      // Generate response based on email category
      const response = await generateGenericResponse(email);
      setAiResponse(response);
      
      toast({
        title: "Response generated",
        description: "An AI response has been generated for this email",
      });
    } catch (error) {
      console.error('Error generating response:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate a response for this email",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <EmailContent email={email} />
        
        {/* Add button to generate generic response */}
        {!aiResponse && email.category !== 'Order' && (
          <div className="mb-6">
            <Button 
              onClick={handleGenerateResponse}
              disabled={isGeneratingResponse}
              className="mt-4"
            >
              <MessageSquareText className="mr-2 h-4 w-4" />
              {isGeneratingResponse ? 'Generating...' : 'Generate Response'}
            </Button>
          </div>
        )}
        
        <AttachmentsList 
          attachments={email.attachments || []} 
          processingAttachment={processingAttachment}
          onProcessAttachment={handleProcessAttachment}
        />
        
        <ProcessingStatus processingStep={processingStep} />
        
        <OrderDetailsDisplay 
          orderDetails={orderDetails}
          priceComparison={priceComparison}
        />
        
        <PriceComparisonDisplay priceComparison={priceComparison} />
        
        <AIResponseDisplay aiResponse={aiResponse} />
      </div>
    </div>
  );
};

export default EmailDetail;
