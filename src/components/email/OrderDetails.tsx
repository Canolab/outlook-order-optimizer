
import React from 'react';
import { OrderDetails as OrderDetailsType } from '@/types/email';
import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface OrderDetailsProps {
  orderDetails: OrderDetailsType | null;
  priceComparison: any | null;
}

export const OrderDetailsDisplay: React.FC<OrderDetailsProps> = ({ orderDetails, priceComparison }) => {
  if (!orderDetails) return null;
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          Order Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Order Number</p>
              <p>{orderDetails.orderNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium">Customer</p>
              <p>{orderDetails.customerName || 'N/A'}</p>
            </div>
            {orderDetails.deliveryDate && (
              <div>
                <p className="font-medium">Delivery Date</p>
                <p>{format(orderDetails.deliveryDate, 'PPP')}</p>
              </div>
            )}
            <div>
              <p className="font-medium">Total Amount</p>
              <p>{orderDetails.totalAmount ? `$${orderDetails.totalAmount.toFixed(2)}` : 'N/A'}</p>
            </div>
          </div>
          
          <div>
            <p className="font-medium text-sm mb-2">Items</p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2">Item</th>
                    <th className="text-left p-2">Qty</th>
                    <th className="text-right p-2">Unit Price</th>
                    <th className="text-right p-2">Total</th>
                    {priceComparison && <th className="text-right p-2">Margin</th>}
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.items.map((item, index) => (
                    <tr key={index} className="border-b border-border">
                      <td className="p-2">
                        <div className="font-medium">{item.description}</div>
                        <div className="text-xs text-muted-foreground">{item.productCode}</div>
                      </td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="text-right p-2">${item.unitPrice.toFixed(2)}</td>
                      <td className="text-right p-2">${item.totalPrice.toFixed(2)}</td>
                      {priceComparison && (
                        <td className="text-right p-2">
                          {item.margin ? (
                            <span className={item.margin > 0 ? 'text-green-600' : 'text-red-600'}>
                              ${item.margin.toFixed(2)}
                            </span>
                          ) : 'N/A'}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
