import React from 'react';
import { Lightbulb, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { t, formatCurrency } from '../../../utils/i18n';

export const BusinessAnalysisCard: React.FC = React.memo(() => {
  const user = useAuthStore(state => state.user);
  const lang = user?.workspacePreferences?.language || 'English';
  const currency = user?.workspacePreferences?.currency || 'USD';

  return (
    <div className="card-premium p-5 max-w-sm w-full my-4">
      <div className="flex items-center gap-2 mb-4 text-primary">
        <Lightbulb className="w-5 h-5" />
        <h3 className="font-semibold">{t("Business Analysis", lang)}</h3>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{t("Business Score", lang)}</span>
          <span className="font-bold text-success text-lg">91/100</span>
        </div>
        <div className="h-px bg-border/50" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-muted-foreground block mb-1">{t("Estimated Investment", lang)}</span>
            <span className="font-semibold text-sm">{formatCurrency(50000, currency)}</span>
          </div>
          <div>
            <span className="text-xs text-muted-foreground block mb-1">{t("Risk", lang)}</span>
            <span className="font-semibold text-sm text-success flex items-center gap-1">
              {t("Low", lang)} <TrendingUp className="w-3 h-3" />
            </span>
          </div>
        </div>
        <div className="h-px bg-border/50" />
        <div>
          <span className="text-xs text-muted-foreground block mb-1">{t("Market Demand", lang)}</span>
          <span className="font-semibold text-sm text-primary">{t("High", lang)}</span>
        </div>
        <button className="w-full mt-2 py-2 text-sm text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors font-medium">
          {t("View Details", lang)}
        </button>
      </div>
    </div>
  );
});
