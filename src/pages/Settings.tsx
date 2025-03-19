import React, { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AISettings } from '@/components/Settings/AISettings';

const Settings = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your application preferences</p>
        </div>
        
        <Tabs defaultValue="ai-settings">
          <TabsList className="mb-6">
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="email-processing">Email Processing</TabsTrigger>
            <TabsTrigger value="ai-settings">AI Settings</TabsTrigger>
            <TabsTrigger value="erp-integration">ERP Integration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connections">
            <Card>
              <CardHeader>
                <CardTitle>Microsoft Account</CardTitle>
                <CardDescription>
                  Configure your Microsoft account connection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between border p-4 rounded-lg">
                  <div>
                    <h3 className="font-medium">Connected Account</h3>
                    <p className="text-sm text-muted-foreground">demo@email.com</p>
                  </div>
                  <Button variant="outline">Disconnect</Button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Permissions</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Read emails</Label>
                        <p className="text-sm text-muted-foreground">Allow application to read your emails</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Read attachments</Label>
                        <p className="text-sm text-muted-foreground">Allow application to access email attachments</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Send emails</Label>
                        <p className="text-sm text-muted-foreground">Allow application to send emails on your behalf</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Google Document AI</CardTitle>
                <CardDescription>
                  Configure your connection to Google Document AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input 
                    id="api-key" 
                    type="password" 
                    placeholder="Enter your Google Document AI API key" 
                    value="••••••••••••••••••••••••••••••" 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="project-id">Project ID</Label>
                  <Input 
                    id="project-id" 
                    placeholder="Enter your Google Cloud project ID" 
                    value="outlook-order-processor" 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="processor-id">Processor ID</Label>
                  <Input 
                    id="processor-id" 
                    placeholder="Enter your Document AI processor ID" 
                    value="abc123xyz456" 
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button>Save Configuration</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email-processing">
            <Card>
              <CardHeader>
                <CardTitle>Email Processing Settings</CardTitle>
                <CardDescription>
                  Configure how emails are processed and categorized
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Email Categories</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Process Order Emails</Label>
                        <p className="text-sm text-muted-foreground">Automatically detect and process order emails</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Process Inquiry Emails</Label>
                        <p className="text-sm text-muted-foreground">Automatically detect and categorize inquiries</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Process Support Emails</Label>
                        <p className="text-sm text-muted-foreground">Automatically detect support requests</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">PDF Processing</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-Process PDF Attachments</Label>
                        <p className="text-sm text-muted-foreground">Automatically process PDF attachments in order emails</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Extract Order Details</Label>
                        <p className="text-sm text-muted-foreground">Extract order details from PDFs</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Email Sync</h3>
                  <div className="space-y-2">
                    <div className="grid gap-2">
                      <Label htmlFor="sync-frequency">Sync Frequency (minutes)</Label>
                      <Input 
                        id="sync-frequency" 
                        type="number" 
                        defaultValue="15" 
                        min="5" 
                        max="60" 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="max-emails">Maximum Emails to Fetch</Label>
                      <Input 
                        id="max-emails" 
                        type="number" 
                        defaultValue="100" 
                        min="10" 
                        max="500" 
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button className="mt-2">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ai-settings">
            <AISettings />
          </TabsContent>
          
          <TabsContent value="erp-integration">
            <Card>
              <CardHeader>
                <CardTitle>K8 ERP Integration</CardTitle>
                <CardDescription>
                  Configure your connection to the K8 ERP system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Connection Settings</h3>
                  <div className="space-y-2">
                    <div className="grid gap-2">
                      <Label htmlFor="erp-endpoint">ERP API Endpoint</Label>
                      <Input 
                        id="erp-endpoint" 
                        placeholder="Enter your K8 ERP API endpoint" 
                        value="https://erp.example.com/api" 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="erp-username">Username</Label>
                      <Input 
                        id="erp-username" 
                        placeholder="Enter your ERP username" 
                        value="admin" 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="erp-password">Password</Label>
                      <Input 
                        id="erp-password" 
                        type="password" 
                        placeholder="Enter your ERP password" 
                        value="••••••••••••••••" 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">Price List Settings</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Auto-Sync Price Lists</Label>
                        <p className="text-sm text-muted-foreground">Automatically sync price lists from ERP</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="price-list-id">Default Price List ID</Label>
                      <Input 
                        id="price-list-id" 
                        placeholder="Enter default price list ID" 
                        value="PL-STD-2023" 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="sync-frequency-erp">Sync Frequency (hours)</Label>
                      <Input 
                        id="sync-frequency-erp" 
                        type="number" 
                        defaultValue="6" 
                        min="1" 
                        max="24" 
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button className="mt-2">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Sync Price Lists Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
