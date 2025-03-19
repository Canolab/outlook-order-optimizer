
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
      const itemsWithDifference = orderItems.map(item => {
        const internalItem = mockInternalPriceList[item.productCode as keyof typeof mockInternalPriceList];
        const internalPrice = internalItem ? internalItem.internalPrice : item.unitPrice * 0.8; // Fallback
        const difference = item.unitPrice - internalPrice;
        
        return {
          ...item,
          internalPrice,
          difference // Changed from margin to difference
        };
      });
      
      resolve(itemsWithDifference);
    }, 1000);
  });
};

export const calculateMargin = (orderItems: OrderItem[]): {
  totalOrderValue: number;
  totalInternalCost: number;
  totalDifference: number; // Changed from totalMargin
  differencePercentage: number; // Changed from marginPercentage
} => {
  const totalOrderValue = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalInternalCost = orderItems.reduce((sum, item) => sum + (item.internalPrice || 0) * item.quantity, 0);
  const totalDifference = totalOrderValue - totalInternalCost; // Changed from totalMargin
  const differencePercentage = (totalDifference / totalOrderValue) * 100; // Changed from marginPercentage
  
  return {
    totalOrderValue,
    totalInternalCost,
    totalDifference, // Changed from totalMargin
    differencePercentage // Changed from marginPercentage
  };
};
