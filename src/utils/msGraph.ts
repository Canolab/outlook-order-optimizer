
// This file would contain the real Microsoft Graph API integration
// For now, we're using mock data with OpenAI for categorization

import { Email, AIGeneratedResponse } from '@/types/email';
import { generateMockEmails } from './mockData';
import { manageApiKey } from './aiUtils';

// Store sent emails in memory (in a real app, this would be in a database)
let sentEmails: Array<{
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: Date;
}> = [];

// Mock authentication function
export const authenticateWithMicrosoft = async (): Promise<{ success: boolean, error?: string }> => {
  // In a real implementation, this would use Microsoft's authentication libraries
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 1500);
  });
};

// Mock function to get emails
export const getEmails = async (): Promise<Email[]> => {
  // In a real implementation, this would fetch emails from Microsoft Graph API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockEmails(25));
    }, 1000);
  });
};

// Function to categorize emails using OpenAI
export const categorizeEmails = async (emails: Email[]): Promise<Email[]> => {
  try {
    const apiKey = manageApiKey.getApiKey();
    
    if (!apiKey) {
      console.warn('OpenAI API key not found, returning emails without categorization');
      return emails;
    }
    
    // Process emails in batches to avoid hitting rate limits
    const batchSize = 5;
    const categorizedEmails = [...emails];
    
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const uncategorizedEmails = batch.filter(email => !email.category || email.category === 'Other');
      
      if (uncategorizedEmails.length === 0) continue;
      
      const promises = uncategorizedEmails.map(async (email) => {
        try {
          const emailData = {
            subject: email.subject,
            body: email.body.substring(0, 500), // Truncate long emails
            sender: email.from.name,
            hasAttachments: email.attachments && email.attachments.length > 0
          };
          
          const prompt = `
            Categorize the following email into one of these categories: "Order", "Inquiry", "Support", "Other".
            
            Email Subject: ${emailData.subject}
            Email Body: ${emailData.body}
            Sender: ${emailData.sender}
            Has Attachments: ${emailData.hasAttachments}
            
            Respond with just one word: the category name.
          `;
          
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: 'You are an email categorization assistant. Your task is to analyze emails and categorize them.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              temperature: 0.3,
              max_tokens: 50
            })
          });
          
          if (!response.ok) {
            const error = await response.json();
            throw new Error(`OpenAI API Error: ${JSON.stringify(error)}`);
          }
          
          const data = await response.json();
          const category = data.choices[0].message.content.trim();
          
          // Map the response to one of our valid categories
          let mappedCategory: 'Order' | 'Inquiry' | 'Support' | 'Other' = 'Other';
          
          if (category.toLowerCase().includes('order')) {
            mappedCategory = 'Order';
          } else if (category.toLowerCase().includes('inquiry') || category.toLowerCase().includes('enquiry')) {
            mappedCategory = 'Inquiry';
          } else if (category.toLowerCase().includes('support')) {
            mappedCategory = 'Support';
          }
          
          // Update the email in our array
          const index = categorizedEmails.findIndex(e => e.id === email.id);
          if (index !== -1) {
            categorizedEmails[index] = {
              ...categorizedEmails[index],
              category: mappedCategory
            };
          }
          
          return mappedCategory;
        } catch (error) {
          console.error(`Error categorizing email ${email.id}:`, error);
          return 'Other';
        }
      });
      
      // Wait for all categorizations in this batch
      await Promise.all(promises);
      
      // Add a small delay between batches to avoid rate limiting
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    return categorizedEmails;
  } catch (error) {
    console.error('Error in categorizeEmails:', error);
    // If AI categorization fails, return original emails
    return emails;
  }
};

// Mock function to mark an email as read
export const markEmailAsRead = async (emailId: string): Promise<boolean> => {
  // In a real implementation, this would call Microsoft Graph API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

// Mock function to send an email
export const sendEmail = async (to: string, subject: string, body: string): Promise<boolean> => {
  // In a real implementation, this would call Microsoft Graph API to send the email
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate a random ID for the sent email
      const emailId = `sent-${Math.random().toString(36).substring(2, 10)}`;
      
      // Store the sent email in our memory array
      sentEmails.push({
        id: emailId,
        to,
        subject,
        body,
        sentAt: new Date(),
      });
      
      console.log('Email sent:', { to, subject });
      resolve(true);
    }, 1500);
  });
};

// Function to get sent emails
export const getSentEmails = async (): Promise<Array<{
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: Date;
}>> => {
  // In a real implementation, this would retrieve sent emails from the server
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...sentEmails].reverse()); // Return newest first
    }, 500);
  });
};
