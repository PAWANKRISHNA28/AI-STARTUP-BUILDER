import React from 'react';
import { Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

export const AgentsPage: React.FC = () => {
  const agents = [
    { num: 1, name: "Orchestrator Agent", role: "Task planning, execution graph ordering, memory, communication, result merging." },
    { num: 2, name: "Idea Analyzer Agent", role: "Idea validation, problem statement, innovation score, unique value proposition." },
    { num: 3, name: "Market Research Agent", role: "Market trends, industry growth, TAM, SAM, SOM, demand analysis." },
    { num: 4, name: "Competitor Agent", role: "Top competitors, strengths, weaknesses, gap analysis, comparison tables." },
    { num: 5, name: "Business Model Agent", role: "Business Model Canvas, Lean Canvas, revenue streams, customer segments." },
    { num: 6, name: "Revenue Agent", role: "Revenue model, subscription, freemium, marketplace, commission." },
    { num: 7, name: "Pricing Agent", role: "Pricing strategy, monthly, annual, enterprise, discount strategy." },
    { num: 8, name: "Customer Persona Agent", role: "Target audience, pain points, needs, user journey." },
    { num: 9, name: "Feature Planning Agent", role: "Core Features, MVP, Future Scope, Priority Matrix." },
    { num: 10, name: "UI Designer Agent", role: "Landing page, dashboard, mobile UI, wireframes, navigation." },
    { num: 11, name: "UX Research Agent", role: "User flow, accessibility, journey maps." },
    { num: 12, name: "Database Designer Agent", role: "ER Diagram, Tables, Relationships, Normalization, SQL Schema." },
    { num: 13, name: "API Designer Agent", role: "REST APIs, Authentication, Endpoints, Responses, Documentation." },
    { num: 14, name: "Backend Architect Agent", role: "Folder structure, Services, Controllers, Repositories, Authentication." },
    { num: 15, name: "Frontend Architect Agent", role: "Pages, Components, Layouts, Hooks, State Management, Routing." },
    { num: 16, name: "Security Agent", role: "JWT, OAuth, RBAC, Encryption, API Security, OWASP." },
    { num: 17, name: "Deployment Agent", role: "Docker, Docker Compose, CI/CD, Cloud Architecture, Monitoring." },
    { num: 18, name: "Finance Agent", role: "Development cost, Infrastructure cost, Break-even, ROI, Budget estimation." },
    { num: 19, name: "Marketing Agent", role: "Marketing channels, Branding, Social media, Email campaigns, Launch strategy." },
    { num: 20, name: "SEO Agent", role: "Keywords, Metadata, Content strategy, Technical SEO." },
    { num: 21, name: "Risk Analysis Agent", role: "Technical risks, Business risks, Market risks, Mitigation plan." },
    { num: 22, name: "Roadmap Agent", role: "Timeline, Milestones, Sprint Planning, Gantt roadmap." },
    { num: 23, name: "Investor Pitch Agent", role: "Problem, Solution, Market, Business Model, Revenue, Funding, Pitch Deck." },
    { num: 24, name: "Report Generator Agent", role: "Dashboard, PDF, PowerPoint, Word, Markdown, JSON." }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-3xl border border-border shadow-soft flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-heading flex items-center gap-2">
            <Cpu className="w-6 h-6 text-primary" /> 24 Specialized AI Agents
          </h1>
          <p className="text-sm text-muted mt-1">
            Independent domain-expert modules coordinated by the LangGraph Master Orchestrator.
          </p>
        </div>
        <div className="px-4 py-2 rounded-2xl bg-indigo-50 text-primary text-xs font-bold uppercase border border-indigo-100">
          100% Operational
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map((agent) => (
          <div key={agent.num} className="bg-card p-5 rounded-3xl border border-border shadow-soft space-y-2 hover:border-primary/50 transition">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center">
                #{agent.num}
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="font-bold text-heading text-sm">{agent.name}</h3>
            <p className="text-xs text-muted leading-relaxed">{agent.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
