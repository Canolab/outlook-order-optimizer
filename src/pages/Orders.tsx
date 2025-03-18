
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, PieChart, TrendingUp, Package, ArrowUpRight } from 'lucide-react';
import { mockOrderDetails } from '@/utils/mockData';

const Orders = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Order Processing</h1>
          <p className="text-muted-foreground">Track and analyze order emails and attachments</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Orders Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">24</div>
                <FileText className="h-5 w-5 text-brand-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Average Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">18.2%</div>
                <PieChart className="h-5 w-5 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">$34,567</div>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Items Ordered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">143</div>
                <Package className="h-5 w-5 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="p-3 text-sm font-medium text-muted-foreground">Order #</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground">Customer</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground">Items</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground text-right">Value</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground text-right">Margin</th>
                      <th className="p-3 text-sm font-medium text-muted-foreground text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className="border-b border-border hover:bg-muted/50">
                        <td className="p-3">{mockOrderDetails.orderNumber}-{index}</td>
                        <td className="p-3">{mockOrderDetails.customerName} Inc.</td>
                        <td className="p-3">{new Date(Date.now() - index * 86400000).toLocaleDateString()}</td>
                        <td className="p-3">{Math.floor(Math.random() * 10) + 1}</td>
                        <td className="p-3 text-right">${(Math.random() * 2000 + 500).toFixed(2)}</td>
                        <td className="p-3 text-right">
                          <span className={Math.random() > 0.2 ? 'text-green-600' : 'text-red-600'}>
                            {(Math.random() * 30).toFixed(1)}%
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                            Processed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded bg-brand-100 flex items-center justify-center text-brand-700 mr-3">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">Product {String.fromCharCode(65 + index)}</p>
                        <p className="text-sm text-muted-foreground">SKU: P{index}-{Math.floor(Math.random() * 10000)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(Math.random() * 500 + 100).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 100) + 10} units</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 mr-3">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div>
                        <p className="font-medium">Customer {index + 1}</p>
                        <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 5) + 1} orders</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center">
                      <p className="font-medium">${(Math.random() * 10000 + 1000).toFixed(2)}</p>
                      <ArrowUpRight className="ml-2 h-4 w-4 text-green-500" />
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
