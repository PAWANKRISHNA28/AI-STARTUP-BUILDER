import React from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useUIStore } from '../store/useUIStore';
import { Layers, ArrowRight, Sparkles, Code, DollarSign, Target } from 'lucide-react';

export const TemplatesPage: React.FC = () => {
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const setProjects = useProjectStore(state => state.setProjects);
  const projects = useProjectStore(state => state.projects);

  const templates = [
    {
      id: "t-saas",
      title: "B2B Enterprise SaaS Template",
      description: "Pre-configured parameters for workflow automation, analytics dashboards, and billing tools.",
      industry: "Enterprise Software",
      budget: "$50k - $250k",
      businessType: "B2B Subscription",
      targetUsers: "Ops managers, SME team leads",
      techPreference: "React / Node / PostgreSQL"
    },
    {
      id: "t-marketplace",
      title: "C2C FoodTech Delivery Template",
      description: "Configurations for group ordering split payments, merchant dashboards, and dispatch systems.",
      industry: "FoodTech Marketplace",
      budget: "$100k - $500k",
      businessType: "C2C / 2-Sided Market",
      targetUsers: "Students, local restaurants",
      techPreference: "React Native / FastAPI"
    },
    {
      id: "t-health",
      title: "AI Healthcare Diagnostics Template",
      description: "Parameters for HIPAA-compliant patient portals, diagnostics logs, and clinics directories.",
      industry: "HealthTech & AI",
      budget: "$250k - $1M",
      businessType: "B2B2C licensing",
      targetUsers: "Patients, doctors, clinic admins",
      techPreference: "Python / Next.js / AWS Shield"
    },
    {
      id: "t-fintech",
      title: "FinTech Payments Gateway Template",
      description: "Pre-configured fields for transaction ledger, split payouts API, and compliance audits.",
      industry: "FinTech Payments",
      budget: "$100k - $500k",
      businessType: "B2B Transaction Fee",
      targetUsers: "Online merchants, consumers",
      techPreference: "Golang / React / CockroachDB"
    }
  ];

  const handleUseTemplate = (t: typeof templates[0]) => {
    // Save parameters to local storage to pre-populate CreateProjectPage
    localStorage.setItem('template_title', t.title);
    localStorage.setItem('template_desc', t.description);
    localStorage.setItem('template_industry', t.industry);
    localStorage.setItem('template_budget', t.budget);
    localStorage.setItem('template_business_type', t.businessType);
    localStorage.setItem('template_target_users', t.targetUsers);
    localStorage.setItem('template_tech_pref', t.techPreference);
    
    // Redirect to Create Project Page
    setCurrentPage('create-project');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-display font-bold text-heading">Startup Templates</h1>
        <p className="text-sm text-muted">Use pre-configured industry standards to build your startup blueprints instantly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((t) => (
          <div
            key={t.id}
            className="bg-card p-6 rounded-3xl border border-border shadow-soft flex flex-col justify-between space-y-6 hover:shadow-soft-hover transition"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-accent" /> {t.industry}
              </div>
              <h3 className="font-bold text-heading text-lg">{t.title}</h3>
              <p className="text-xs text-muted leading-relaxed font-semibold">{t.description}</p>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-border/50 text-[11px] font-semibold text-muted">
              <div className="flex justify-between">
                <span>Business Model:</span>
                <span className="text-heading font-bold">{t.businessType}</span>
              </div>
              <div className="flex justify-between">
                <span>Budget tier:</span>
                <span className="text-heading font-bold">{t.budget}</span>
              </div>
              <div className="flex justify-between">
                <span>Preferred Stack:</span>
                <span className="text-heading font-bold">{t.techPreference}</span>
              </div>
            </div>

            <button
              onClick={() => handleUseTemplate(t)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition"
            >
              Use Template <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

