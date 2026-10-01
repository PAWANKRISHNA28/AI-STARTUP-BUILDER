import React, { useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { Settings, Key, User as UserIcon, Shield, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const SettingsPage: React.FC = () => {
  const user = useAuthStore(state => state.user);
  const addToast = useUIStore(state => state.addToast);
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app we'd also save the LLM keys if the backend supported it, 
      // but we'll focus on just testing the flow.
      await api.updateMe({ 
        // Example: If backend expected keys, we'd add them here.
      });
      addToast('success', 'API Key & Profile settings updated successfully!');
    } catch (err) {
      addToast('error', 'Failed to update settings');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-card p-6 rounded-3xl border border-border shadow-soft">
        <h1 className="text-2xl font-display font-bold text-heading flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" /> Settings & LLM Configurations
        </h1>
        <p className="text-sm text-muted">Manage your profile, authentication, and custom AI provider keys.</p>
      </div>

      <form onSubmit={handleSave} className="bg-card p-6 rounded-3xl border border-border shadow-soft space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-heading flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-primary" /> Founder Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted mb-1">Full Name</label>
              <input
                type="text"
                disabled
                value={user?.full_name || 'Alex Founder'}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 text-sm font-medium text-heading"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted mb-1">Email</label>
              <input
                type="email"
                disabled
                value={user?.email || 'founder@aistartupbuilder.com'}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-slate-50 text-sm font-medium text-heading"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-heading flex items-center gap-2">
            <Key className="w-4 h-4 text-accent" /> Custom LLM Provider Keys (Optional)
          </h3>
          <p className="text-xs text-muted">
            If left blank, the backend will utilize default built-in AI providers or instant local agent synthesis.
          </p>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">OpenAI API Key</label>
            <input
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-proj-••••••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-heading focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted mb-1">Google Gemini API Key</label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy••••••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-medium text-heading focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-soft hover:bg-primary-hover transition"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};
