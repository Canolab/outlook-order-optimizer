
import React from 'react';
import { Email } from '@/types/email';
import { format } from 'date-fns';
import { Mail } from 'lucide-react';

interface EmailContentProps {
  email: Email;
}

export const EmailContent: React.FC<EmailContentProps> = ({ email }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold flex items-center">
        <Mail className="h-5 w-5 mr-2 text-brand-500" />
        {email.subject}
      </h2>
      <div className="flex items-center text-muted-foreground mt-2">
        <span className="text-sm">From: {email.from.name} &lt;{email.from.email}&gt;</span>
        <span className="mx-2">•</span>
        <span className="text-sm">{format(email.receivedAt, 'PPP p')}</span>
      </div>
      <div className="bg-white rounded-lg border border-border p-6 mt-4 shadow-sm">
        <div className="whitespace-pre-wrap leading-relaxed">{email.body}</div>
      </div>
    </div>
  );
};
