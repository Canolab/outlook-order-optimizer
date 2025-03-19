
export interface Email {
  id: string;
  subject: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  body: string;
  receivedAt: Date;
  hasAttachments: boolean;
  attachments?: Attachment[];
  category?: EmailCategory;
  isRead: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  contentType: string;
  size: number;
  content?: string;
  isPdf: boolean;
  isProcessed?: boolean;
  processingResult?: any;
}

export type EmailCategory = 
  | 'Order'
  | 'Inquiry'
  | 'Support'
  | 'Other';

export interface OrderDetails {
  orderNumber?: string;
  customerName?: string;
  items: OrderItem[];
  totalAmount?: number;
  currency?: string;
  deliveryDate?: Date;
}

export interface OrderItem {
  productCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  internalPrice?: number;
  margin?: number;
  difference?: number; // Added the difference property
}

export interface PriceComparison {
  orderItems: OrderItem[];
  totalOrderValue: number;
  totalInternalCost: number;
  totalDifference: number; // Changed from totalMargin
  differencePercentage: number; // Changed from marginPercentage
}

export interface AIGeneratedResponse {
  subject: string;
  body: string;
  recommendation?: string;
}
