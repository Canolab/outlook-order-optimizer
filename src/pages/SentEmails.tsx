
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { getSentEmails } from '@/utils/msGraph';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { Inbox, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SentEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: Date;
}

const SentEmails: React.FC = () => {
  const [emails, setEmails] = useState<SentEmail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<SentEmail | null>(null);
  const { toast } = useToast();

  const fetchSentEmails = async () => {
    setIsLoading(true);
    try {
      const sentEmails = await getSentEmails();
      setEmails(sentEmails);
    } catch (error) {
      console.error('Error fetching sent emails:', error);
      toast({
        title: "Failed to load sent emails",
        description: "There was an error loading your sent emails",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSentEmails();
  }, []);

  const handleRefresh = () => {
    fetchSentEmails();
    toast({
      title: "Refreshing sent emails",
      description: "Getting your latest sent emails",
    });
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Sent Emails</h1>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RotateCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {emails.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-medium mb-2">No sent emails yet</h2>
              <p className="text-muted-foreground text-center max-w-md">
                When you send emails using the AI response feature, they will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Sent Emails</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[600px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>To</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Sent</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {emails.map((email) => (
                          <TableRow 
                            key={email.id} 
                            className={`cursor-pointer ${selectedEmail?.id === email.id ? 'bg-muted' : ''}`}
                            onClick={() => setSelectedEmail(email)}
                          >
                            <TableCell className="font-medium truncate max-w-[100px]">{email.to}</TableCell>
                            <TableCell className="truncate max-w-[150px]">{email.subject}</TableCell>
                            <TableCell>{format(new Date(email.sentAt), 'MMM d, HH:mm')}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              {selectedEmail ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Email Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="font-medium text-sm">Sent To</p>
                      <p>{selectedEmail.to}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Subject</p>
                      <p>{selectedEmail.subject}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Sent At</p>
                      <p>{format(new Date(selectedEmail.sentAt), 'PPpp')}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">Message</p>
                      <div className="bg-secondary p-3 rounded-md whitespace-pre-line text-sm">
                        {selectedEmail.body}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center p-12 text-muted-foreground">
                    Select an email to view details
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SentEmails;
