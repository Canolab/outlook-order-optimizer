
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
      // Return mock data for now
      resolve(mockAIResponse);
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
