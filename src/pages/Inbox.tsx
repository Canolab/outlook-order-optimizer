
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { EmailList } from '@/components/EmailList';
import { EmailDetail } from '@/components/EmailDetail';
import { getEmails, markEmailAsRead } from '@/utils/msGraph';
import { Email } from '@/types/email';
import { Button } from '@/components/ui/button';
import { RefreshCw, Inbox as InboxIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Inbox = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEmails = async () => {
    setIsLoading(true);
    try {
      const fetchedEmails = await getEmails();
      setEmails(fetchedEmails);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast({
        title: "Failed to load emails",
        description: "There was an error loading your emails",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleSelectEmail = async (email: Email) => {
    setSelectedEmail(email);
    
    if (!email.isRead) {
      try {
        await markEmailAsRead(email.id);
        // Update local state to mark the email as read
        setEmails(prevEmails => 
          prevEmails.map(e => 
            e.id === email.id ? { ...e, isRead: true } : e
          )
        );
      } catch (error) {
        console.error('Error marking email as read:', error);
      }
    }
  };

  const handleRefresh = () => {
    fetchEmails();
    toast({
      title: "Refreshing emails",
      description: "Getting your latest emails",
    });
  };

  return (
    <Layout>
      <div className="flex h-full">
        <div className="w-1/3 border-r border-border h-full">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <InboxIcon className="h-5 w-5 text-brand-600" />
              <h2 className="font-semibold">Inbox</h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          <EmailList 
            emails={emails}
            selectedEmailId={selectedEmail?.id || null}
            onSelectEmail={handleSelectEmail}
          />
        </div>
        
        <div className="w-2/3 h-full overflow-y-auto">
          <EmailDetail 
            email={selectedEmail}
            onClose={() => setSelectedEmail(null)}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Inbox;
