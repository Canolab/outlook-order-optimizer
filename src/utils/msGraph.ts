
// This file would contain the real Microsoft Graph API integration
// For now, we're using mock data

import { Email, AIGeneratedResponse } from '@/types/email';
import { generateMockEmails } from './mockData';

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

// Mock function to categorize emails
export const categorizeEmails = async (emails: Email[]): Promise<Email[]> => {
  // In a real implementation, this would use AI to categorize emails
  return emails;
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
