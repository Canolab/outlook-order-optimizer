
import React from 'react';
import { Email } from '@/types/email';
import { Paperclip, Circle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface EmailListProps {
  emails: Email[];
  selectedEmailId: string | null;
  onSelectEmail: (email: Email) => void;
}

export const EmailList: React.FC<EmailListProps> = ({ 
  emails, 
  selectedEmailId, 
  onSelectEmail 
}) => {
  return (
    <div className="border-r border-border h-full overflow-y-auto">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Inbox</h2>
        <p className="text-sm text-muted-foreground">
          {emails.length} emails
        </p>
      </div>
      
      <div className="divide-y divide-border">
        {emails.map((email) => (
          <div 
            key={email.id}
            className={`email-item ${selectedEmailId === email.id ? 'selected' : ''}`}
            onClick={() => onSelectEmail(email)}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="font-medium flex items-center gap-2">
                {!email.isRead && (
                  <Circle className="h-2 w-2 fill-brand-500 text-brand-500" />
                )}
                <span>{email.from.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(email.receivedAt, { addSuffix: true })}
              </span>
            </div>
            
            <div className="text-sm font-medium mb-1 truncate">
              {email.subject}
            </div>
            
            <div className="text-xs text-muted-foreground line-clamp-2 mb-1">
              {email.body.substring(0, 120)}...
            </div>
            
            <div className="flex items-center justify-between">
              {email.category && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  email.category === 'Order' 
                    ? 'bg-green-100 text-green-800' 
                    : email.category === 'Inquiry'
                    ? 'bg-blue-100 text-blue-800'
                    : email.category === 'Support'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {email.category}
                </span>
              )}
              
              {email.hasAttachments && (
                <div className="flex items-center text-muted-foreground">
                  <Paperclip className="h-3 w-3 mr-1" />
                  <span className="text-xs">
                    {email.attachments?.length} attachment{email.attachments && email.attachments.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmailList;
