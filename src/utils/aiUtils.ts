
import { OrderDetails, AIGeneratedResponse, OrderItem, Email } from '@/types/email';
import { mockAIResponse } from './mockData';

// OpenAI API integration
const generateResponseWithOpenAI = async (
  prompt: string,
  options: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<string> => {
  try {
    // In a real implementation, this would use your OpenAI API key from environment variables
    const apiKey = localStorage.getItem('openai_api_key');
    
    if (!apiKey) {
      console.error('OpenAI API key not found');
      throw new Error('OpenAI API key not found. Please set your API key in settings.');
    }
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: options.model || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an industrial supply company assistant. Your task is to analyze emails, generate responses, and provide sales recommendations.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 1000
      })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${JSON.stringify(error)}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
};

// Function to generate response for order-related emails
export const generateResponseWithAI = async (
  emailSubject: string, 
  emailBody: string, 
  orderDetails: OrderDetails,
  differenceInfo: {
    totalOrderValue: number;
    totalInternalCost: number;
    totalDifference: number;
    differencePercentage: number;
  }
): Promise<AIGeneratedResponse> => {
  console.log('Generating AI response for email with OpenAI');
  
  try {
    // Create a detailed prompt for the AI
    const prompt = `
      I need to generate a response to a customer email regarding an order.
      
      Email Subject: ${emailSubject}
      Email Body: ${emailBody}
      
      Order Details:
      Customer Name: ${orderDetails.customerName || "Unnamed Customer"}
      Order Number: ${orderDetails.orderNumber || "Unnumbered Order"}
      
      Price Difference Analysis:
      - Total Order Value from Customer: $${differenceInfo.totalOrderValue.toFixed(2)}
      - Our Internal Price Total: $${differenceInfo.totalInternalCost.toFixed(2)}
      - Price Difference: $${differenceInfo.totalDifference.toFixed(2)} (${differenceInfo.differencePercentage.toFixed(1)}%)
      
      Line Items with Their Price Differences:
      ${orderDetails.items.map(item => {
        const difference = item.difference || 0;
        const differenceType = difference > 0 ? "higher" : difference < 0 ? "lower" : "same";
        const differencePercentage = item.totalPrice > 0 ? (Math.abs(difference) / item.totalPrice) * 100 : 0;
        
        return `- ${item.description} (${item.productCode}): ${Math.abs(differencePercentage).toFixed(1)}% ${differenceType} than our standard pricing`;
      }).join('\n')}
      
      Generate:
      1. A professional email response addressing the pricing differences
      2. A clear explanation of the price differences
      3. A recommendation for how to proceed (e.g., schedule a call, offer a discount, etc.)
      4. A sales recommendation for internal use only (This should be separate from the email)
      
      Format your response as a JSON object with fields:
      - subject (the email subject line)
      - body (the full email text)
      - recommendation (internal sales recommendation)
    `;
    
    // Call the OpenAI API
    const aiResponse = await generateResponseWithOpenAI(prompt, {
      temperature: 0.7,
      max_tokens: 1500
    });
    
    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(aiResponse);
      return {
        subject: parsedResponse.subject || `RE: ${emailSubject}`,
        body: parsedResponse.body,
        recommendation: parsedResponse.recommendation
      };
    } catch (parseError) {
      console.error('Error parsing AI response as JSON:', parseError);
      
      // Fallback: try to extract the parts manually
      const subjectMatch = aiResponse.match(/subject:(.*?)(?=body:|recommendation:|$)/is);
      const bodyMatch = aiResponse.match(/body:(.*?)(?=recommendation:|$)/is);
      const recommendationMatch = aiResponse.match(/recommendation:(.*?)(?=$)/is);
      
      return {
        subject: subjectMatch ? subjectMatch[1].trim() : `RE: ${emailSubject}`,
        body: bodyMatch ? bodyMatch[1].trim() : aiResponse,
        recommendation: recommendationMatch ? recommendationMatch[1].trim() : ''
      };
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback to the mock response in case of errors
    return new Promise((resolve) => {
      setTimeout(() => {
        const customerName = orderDetails.customerName || "Valued Customer";
        const orderNumber = orderDetails.orderNumber || "your recent order";
        
        // Calculate if there's a difference in price
        const hasDifference = differenceInfo.totalDifference !== 0;
        const differenceType = differenceInfo.totalDifference > 0 ? "higher" : "lower";
        
        // Create a response that outlines the differences
        let response: AIGeneratedResponse = {
          subject: `RE: ${emailSubject}`,
          body: `Dear ${customerName},\n\nThank you for your order ${orderNumber}. We've reviewed your request and would like to provide you with some information regarding pricing.\n\n`,
          recommendation: ''
        };
        
        // Add price difference details to the body
        if (hasDifference) {
          response.body += `We noticed that there's a ${Math.abs(differenceInfo.differencePercentage).toFixed(1)}% ${differenceType} than our current pricing for these items. Here's a breakdown:\n\n`;
          
          // Add item by item breakdown
          orderDetails.items.forEach(item => {
            if (item.difference && item.difference !== 0) {
              const itemDifferenceType = item.difference > 0 ? "higher" : "lower";
              response.body += `- ${item.description} (${item.productCode}): ${Math.abs((item.difference / item.totalPrice) * 100).toFixed(1)}% ${itemDifferenceType} than our current pricing\n`;
            }
          });
          
          // Add conclusion based on price difference
          if (differenceInfo.totalDifference > 0) {
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
      }, 100);
    });
  }
};

// Function to generate response for general inquiries and other emails
export const generateGenericResponse = async (email: Email): Promise<AIGeneratedResponse> => {
  console.log('Generating generic AI response for email type:', email.category);
  
  try {
    const prompt = `
      I need to generate a response to a customer email.
      
      Email Category: ${email.category}
      Email Subject: ${email.subject}
      Email From: ${email.from.name} (${email.from.email})
      Email Body: ${email.body}
      
      Generate:
      1. A professional email response addressing the customer's inquiry or issue
      2. An appropriate subject line
      3. A recommendation for follow-up actions or next steps (for internal use only)
      
      Format your response as a JSON object with fields:
      - subject (the email subject line)
      - body (the full email text)
      - recommendation (internal recommendation)
    `;
    
    // Call the OpenAI API
    const aiResponse = await generateResponseWithOpenAI(prompt, {
      temperature: 0.7
    });
    
    try {
      // Parse the JSON response
      const parsedResponse = JSON.parse(aiResponse);
      return {
        subject: parsedResponse.subject || `RE: ${email.subject}`,
        body: parsedResponse.body,
        recommendation: parsedResponse.recommendation
      };
    } catch (parseError) {
      console.error('Error parsing AI response as JSON:', parseError);
      
      // Fallback: try to extract the parts manually
      const subjectMatch = aiResponse.match(/subject:(.*?)(?=body:|recommendation:|$)/is);
      const bodyMatch = aiResponse.match(/body:(.*?)(?=recommendation:|$)/is);
      const recommendationMatch = aiResponse.match(/recommendation:(.*?)(?=$)/is);
      
      return {
        subject: subjectMatch ? subjectMatch[1].trim() : `RE: ${email.subject}`,
        body: bodyMatch ? bodyMatch[1].trim() : aiResponse,
        recommendation: recommendationMatch ? recommendationMatch[1].trim() : ''
      };
    }
  } catch (error) {
    console.error('Error generating generic AI response:', error);
    
    // Fallback to the mock response in case of errors
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
              recommendation: 'Review this email and assign to the appropriate department.'
            };
        }
        
        resolve(response);
      }, 100);
    });
  }
};

// Create a utility function to manage API keys
export const manageApiKey = {
  saveApiKey: (key: string): void => {
    localStorage.setItem('openai_api_key', key);
    console.log('API key saved successfully');
  },
  
  getApiKey: (): string | null => {
    return localStorage.getItem('openai_api_key');
  },
  
  validateApiKey: async (key: string): Promise<boolean> => {
    try {
      // Make a minimal API call to validate the key
      const response = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`
        }
      });
      
      return response.status === 200;
    } catch (error) {
      console.error('Error validating API key:', error);
      return false;
    }
  }
};
