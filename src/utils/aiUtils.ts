
import { OrderDetails, AIGeneratedResponse, OrderItem, Email } from '@/types/email';
import { mockAIResponse } from './mockData';

// In a real implementation, this would use a multi-agent AI system
export const generateResponseWithAI = async (
  emailSubject: string, 
  emailBody: string, 
  orderDetails: OrderDetails,
  marginInfo: {
    totalOrderValue: number;
    totalInternalCost: number;
    totalMargin: number;
    marginPercentage: number;
  }
): Promise<AIGeneratedResponse> => {
  console.log('Generating AI response for email');
  
  // Simulate AI processing time
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a custom response that outlines the price differences
      const customerName = orderDetails.customerName || "Valued Customer";
      const orderNumber = orderDetails.orderNumber || "your recent order";
      
      // Calculate if there's a difference in price
      const hasDifference = marginInfo.totalMargin !== 0;
      const differenceType = marginInfo.totalMargin > 0 ? "higher" : "lower";
      
      // Create a response that outlines the differences
      let response: AIGeneratedResponse = {
        subject: `RE: ${emailSubject}`,
        body: `Dear ${customerName},\n\nThank you for your order ${orderNumber}. We've reviewed your request and would like to provide you with some information regarding pricing.\n\n`,
        recommendation: ''
      };
      
      // Add price difference details to the body
      if (hasDifference) {
        response.body += `We noticed that there's a ${Math.abs(marginInfo.marginPercentage).toFixed(1)}% ${differenceType} than our current pricing for these items. Here's a breakdown:\n\n`;
        
        // Add item by item breakdown
        orderDetails.items.forEach(item => {
          if (item.margin && item.margin !== 0) {
            const itemDifferenceType = item.margin > 0 ? "higher" : "lower";
            response.body += `- ${item.description} (${item.productCode}): ${Math.abs((item.margin / item.totalPrice) * 100).toFixed(1)}% ${itemDifferenceType} than our current pricing\n`;
          }
        });
        
        // Add conclusion based on price difference
        if (marginInfo.totalMargin > 0) {
          response.body += `\nWe'd like to discuss these pricing differences with you. We believe we can offer more competitive pricing for these items. Would you be available for a quick call to discuss this further?\n\n`;
          response.recommendation = 'Schedule a call to negotiate pricing - there may be an opportunity to offer a discount while maintaining profitability.';
        } else {
          response.body += `\nWe'd like to confirm these prices with you as they are below our current standard rates. There may have been recent changes in our pricing structure or special discounts that apply to your account.\n\n`;
          response.recommendation = 'Review order with sales manager - prices are below standard rates which may affect profitability.';
        }
      } else {
        response.body += `We confirm that the pricing in your order matches our current rates. We're processing your order and will update you on shipping details soon.\n\n`;
        response.recommendation = 'Order is ready for processing with standard pricing.';
      }
      
      response.body += `Please let me know if you have any questions or if there's anything else you need assistance with.\n\nBest regards,\nYour Account Manager`;
      
      resolve(response);
    }, 2500);
  });
};

// New function to generate automatic responses for inquiries and other emails
export const generateGenericResponse = async (email: Email): Promise<AIGeneratedResponse> => {
  console.log('Generating generic AI response for email type:', email.category);
  
  // Simulate AI processing time
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate different responses based on email category
      let response: AIGeneratedResponse;
      
      switch (email.category) {
        case 'Inquiry':
          response = {
            subject: `RE: ${email.subject}`,
            body: `Dear ${email.from.name},\n\nThank you for your inquiry. We've received your message and a member of our team will review it shortly. We typically respond to inquiries within 1-2 business days.\n\nIn the meantime, you might find answers to common questions on our FAQ page or knowledge base.\n\nBest regards,\nThe Support Team`,
            recommendation: 'Consider scheduling a follow-up call with this customer if they don\'t receive a response within 24 hours.'
          };
          break;
          
        case 'Support':
          response = {
            subject: `RE: ${email.subject}`,
            body: `Dear ${email.from.name},\n\nThank you for contacting our support team. Your request has been logged in our system with a priority status. A support specialist will analyze your issue and respond with a solution as soon as possible.\n\nFor urgent matters, please contact our support hotline at (555) 123-4567.\n\nBest regards,\nThe Support Team`,
            recommendation: 'This appears to be a technical support request. Consider escalating to the technical team for faster resolution.'
          };
          break;
          
        default:
          response = {
            subject: `RE: ${email.subject}`,
            body: `Dear ${email.from.name},\n\nThank you for your email. We've received your message and will get back to you shortly.\n\nBest regards,\nThe Customer Service Team`,
          };
      }
      
      resolve(response);
    }, 1500);
  });
};
