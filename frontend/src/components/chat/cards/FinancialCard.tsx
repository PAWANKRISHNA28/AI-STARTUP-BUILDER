import React from 'react';
import { DollarSign } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { t, formatCurrency } from '../../../utils/i18n';

export const FinancialCard: React.FC = React.memo(() => {
  const user = useAuthStore(state => state.user);
  const lang = user?.workspacePreferences?.language || 'English';
  const currency = user?.workspacePreferences?.currency || 'USD';

  return (
    <div className="card-premium p-5 max-w-sm w-full my-4">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <DollarSign className="w-5 h-5" />
        <h3 className="font-semibold">{t("Financial Forecast", lang)}</h3>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{t("Revenue", lang)}</span>
          <span className="font-bold text-success text-sm">{formatCurrency(18000, currency)}/{t("months", lang)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{t("Expenses", lang)}</span>
          <span className="font-bold text-danger text-sm">{formatCurrency(12500, currency)}/{t("months", lang)}</span>
        </div>
        <div className="h-px bg-border/50" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-foreground">{t("Profit", lang)}</span>
          <span className="font-bold text-success text-lg">{formatCurrency(5500, currency)}/{t("months", lang)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{t("ROI", lang)}</span>
          <span className="font-bold text-primary text-sm">18 {t("months", lang)}</span>
        </div>
      </div>
    </div>
  );
});
