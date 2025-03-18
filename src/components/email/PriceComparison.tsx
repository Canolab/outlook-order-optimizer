
import React from 'react';
import { BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceComparisonProps {
  priceComparison: {
    totalOrderValue: number;
    totalInternalCost: number;
    totalMargin: number;
    marginPercentage: number;
  } | null;
}

export const PriceComparisonDisplay: React.FC<PriceComparisonProps> = ({ priceComparison }) => {
  if (!priceComparison) return null;
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <BarChart2 className="h-4 w-4 mr-2" />
          Price Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Order Value</p>
            <p>${priceComparison.totalOrderValue.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium">Internal Cost</p>
            <p>${priceComparison.totalInternalCost.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-medium">Total Margin</p>
            <p className={priceComparison.totalMargin > 0 ? 'text-green-600' : 'text-red-600'}>
              ${priceComparison.totalMargin.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="font-medium">Margin Percentage</p>
            <p className={priceComparison.marginPercentage > 15 ? 'text-green-600' : 'text-orange-600'}>
              {priceComparison.marginPercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
