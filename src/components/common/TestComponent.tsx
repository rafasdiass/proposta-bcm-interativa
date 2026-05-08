// Test component to verify path aliases are working
import { formatCurrency } from '@/utils';
import { appConfig } from '@/data/config';

export const TestComponent = () => {
  return (
    <div>
      <p>Path aliases working!</p>
      <p>
        Total Investment: {formatCurrency(appConfig.proposal.totalInvestment)}
      </p>
    </div>
  );
};
