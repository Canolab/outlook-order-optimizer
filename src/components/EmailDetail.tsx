
import React, { useState } from 'react';
import { Email, Attachment, OrderDetails } from '@/types/email';
import { Paperclip, FileText, BarChart2, RefreshCw, CheckCircle2, FileWarning } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { processPdfWithDocumentAI, comparePricesWithERP, calculateMargin } from '@/utils/documentProcessing';
import { generateResponseWithAI } from '@/utils/aiUtils';
import { useToast } from '@/hooks/use-toast';

interface EmailDetailProps {
  email: Email | null;
  onClose: () => void;
}

export const EmailDetail: React.FC<EmailDetailProps> = ({ email, onClose }) => {
  const [processingAttachment, setProcessingAttachment] = useState<string | null>(null);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [priceComparison, setPriceComparison] = useState<any | null>(null);
  const [aiResponse, setAiResponse] = useState<any | null>(null);
  const [processingStep, setProcessingStep] = useState<
    'idle' | 'extracting' | 'comparing' | 'generating' | 'complete'
  >('idle');
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

  const renderAttachments = () => {
    if (!email.hasAttachments || !email.attachments?.length) {
      return null;
    }

    return (
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2 flex items-center">
          <Paperclip className="h-4 w-4 mr-2" />
          Attachments
        </h3>
        <div className="flex flex-wrap gap-2">
          {email.attachments.map((attachment) => (
            <div 
              key={attachment.id}
              className="flex items-center p-2 bg-secondary rounded-md text-sm"
            >
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="mr-2">{attachment.name}</span>
              {attachment.isPdf && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={processingAttachment !== null}
                  onClick={() => handleProcessAttachment(attachment)}
                  className="text-xs h-7 px-2"
                >
                  {processingAttachment === attachment.id ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>Process</>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProcessingStatus = () => {
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

  const renderOrderDetails = () => {
    if (!orderDetails) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Order Number</p>
                <p>{orderDetails.orderNumber || 'N/A'}</p>
              </div>
              <div>
                <p className="font-medium">Customer</p>
                <p>{orderDetails.customerName || email.from.name}</p>
              </div>
              {orderDetails.deliveryDate && (
                <div>
                  <p className="font-medium">Delivery Date</p>
                  <p>{format(orderDetails.deliveryDate, 'PPP')}</p>
                </div>
              )}
              <div>
                <p className="font-medium">Total Amount</p>
                <p>{orderDetails.totalAmount ? `$${orderDetails.totalAmount.toFixed(2)}` : 'N/A'}</p>
              </div>
            </div>
            
            <div>
              <p className="font-medium text-sm mb-2">Items</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-2">Item</th>
                      <th className="text-left p-2">Qty</th>
                      <th className="text-right p-2">Unit Price</th>
                      <th className="text-right p-2">Total</th>
                      {priceComparison && <th className="text-right p-2">Margin</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.items.map((item, index) => (
                      <tr key={index} className="border-b border-border">
                        <td className="p-2">
                          <div className="font-medium">{item.description}</div>
                          <div className="text-xs text-muted-foreground">{item.productCode}</div>
                        </td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="text-right p-2">${item.unitPrice.toFixed(2)}</td>
                        <td className="text-right p-2">${item.totalPrice.toFixed(2)}</td>
                        {priceComparison && (
                          <td className="text-right p-2">
                            {item.margin ? (
                              <span className={item.margin > 0 ? 'text-green-600' : 'text-red-600'}>
                                ${item.margin.toFixed(2)}
                              </span>
                            ) : 'N/A'}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPriceComparison = () => {
    if (!priceComparison) return null;
    
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium flex items-center">
            <BarChart2 className="h-4 w-4 mr-2" />
            Price Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Order Value</p>
              <p>${priceComparison.totalOrderValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium">Internal Cost</p>
              <p>${priceComparison.totalInternalCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="font-medium">Total Margin</p>
              <p className={priceComparison.totalMargin > 0 ? 'text-green-600' : 'text-red-600'}>
                ${priceComparison.totalMargin.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="font-medium">Margin Percentage</p>
              <p className={priceComparison.marginPercentage > 15 ? 'text-green-600' : 'text-orange-600'}>
                {priceComparison.marginPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderAIResponse = () => {
    if (!aiResponse) return null;
    
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
            <Button onClick={() => {
              navigator.clipboard.writeText(aiResponse.body);
              toast({
                title: "Copied to clipboard",
                description: "The response has been copied to your clipboard",
              });
            }}>
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

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">{email.subject}</h2>
          <div className="flex items-center text-muted-foreground mt-2">
            <span className="text-sm">From: {email.from.name} &lt;{email.from.email}&gt;</span>
            <span className="mx-2">•</span>
            <span className="text-sm">{format(email.receivedAt, 'PPP p')}</span>
          </div>
        </div>
        
        {renderAttachments()}
        {renderProcessingStatus()}
        {renderOrderDetails()}
        {renderPriceComparison()}
        {renderAIResponse()}
        
        <div className="bg-white rounded-lg border border-border p-6 mb-6">
          <div className="whitespace-pre-line">{email.body}</div>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
