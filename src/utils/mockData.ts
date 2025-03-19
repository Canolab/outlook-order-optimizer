import { Email, EmailCategory, OrderDetails, Attachment } from '@/types/email';

export const generateMockEmails = (count: number = 25): Email[] => {
  const categories: EmailCategory[] = ['Order', 'Inquiry', 'Support', 'Other'];
  const domains = ['example.com', 'company.org', 'business.net', 'corporate.co'];
  const subjects = [
    'New order request for Q2',
    'Price inquiry for product XYZ',
    'Technical support needed',
    'Meeting request',
    'Order confirmation #12345',
    'Product catalog request',
    'Invoice query',
    'Partnership opportunity',
    'Order amendment'
  ];
  
  const names = [
    'John Smith',
    'Sarah Johnson',
    'Michael Brown',
    'Emily Davis',
    'David Wilson',
    'Jessica Taylor',
    'Robert Miller',
    'Jennifer Anderson',
    'Christopher Thomas',
    'Lisa Martinez'
  ];

  const emails: Email[] = [];
  
  for (let i = 0; i < count; i++) {
    const hasAttachments = Math.random() > 0.5;
    const attachmentCount = hasAttachments ? Math.floor(Math.random() * 3) + 1 : 0;
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const attachments: Attachment[] = [];
    for (let j = 0; j < attachmentCount; j++) {
      const isPdf = Math.random() > 0.3;
      attachments.push({
        id: `attachment-${i}-${j}`,
        name: isPdf ? `document-${j}.pdf` : `file-${j}.${Math.random() > 0.5 ? 'xlsx' : 'docx'}`,
        contentType: isPdf ? 'application/pdf' : (Math.random() > 0.5 ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
        size: Math.floor(Math.random() * 5000000) + 10000,
        isPdf
      });
    }

    const randomNameIndex = Math.floor(Math.random() * names.length);
    const randomName = names[randomNameIndex];
    const randomEmail = randomName.toLowerCase().replace(' ', '.') + '@' + domains[Math.floor(Math.random() * domains.length)];
    
    emails.push({
      id: `email-${i}`,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      from: {
        name: randomName,
        email: randomEmail
      },
      to: [{
        name: 'Sales Team',
        email: 'sales@yourcompany.com'
      }],
      body: generateRandomEmailBody(category),
      receivedAt: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)),
      hasAttachments,
      attachments: hasAttachments ? attachments : undefined,
      category,
      isRead: Math.random() > 0.3
    });
  }
  
  // Sort by receivedAt, newest first
  return emails.sort((a, b) => b.receivedAt.getTime() - a.receivedAt.getTime());
};

const generateRandomEmailBody = (category: EmailCategory): string => {
  switch (category) {
    case 'Order':
      return `Dear Sales Team,

I would like to place an order for the following items:
- 5x Product A (SKU: PA-12345)
- 3x Product B (SKU: PB-67890)
- 2x Product C (SKU: PC-24680)

Please confirm availability and expected delivery time.

Thank you,
[Customer Name]`;

    case 'Inquiry':
      return `Hello,

I'm interested in learning more about your product range. Specifically, I'd like to know:

1. Do you offer volume discounts?
2. What are your delivery timeframes?
3. Do you have a catalog you could share?

Looking forward to your response.

Best regards,
[Customer Name]`;

    case 'Support':
      return `Support Team,

I'm experiencing an issue with my recent order #ORD-12345. The shipment appears to be missing one item that was listed on the invoice.

Could you please look into this matter as soon as possible?

Thank you,
[Customer Name]`;

    default:
      return `Hello,

I hope this email finds you well. I wanted to touch base regarding our previous conversation about potential collaboration opportunities.

Would you be available for a brief call next week to discuss further?

Best regards,
[Customer Name]`;
  }
};

export const mockInternalPriceList = {
  'PA-12345': { description: 'Product A', internalPrice: 85.50 },
  'PB-67890': { description: 'Product B', internalPrice: 120.75 },
  'PC-24680': { description: 'Product C', internalPrice: 45.25 },
  'PD-13579': { description: 'Product D', internalPrice: 220.00 },
  'PE-97531': { description: 'Product E', internalPrice: 67.80 },
};

export const mockOrderDetails: OrderDetails = {
  orderNumber: "ORD-2023-42587",
  customerName: "Acme Corporation",
  items: [
    {
      productCode: "PA-12345",
      description: "Product A - Premium Widget",
      quantity: 5,
      unitPrice: 99.99,
      totalPrice: 499.95,
      internalPrice: 85.50,
      difference: 14.49
    },
    {
      productCode: "PB-67890",
      description: "Product B - Advanced Gadget",
      quantity: 3,
      unitPrice: 149.99,
      totalPrice: 449.97,
      internalPrice: 120.75,
      difference: 29.24
    },
    {
      productCode: "PC-24680",
      description: "Product C - Standard Component",
      quantity: 2,
      unitPrice: 59.99,
      totalPrice: 119.98,
      internalPrice: 45.25,
      difference: 14.74
    }
  ],
  totalAmount: 1069.90,
  currency: "USD",
  deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
};

export const mockPriceComparison = {
  orderItems: mockOrderDetails.items,
  totalOrderValue: 1069.90,
  totalInternalCost: 849.75,
  totalDifference: 220.15,
  differencePercentage: 20.58
};

export const mockAIResponse = {
  subject: "RE: New order request for Q2",
  body: `Dear John Smith,

Thank you for your order request (REF: ORD-2023-42587). I'm pleased to confirm that all requested items are currently in stock and ready for shipment.

As requested, your order includes:
- 5x Product A - Premium Widget
- 3x Product B - Advanced Gadget
- 2x Product C - Standard Component

Based on your delivery requirements, we can dispatch the order on Monday, July 24, with expected delivery by July 28. 

The total order value is $1,069.90 excluding any applicable taxes or shipping fees. Please note that for orders exceeding $1,000, we offer a 5% discount on future purchases.

If you need to make any changes to this order, please let me know by Thursday, July 20, to ensure timely processing.

Would you like me to proceed with this order as outlined above?

Best regards,
Sales Team
Your Company`,
  recommendation: "This is a high-margin order (20.58%) that exceeds our target of 18%. Prioritize and expedite processing. Customer has a history of consistent ordering - consider offering a loyalty discount on their next purchase."
};
