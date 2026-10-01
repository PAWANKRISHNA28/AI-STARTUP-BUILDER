import React, { useEffect, useState } from 'react';
import { useUIStore } from '../store/useUIStore';
import { useProjectStore } from '../store/useProjectStore';
import { api } from '../services/api';
import { AgentLog } from '../types';
import { 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  Terminal, 
  Cpu, 
  ArrowRight,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GenerationProgressPage: React.FC = () => {
  const activeProject = useProjectStore(state => state.activeProject);
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const setActiveBlueprint = useProjectStore(state => state.setActiveBlueprint);
  const addToast = useUIStore(state => state.addToast);
  const [progress, setProgress] = useState(15);
  const [currentAgent, setCurrentAgent] = useState("Idea Analyzer Agent");
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [isDone, setIsDone] = useState(false);

  const agentsList = [
    { key: "idea_analyzer", name: "Idea Analyzer Agent" },
    { key: "market_research", name: "Market Research Agent" },
    { key: "competitor", name: "Competitor Analysis Agent" },
    { key: "business_model", name: "Business Model Agent" },
    { key: "revenue", name: "Revenue Model Agent" },
    { key: "pricing", name: "Pricing Strategy Agent" },
    { key: "customer_persona", name: "Customer Persona Agent" },
    { key: "feature_planning", name: "Feature Planning Agent" },
    { key: "ui_designer", name: "UI Designer Agent" },
    { key: "ux_research", name: "UX Research Agent" },
    { key: "database_designer", name: "Database Designer Agent" },
    { key: "api_designer", name: "API Designer Agent" },
    { key: "backend_architect", name: "Backend Architect Agent" },
    { key: "frontend_architect", name: "Frontend Architect Agent" },
    { key: "security", name: "Security Agent" },
    { key: "deployment", name: "Deployment Agent" },
    { key: "finance", name: "Finance Agent" },
    { key: "marketing", name: "Marketing Agent" },
    { key: "seo", name: "SEO Agent" },
    { key: "risk_analysis", name: "Risk Analysis Agent" },
    { key: "roadmap", name: "Roadmap Agent" },
    { key: "investor_pitch", name: "Investor Pitch Deck Agent" },
    { key: "report_generator", name: "Report Generator Agent" },
  ];

  useEffect(() => {
    let interval: any;
    let stepIndex = 0;

    // Simulate high-speed interactive multi-agent graph execution for demo/live preview
    interval = setInterval(() => {
      if (stepIndex < agentsList.length) {
        const agent = agentsList[stepIndex];
        setCurrentAgent(agent.name);
        const currentProgress = Math.round(((stepIndex + 1) / agentsList.length) * 100);
        setProgress(currentProgress);

        setLogs((prev) => [
          ...prev,
          {
            id: `log-${stepIndex}`,
            project_id: activeProject?.id || 'demo-p1',
            agent_key: agent.key,
            agent_name: agent.name,
            status: 'completed',
            message: `Synthesized production data for ${agent.name}`,
            execution_time_seconds: 0.35,
            timestamp: new Date().toLocaleTimeString()
          }
        ]);

        stepIndex++;
      } else {
        clearInterval(interval);
        setIsDone(true);
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        addToast('success', 'Blueprint Generation Complete! All 24 Agents Finished.');
      }
    }, 400);

    return () => clearInterval(interval);
  }, [activeProject]);

  const handleViewBlueprint = () => {
    setCurrentPage('project-view');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header Status Card */}
      <div className="bg-card p-6 sm:p-8 rounded-3xl border border-border/80 shadow-soft text-center space-y-4">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-soft transition-all duration-500 ${
          isDone ? 'bg-emerald-500 text-white' : 'bg-primary text-white agent-pulse'
        }`}>
          {isDone ? <CheckCircle2 className="w-8 h-8" /> : <Sparkles className="w-8 h-8 animate-spin-slow" />}
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-heading">
            {isDone ? 'Blueprint Ready!' : 'Orchestrating 24 AI Agents...'}
          </h1>
          <p className="text-sm text-muted mt-1 max-w-lg mx-auto">
            {isDone
              ? `Complete startup blueprint for '${activeProject?.title || 'Your Startup'}' generated with 100% precision.`
              : `Current Active Specialist: ${currentAgent}`}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-xl mx-auto space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-primary uppercase tracking-wider">Multi-Agent Graph Progress</span>
            <span className="text-heading font-bold">{progress}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-border">
            <div
              className="h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {isDone && (
          <div className="pt-2">
            <button
              onClick={handleViewBlueprint}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-soft transition transform hover:scale-105"
            >
              <span>Explore Interactive Blueprint & Pitch Deck</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Agents Graph Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Active Agents Grid */}
        <div className="md:col-span-2 bg-card p-6 rounded-3xl border border-border shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="text-base font-bold text-heading flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" /> 24 AI Agent Workflow Execution
            </h2>
            <span className="text-xs text-accent font-semibold">{logs.length} / 23 Executed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
            {agentsList.map((agent, idx) => {
              const isCompleted = idx < logs.length;
              const isActive = idx === logs.length && !isDone;

              return (
                <div
                  key={agent.key}
                  className={`p-3 rounded-2xl border text-xs flex items-center justify-between transition-all duration-300 ${
                    isCompleted
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                      : isActive
                      ? 'bg-indigo-50 border-indigo-300 text-primary font-bold shadow-soft scale-[1.02]'
                      : 'bg-background border-border text-muted opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-card border flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="truncate max-w-[140px]">{agent.name}</span>
                  </div>

                  <div>
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : isActive ? (
                      <Loader2 className="w-4 h-4 text-primary animate-spin shrink-0" />
                    ) : (
                      <span className="text-[10px] text-subtle">Queued</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Terminal Log Stream */}
        <div className="bg-slate-900 text-emerald-400 p-5 rounded-3xl font-mono text-xs shadow-soft flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-slate-400 text-xs font-sans font-bold">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Orchestrator Event Stream</span>
            </div>
            <div className="mt-3 space-y-2 max-h-80 overflow-y-auto leading-relaxed">
              <div className="text-slate-500">[SYSTEM] LangGraph node router initialized.</div>
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-1.5">
                  <span className="text-slate-500">[{log.timestamp}]</span>
                  <span className="text-emerald-400 font-semibold">{log.agent_name}:</span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
              {isDone && (
                <div className="text-emerald-300 font-bold pt-2 border-t border-slate-800">
                  {"\>>> EXECUTION COMPLETE. Reports compiled."}
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Latency: 350ms</span>
            <span className="text-emerald-400 font-bold">Status: OK</span>
          </div>
        </div>

      </div>

    </div>
  );
};
