
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, Mail, FileText, HelpCircle, MessageSquare } from 'lucide-react';

const Categories = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Email Categories</h1>
          <p className="text-muted-foreground">Automatically categorize and process emails based on content</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span>Orders</span>
              </CardTitle>
              <CardDescription>
                Emails containing order requests or confirmations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Automatically processes PDF attachments for order details and price comparison with your internal systems.
              </p>
              <div className="text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li>Extract pricing and product details</li>
                  <li>Compare with internal price lists</li>
                  <li>Calculate margins and profitability</li>
                  <li>Generate optimized responses</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <span>Inquiries</span>
              </CardTitle>
              <CardDescription>
                Emails requesting information about products or services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Analyzes customer questions and generates comprehensive responses with relevant information.
              </p>
              <div className="text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li>Identify specific product inquiries</li>
                  <li>Extract key questions from email body</li>
                  <li>Generate answers based on product database</li>
                  <li>Include relevant attachments automatically</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-orange-600" />
                <span>Support</span>
              </CardTitle>
              <CardDescription>
                Emails related to customer service and technical support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Prioritizes and categorizes support requests based on urgency and customer history.
              </p>
              <div className="text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li>Identify issue severity and priority</li>
                  <li>Match with knowledge base articles</li>
                  <li>Extract customer context from history</li>
                  <li>Generate step-by-step resolution guidance</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-600" />
                <span>Other</span>
              </CardTitle>
              <CardDescription>
                Miscellaneous emails that don't fit specific categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Analyzes uncategorized emails and suggests potential actions or relevant departments.
              </p>
              <div className="text-sm">
                <ul className="list-disc list-inside space-y-1">
                  <li>Identify potential partners or opportunities</li>
                  <li>Highlight marketing or PR opportunities</li>
                  <li>Flag emails that need manual review</li>
                  <li>Suggest appropriate forwarding destinations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
