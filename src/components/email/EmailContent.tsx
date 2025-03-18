
import React from 'react';
import { Email } from '@/types/email';
import { format } from 'date-fns';

interface EmailContentProps {
  email: Email;
}

export const EmailContent: React.FC<EmailContentProps> = ({ email }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold">{email.subject}</h2>
      <div className="flex items-center text-muted-foreground mt-2">
        <span className="text-sm">From: {email.from.name} &lt;{email.from.email}&gt;</span>
        <span className="mx-2">•</span>
        <span className="text-sm">{format(email.receivedAt, 'PPP p')}</span>
      </div>
      <div className="bg-white rounded-lg border border-border p-6 mt-6">
        <div className="whitespace-pre-line">{email.body}</div>
      </div>
    </div>
  );
};
