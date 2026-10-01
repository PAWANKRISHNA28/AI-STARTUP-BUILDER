import React, { useState } from 'react';
import { m } from 'framer-motion';
import { ArrowLeft, ArrowRight, Bell } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import clsx from 'clsx';

interface Step5NotificationsProps {
  onNext: () => void;
  onBack: () => void;
}

const defaultSettings = {
  email: true,
  productUpdates: true,
  projectAlerts: true,
  aiSuggestions: true,
  weeklyReports: false,
  marketing: false,
};

const settingsList = [
  { id: 'email', label: 'Email Notifications', desc: 'Core updates and important alerts' },
  { id: 'productUpdates', label: 'Product Updates', desc: 'New features and improvements' },
  { id: 'projectAlerts', label: 'Project Completion Alerts', desc: 'When your AI agents finish tasks' },
  { id: 'aiSuggestions', label: 'AI Suggestions', desc: 'Proactive tips for your startup' },
  { id: 'weeklyReports', label: 'Weekly Reports', desc: 'Summary of your progress' },
  { id: 'marketing', label: 'Marketing Emails', desc: 'Offers and promotions' },
];

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 }
};

export const Step5Notifications: React.FC<Step5NotificationsProps> = ({ onNext, onBack }) => {
  const user = useAuthStore(state => state.user);
  const updateUserPreferences = useAuthStore(state => state.updateUserPreferences);
  const [settings, setSettings] = useState<Record<string, boolean>>(
    user?.notificationSettings || defaultSettings
  );

  const handleToggle = (id: string) => {
    setSettings(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNext = () => {
    updateUserPreferences({ notificationSettings: settings });
    onNext();
  };

  return (
    <m.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/80 backdrop-blur-xl rounded-[24px] p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100"
    >
      <div className="mb-8 flex items-start gap-4">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
          <Bell size={24} />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mb-2">Notification Settings</h2>
          <p className="text-[#6B7280]">Stay in the loop. Choose what you want to hear about.</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-10 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
        {settingsList.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl bg-white/50">
            <div>
              <p className="font-semibold text-[#111827]">{item.label}</p>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <button
              onClick={() => handleToggle(item.id)}
              className={clsx(
                "w-12 h-6 rounded-full transition-colors relative flex items-center px-1 shrink-0",
                settings[item.id] ? "bg-[#14B8A6]" : "bg-gray-200"
              )}
            >
              <m.div
                className="w-4 h-4 bg-white rounded-full shadow-sm"
                animate={{ x: settings[item.id] ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-auto">
        <button 
          onClick={onBack}
          className="text-[#6B7280] hover:text-[#111827] px-4 py-2 font-medium transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button 
          onClick={handleNext}
          className="bg-[#4F46E5] hover:bg-[#4338CA] text-white px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </m.div>
  );
};
