
import React from 'react';
import { Attachment } from '@/types/email';
import { Paperclip, FileText, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AttachmentsListProps {
  attachments: Attachment[];
  processingAttachment: string | null;
  onProcessAttachment: (attachment: Attachment) => void;
}

export const AttachmentsList: React.FC<AttachmentsListProps> = ({ 
  attachments, 
  processingAttachment, 
  onProcessAttachment 
}) => {
  if (!attachments?.length) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <Paperclip className="h-4 w-4 mr-2" />
        Attachments
      </h3>
      <div className="flex flex-wrap gap-2">
        {attachments.map((attachment) => (
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
                onClick={() => onProcessAttachment(attachment)}
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
