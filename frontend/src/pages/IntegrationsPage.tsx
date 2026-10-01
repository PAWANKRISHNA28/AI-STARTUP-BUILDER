import React, { useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { Layers, CheckCircle2, XCircle } from 'lucide-react';

export const IntegrationsPage: React.FC = () => {
  const addToast = useUIStore(state => state.addToast);
  
  const [integrations, setIntegrations] = useState({
    stripe: false,
    openai: true,
    slack: false,
    github: false
  });

  const toggleIntegration = (key: keyof typeof integrations) => {
    const newState = !integrations[key];
    setIntegrations(prev => ({ ...prev, [key]: newState }));
    addToast(newState ? 'success' : 'info', `${key.charAt(0).toUpperCase() + key.slice(1)} integration ${newState ? 'connected' : 'disconnected'}.`);
  };

  const integrationList = [
    { id: 'openai', name: 'OpenAI', description: 'Power your AI features with GPT-4', status: integrations.openai },
    { id: 'stripe', name: 'Stripe', description: 'Accept payments and manage subscriptions', status: integrations.stripe },
    { id: 'slack', name: 'Slack', description: 'Get notifications in your workspace', status: integrations.slack },
    { id: 'github', name: 'GitHub', description: 'Sync your project repositories', status: integrations.github },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Layers className="w-6 h-6 text-primary" /> Integrations
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Connect your workspace with third-party tools.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrationList.map((integration) => (
          <div key={integration.id} className="glass-panel p-5 rounded-2xl border border-border/50 flex flex-col justify-between h-40">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-foreground text-lg">{integration.name}</h3>
                {integration.status ? (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    <XCircle className="w-3 h-3" /> Disconnected
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">{integration.description}</p>
            </div>
            
            <button
              onClick={() => toggleIntegration(integration.id as any)}
              className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                integration.status 
                  ? 'bg-rose-500/10 text-rose-600 hover:bg-rose-500/20' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {integration.status ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
