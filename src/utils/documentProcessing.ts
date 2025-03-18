
import { OrderDetails, Attachment, OrderItem } from '@/types/email';
import { mockOrderDetails, mockInternalPriceList } from './mockData';

// This would use Google Document AI in a real implementation
export const processPdfWithDocumentAI = async (attachment: Attachment): Promise<OrderDetails | null> => {
  console.log('Processing PDF with Document AI:', attachment.name);
  
  // Simulate processing time
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return mock data for now
      resolve(mockOrderDetails);
    }, 2000);
  });
};

export const comparePricesWithERP = async (orderItems: OrderItem[]): Promise<OrderItem[]> => {
  console.log('Comparing prices with ERP system');
  
  // In a real implementation, this would query your K8 ERP system
  return new Promise((resolve) => {
    setTimeout(() => {
      const itemsWithMargin = orderItems.map(item => {
        const internalItem = mockInternalPriceList[item.productCode as keyof typeof mockInternalPriceList];
        const internalPrice = internalItem ? internalItem.internalPrice : item.unitPrice * 0.8; // Fallback
        const margin = item.unitPrice - internalPrice;
        
        return {
          ...item,
          internalPrice,
          margin
        };
      });
      
      resolve(itemsWithMargin);
    }, 1000);
  });
};

export const calculateMargin = (orderItems: OrderItem[]): {
  totalOrderValue: number;
  totalInternalCost: number;
  totalMargin: number;
  marginPercentage: number;
} => {
  const totalOrderValue = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalInternalCost = orderItems.reduce((sum, item) => sum + (item.internalPrice || 0) * item.quantity, 0);
  const totalMargin = totalOrderValue - totalInternalCost;
  const marginPercentage = (totalMargin / totalOrderValue) * 100;
  
  return {
    totalOrderValue,
    totalInternalCost,
    totalMargin,
    marginPercentage
  };
};
