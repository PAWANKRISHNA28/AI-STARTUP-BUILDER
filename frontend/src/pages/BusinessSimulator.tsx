import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export const BusinessSimulator: React.FC = () => {
  const setCurrentPage = useUIStore(state => state.setCurrentPage);

  const [investment, setInvestment] = useState(100000);
  const [rent, setRent] = useState(5000);
  const [salary, setSalary] = useState(8000);
  const [utilities, setUtilities] = useState(1000);
  const [avgPrice, setAvgPrice] = useState(25);
  const [dailyCustomers, setDailyCustomers] = useState(50);
  const [operatingDays, setOperatingDays] = useState(26);

  const [results, setResults] = useState({
    revenue: 0,
    expenses: 0,
    profit: 0,
    roi: 0,
    breakeven: 0
  });

  useEffect(() => {
    const monthlyRevenue = avgPrice * dailyCustomers * operatingDays;
    const monthlyExpenses = rent + salary + utilities;
    const monthlyProfit = monthlyRevenue - monthlyExpenses;
    
    const yearlyProfit = monthlyProfit * 12;
    const roiPercentage = investment > 0 ? (yearlyProfit / investment) * 100 : 0;
    const breakevenMonths = monthlyProfit > 0 ? investment / monthlyProfit : -1;

    setResults({
      revenue: monthlyRevenue,
      expenses: monthlyExpenses,
      profit: monthlyProfit,
      roi: roiPercentage,
      breakeven: breakevenMonths
    });
  }, [investment, rent, salary, utilities, avgPrice, dailyCustomers, operatingDays]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 pt-4">
      
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setCurrentPage('location-map')}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back to Map
        </button>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" /> AI Financial Simulator
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Inputs */}
        <m.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1 space-y-6 glass-panel rounded-[32px] p-6 shadow-sm"
        >
          <h2 className="text-lg font-bold border-b border-border/50 pb-2">Assumptions</h2>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Initial Investment ($)</label>
              <input type="number" value={investment} onChange={e => setInvestment(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-border/50 bg-background" />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Monthly Rent ($)</label>
              <input type="number" value={rent} onChange={e => setRent(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-border/50 bg-background" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Monthly Payroll ($)</label>
              <input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-border/50 bg-background" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground">Monthly Utilities/Other ($)</label>
              <input type="number" value={utilities} onChange={e => setUtilities(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-border/50 bg-background" />
            </div>

            <div className="pt-4 border-t border-border/50 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Avg. Product Price ($)</label>
                <input type="number" value={avgPrice} onChange={e => setAvgPrice(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-border/50 bg-background" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Expected Daily Customers</label>
                <input type="number" value={dailyCustomers} onChange={e => setDailyCustomers(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-border/50 bg-background" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Operating Days/Month</label>
                <input type="number" value={operatingDays} onChange={e => setOperatingDays(Number(e.target.value))} className="w-full px-3 py-2 rounded-xl border border-border/50 bg-background" />
              </div>
            </div>
          </div>
        </m.div>

        {/* Results */}
        <m.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-[24px] border border-border/50 shadow-sm flex flex-col justify-center items-center text-center">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Monthly Revenue</div>
              <div className="text-3xl font-extrabold text-foreground">{formatCurrency(results.revenue)}</div>
            </div>
            <div className="glass-panel p-6 rounded-[24px] border border-border/50 shadow-sm flex flex-col justify-center items-center text-center">
              <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Monthly Expenses</div>
              <div className="text-3xl font-extrabold text-rose-500">{formatCurrency(results.expenses)}</div>
            </div>
          </div>

          <div className={`p-8 rounded-[32px] border flex flex-col justify-center items-center text-center shadow-lg ${results.profit > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-900' : 'bg-rose-50 border-rose-100 text-rose-900'}`}>
            <div className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">Net Monthly Profit</div>
            <div className={`text-6xl font-black ${results.profit > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {formatCurrency(results.profit)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-6 rounded-[24px] border border-border/50 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Est. ROI (Year 1)</div>
                  <div className="text-2xl font-bold">{results.roi.toFixed(1)}%</div>
                </div>
                <TrendingUp className="w-6 h-6 text-primary opacity-50" />
              </div>
            </div>
            <div className="glass-panel p-6 rounded-[24px] border border-border/50 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Break-even Period</div>
                  <div className="text-2xl font-bold">
                    {results.breakeven > 0 ? `${results.breakeven.toFixed(1)} Months` : 'Never'}
                  </div>
                </div>
                <AlertCircle className={`w-6 h-6 ${results.breakeven > 0 && results.breakeven <= 24 ? 'text-emerald-500' : 'text-rose-500'} opacity-50`} />
              </div>
            </div>
          </div>

        </m.div>

      </div>
    </div>
  );
};
