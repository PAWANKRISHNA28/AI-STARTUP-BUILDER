import React, { useState } from 'react';
import { m } from 'framer-motion';
import { useProjectStore } from '../store/useProjectStore';
import { useUIStore } from '../store/useUIStore';
import { api } from '../services/api';
import { Sparkles, ArrowRight, Lightbulb, Globe, DollarSign, Target, Code, Building, Cpu, Zap, Wand2 } from 'lucide-react';
import { AIIdeationModal } from '../components/AIIdeationModal';

export const CreateProjectPage: React.FC = () => {
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const setActiveProject = useProjectStore(state => state.setActiveProject);
  const addToast = useUIStore(state => state.addToast);
  const [loading, setLoading] = useState(false);
  const [isIdeationOpen, setIsIdeationOpen] = useState(false);


  const [title, setTitle] = useState("Food Delivery App for College Students");
  const [ideaDescription, setIdeaDescription] = useState(
    "A specialized campus food delivery platform connecting local college food spots with students. Features include group cart ordering, student discounts, and AI-driven meal recommendations based on budget and dietary preferences."
  );
  const [industry, setIndustry] = useState("FoodTech / Consumer Tech");
  const [country, setCountry] = useState("United States");
  const [budget, setBudget] = useState("$50k - $250k");
  const [businessType, setBusiness_type] = useState("B2C Marketplace");
  const [targetUsers, setTargetUsers] = useState("College Students & Young Adults");
  const [techPreference, setTechPreference] = useState("React Native / Python / PostgreSQL");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const project = await api.createProject({
        title, idea_description: ideaDescription, industry, country,
        budget, business_type: businessType, target_users: targetUsers,
        tech_preference: techPreference
      });

      const setActiveBlueprint = useProjectStore.getState().setActiveBlueprint;
      setActiveBlueprint(null);

      await api.triggerGeneration(project.id, ideaDescription);
      setActiveProject(project);
      addToast('success', 'Startup Project Created! Launching 24 AI Agents...');
      setCurrentPage('generation-progress');
    } catch (err: any) {
      addToast('error', err?.response?.data?.detail || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <m.div 
      className="max-w-4xl mx-auto space-y-8 p-6 lg:p-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "100px" }}
    >
      {/* Header */}
      <m.div variants={itemVariants} className="text-center space-y-4">
        <div className="w-16 h-16 rounded-[20px] bg-foreground text-background flex items-center justify-center mx-auto shadow-apple">
          <Sparkles className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Launch a New Startup
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-6">
          Describe your vision. Our 24-agent orchestration engine will autonomously build your business plan, pitch deck, wireframes, and architecture.
        </p>
        <button
          onClick={() => setIsIdeationOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-500/10 text-purple-500 font-bold text-sm hover:bg-purple-500 hover:text-white transition-colors"
        >
          <Wand2 className="w-4 h-4" />
          Generate Ideas with AI
        </button>
      </m.div>


      {/* Form Card */}
      <m.form 
        variants={itemVariants} 
        onSubmit={handleSubmit} 
        className="glass-panel p-8 md:p-10 rounded-[32px] border border-border/50 shadow-soft space-y-8"
      >
        <div className="space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-500" /> Startup Name
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. CampusBite - Food Delivery for Students"
              className="w-full px-5 py-4 rounded-2xl border border-border/50 bg-background/50 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>

          {/* Startup Idea Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> The Vision
            </label>
            <textarea
              required
              rows={5}
              value={ideaDescription}
              onChange={(e) => setIdeaDescription(e.target.value)}
              placeholder="Describe the core problem you are solving, your target audience, and the key features..."
              className="w-full px-5 py-4 rounded-2xl border border-border/50 bg-background/50 text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Configuration Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border/50">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" /> Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-border/50 bg-background/50 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option>FoodTech / Consumer Tech</option>
              <option>B2B SaaS / Enterprise</option>
              <option>HealthTech / Biotech</option>
              <option>FinTech / Crypto</option>
              <option>EdTech / E-Learning</option>
              <option>AI / Machine Learning</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Target Budget
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-border/50 bg-background/50 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option>$10k - $50k (Bootstrapped)</option>
              <option>$50k - $250k (Pre-Seed)</option>
              <option>$250k - $1M (Seed Round)</option>
              <option>$1M+ (Series A)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" /> Business Model
            </label>
            <select
              value={businessType}
              onChange={(e) => setBusiness_type(e.target.value)}
              className="w-full px-5 py-4 rounded-2xl border border-border/50 bg-background/50 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option>B2C Marketplace</option>
              <option>B2B SaaS Subscription</option>
              <option>Freemium Consumer App</option>
              <option>Transactional Commission</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-rose-500" /> Tech Stack
            </label>
            <input
              type="text"
              value={techPreference}
              onChange={(e) => setTechPreference(e.target.value)}
              placeholder="e.g. Next.js, Node, PostgreSQL"
              className="w-full px-5 py-4 rounded-2xl border border-border/50 bg-background/50 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border border-border/50">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>24 Autonomous Agents will execute this build</span>
          </div>

          <m.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-foreground text-background text-sm font-bold shadow-apple disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <span>{loading ? 'Initializing Engine...' : 'Generate Startup'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </m.button>
        </div>
      </m.form>

      <AIIdeationModal
        isOpen={isIdeationOpen}
        onClose={() => setIsIdeationOpen(false)}
        onSelectIdea={(idea) => {
          setTitle(idea.name);
          setIdeaDescription(idea.description + " Target Audience: " + idea.target_audience);
          setIndustry(idea.industry);
          addToast('success', 'Project details auto-filled from AI concept!');
        }}
      />
    </m.div>
  );
};
