import React, { useState } from 'react';
import { m } from 'framer-motion';
import { ArrowLeft, ArrowRight, Globe, Settings, Moon, Sun, Monitor } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useAuthStore } from '../../store/useAuthStore';
import clsx from 'clsx';

interface Step6WorkspaceProps {
  onNext: () => void;
  onBack: () => void;
}

const defaultWorkspace = {
  language: 'English',
  currency: 'USD',
  country: 'United States',
  theme: 'light',
  timezone: 'UTC',
};

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const Step6Workspace: React.FC<Step6WorkspaceProps> = ({ onNext, onBack }) => {
  const user = useAuthStore(state => state.user);
  const updateUserPreferences = useAuthStore(state => state.updateUserPreferences);
  const setTheme = useUIStore(state => state.setTheme);
  const [workspace, setWorkspace] = useState(user?.workspacePreferences || defaultWorkspace);

  const handleNext = () => {
    updateUserPreferences({ workspacePreferences: workspace });
    onNext();
  };

  return (
    <m.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-card/80 backdrop-blur-xl rounded-[24px] p-6 sm:p-10 shadow-soft border border-border"
    >
      <div className="mb-8 flex items-start gap-4">
        <div className="w-12 h-12 bg-muted text-muted-foreground rounded-2xl flex items-center justify-center shrink-0">
          <Settings size={24} />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-heading mb-2">Workspace Setup</h2>
          <p className="text-body">Configure your regional and visual preferences.</p>
        </div>
      </div>

      <div className="grid gap-6 mb-10">
        <div>
          <label className="block text-sm font-medium text-heading mb-2">Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', icon: Sun, label: 'Light' },
              { id: 'dark', icon: Moon, label: 'Dark' },
              { id: 'system', icon: Monitor, label: 'System' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setWorkspace({ ...workspace, theme: t.id });
                  setTheme(t.id);
                }}
                className={clsx(
                  "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                  workspace.theme === t.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-body hover:bg-muted/50"
                )}
              >
                <t.icon size={20} className="mb-2" />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-heading mb-2">Language</label>
            <select
              value={workspace.language}
              onChange={(e) => setWorkspace({ ...workspace, language: e.target.value })}
              className="w-full bg-card border border-border text-body rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Hindi">Hindi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="Kannada">Kannada</option>
              <option value="Malayalam">Malayalam</option>
              <option value="Bengali">Bengali</option>
              <option value="Marathi">Marathi</option>
              <option value="Gujarati">Gujarati</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Urdu">Urdu</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
              <option value="Arabic">Arabic</option>
              <option value="Russian">Russian</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Italian">Italian</option>
              <option value="Dutch">Dutch</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-heading mb-2">Currency</label>
            <select
              value={workspace.currency}
              onChange={(e) => setWorkspace({ ...workspace, currency: e.target.value })}
              className="w-full bg-card border border-border text-body rounded-xl px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="INR">INR (₹)</option>
              <option value="AUD">AUD (A$)</option>
              <option value="CAD">CAD (C$)</option>
              <option value="CHF">CHF (Fr)</option>
              <option value="CNY">CNY (¥)</option>
              <option value="HKD">HKD (HK$)</option>
              <option value="SGD">SGD (S$)</option>
              <option value="KRW">KRW (₩)</option>
              <option value="NZD">NZD (NZ$)</option>
              <option value="AED">AED (د.إ)</option>
              <option value="SAR">SAR (﷼)</option>
              <option value="QAR">QAR (﷼)</option>
              <option value="ZAR">ZAR (R)</option>
              <option value="RUB">RUB (₽)</option>
              <option value="BRL">BRL (R$)</option>
              <option value="MXN">MXN ($)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto">
        <button
          onClick={onBack}
          className="text-muted-foreground hover:text-heading px-4 py-2 font-medium transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button
          onClick={handleNext}
          className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2"
        >
          Finish Setup
          <ArrowRight size={18} />
        </button>
      </div>
    </m.div>
  );
};
