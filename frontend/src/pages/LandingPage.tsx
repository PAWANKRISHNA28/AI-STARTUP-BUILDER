import React, { useState, memo } from 'react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Sparkles, ArrowRight, Brain, UploadCloud, Mic, MapPin, 
  Lightbulb, ChevronDown, CheckCircle2, Moon, Sun, 
  Users, Rocket, Globe2, Target, Star,
  LineChart, FileSpreadsheet, Layers, ShieldCheck, Zap,
  Database, Server, Presentation, FileText, Activity, TrendingUp, Play
} from 'lucide-react';

const TopNav = memo(({ isDarkMode, setIsDarkMode }: any) => {
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`sticky top-0 z-50 px-6 py-4 flex items-center justify-between ${isDarkMode ? 'bg-gray-900/90 backdrop-blur-sm border-b border-gray-800' : 'bg-white/90 backdrop-blur-sm border-b border-gray-100'}`}>
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('landing')}>
        <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white font-bold">
           <Layers className="w-5 h-5" />
        </div>
        <span className="font-display font-bold text-lg tracking-tight">AI STARTUP <span className="text-orange-700 font-black">BUILDER</span></span>
      </div>
      
      <div className="hidden lg:flex items-center gap-8 font-medium text-sm">
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition" aria-label="Toggle theme">
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button onClick={() => setCurrentPage('login')} className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-400 to-purple-500 text-white font-bold text-sm hover:shadow-md hover:scale-105 transition transform flex items-center gap-2">
          Sign In
        </button>
      </div>
    </nav>
  );
});

const HeroSection = memo(({ isDarkMode, handleBuildStartup, handleAdvancedInput, sampleIdea, setSampleIdea }: any) => {
  return (
    <section id="product" className="relative pt-20 pb-24 px-6 max-w-[90rem] mx-auto grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest shadow-sm">
          <Sparkles className="w-4 h-4" />
          POWERED BY 24 SPECIALIZED AI AGENTS
        </div>

        <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tight leading-[1.1]">
          Transform Startup<br />Ideas into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Investor-Ready</span> <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Blueprints</span>
        </h1>

        <p className="text-lg lg:text-xl text-gray-500 dark:text-gray-500 font-medium max-w-xl leading-relaxed">
          AI Startup Builder coordinates 24 AI specialists to automatically analyze market sizes, write database DDLs, design UI wireframes, estimate ROI, and export investor pitch decks in seconds.
        </p>

        <div className="space-y-4">
          <div className={`p-2 rounded-[2.5rem] shadow-md border flex flex-wrap sm:flex-nowrap items-center gap-2 max-w-2xl ${isDarkMode ? 'bg-gray-800 border-gray-700 shadow-black/40' : 'bg-white border-gray-200 shadow-gray-200/50'}`}>
            <div className="pl-4 pr-2 text-yellow-500 shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={sampleIdea}
              onChange={(e) => setSampleIdea(e.target.value)}
              placeholder="Describe your startup idea..."
              className="flex-1 min-w-[200px] bg-transparent border-none text-base font-medium focus:outline-none focus:ring-0 p-2"
            />
            <button
              onClick={handleBuildStartup}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold shadow-md transition transform hover:scale-[1.02] shrink-0"
            >
              <span>Build Startup Now</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3 max-w-2xl">
            <button onClick={() => handleAdvancedInput('Upload Pitch')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition hover:bg-gray-100 dark:hover:bg-gray-800 ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
              <UploadCloud className="w-4 h-4 text-blue-500" /> Upload Pitch
            </button>
            <button onClick={() => handleAdvancedInput('Voice Input')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition hover:bg-gray-100 dark:hover:bg-gray-800 ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
              <Mic className="w-4 h-4 text-purple-500" /> Voice Input
            </button>
            <button onClick={() => handleAdvancedInput('Location Data')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition hover:bg-gray-100 dark:hover:bg-gray-800 ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
              <MapPin className="w-4 h-4 text-green-500" /> Location
            </button>
            <button onClick={() => handleAdvancedInput('AI Suggestions')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition hover:bg-gray-100 dark:hover:bg-gray-800 ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
              <Sparkles className="w-4 h-4 text-orange-500" /> AI Suggestions
            </button>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium mt-6">
            <span className="flex items-center gap-1.5 text-gray-500">✨ Try example: "AI Food Delivery App for College Students"</span>
            <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Free Demo Access
            </span>
          </div>
        </div>
      </div>

      <div className="relative h-[600px] w-full hidden lg:block">
         <div className="absolute inset-0 flex items-center justify-center">
           <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 shadow-xl flex items-center justify-center border-4 border-white dark:border-gray-800 z-20">
             <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center">
               <Brain className="w-12 h-12 text-blue-600 dark:text-blue-300" />
             </div>
             <div className="absolute inset-0 rounded-full border border-blue-200 dark:border-blue-800/50 scale-[1.5]"></div>
             <div className="absolute inset-0 rounded-full border border-blue-200 dark:border-blue-800/50 scale-[2.2]"></div>
             <div className="absolute inset-0 rounded-full border border-blue-200 dark:border-blue-800/50 scale-[3]"></div>
           </div>

           <div className="absolute inset-0 z-30">
             <div className={`absolute top-[5%] left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
               <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/40 flex items-center justify-center"><Activity className="w-5 h-5 text-teal-500"/></div>
               <div>
                 <div className="font-bold text-sm">Idea Analyzer</div>
                 <div className="text-[10px] text-gray-500">Ready</div>
               </div>
             </div>
             
             <div className={`absolute top-[20%] right-[5%] flex items-center gap-3 p-3 rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
               <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/40 flex items-center justify-center"><LineChart className="w-5 h-5 text-purple-500"/></div>
               <div>
                 <div className="font-bold text-sm">Market Research</div>
                 <div className="text-[10px] text-gray-500">Ready</div>
               </div>
             </div>

             <div className={`absolute top-1/2 -translate-y-1/2 right-[-5%] flex items-center gap-3 p-3 rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
               <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/40 flex items-center justify-center"><Target className="w-5 h-5 text-orange-500"/></div>
               <div>
                 <div className="font-bold text-sm">Finance Agent</div>
                 <div className="text-[10px] text-gray-500">Ready</div>
               </div>
             </div>

             <div className={`absolute bottom-[20%] right-[10%] flex items-center gap-3 p-3 rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
               <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-900/40 flex items-center justify-center"><Layers className="w-5 h-5 text-pink-500"/></div>
               <div>
                 <div className="font-bold text-sm">UI/UX Agent</div>
                 <div className="text-[10px] text-gray-500">Ready</div>
               </div>
             </div>

             <div className={`absolute bottom-[5%] left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
               <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/40 flex items-center justify-center"><Server className="w-5 h-5 text-blue-500"/></div>
               <div>
                 <div className="font-bold text-sm">Backend Planner</div>
                 <div className="text-[10px] text-gray-500">Ready</div>
               </div>
             </div>

             <div className={`absolute bottom-[25%] left-[5%] flex items-center gap-3 p-3 rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
               <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/40 flex items-center justify-center"><TrendingUp className="w-5 h-5 text-green-500"/></div>
               <div>
                 <div className="font-bold text-sm">Marketing Agent</div>
                 <div className="text-[10px] text-gray-500">Ready</div>
               </div>
             </div>

             <div className={`absolute top-[40%] left-[-10%] flex items-center gap-3 p-3 rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
               <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/40 flex items-center justify-center"><Database className="w-5 h-5 text-amber-500"/></div>
               <div>
                 <div className="font-bold text-sm">Database Designer</div>
                 <div className="text-[10px] text-gray-500">Ready</div>
               </div>
             </div>

             <div className={`absolute top-[15%] left-[5%] flex items-center gap-3 p-3 rounded-2xl shadow-md border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
               <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center"><Presentation className="w-5 h-5 text-indigo-500"/></div>
               <div>
                 <div className="font-bold text-sm">Pitch Deck Agent</div>
                 <div className="text-[10px] text-gray-500">Ready</div>
               </div>
             </div>
           </div>
         </div>

         <div className={`absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-[90%] max-w-md p-4 rounded-2xl shadow-lg border flex items-center justify-between ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <span className="text-xs font-bold uppercase tracking-wider text-gray-500">System Ready</span>
           </div>
           <div className="text-xs font-semibold text-gray-500">24 Agents Standby</div>
         </div>
      </div>
    </section>
  );
});

const StatsSection = memo(({ isDarkMode }: { isDarkMode: boolean }) => (
  <section id="startups" className={`py-12 border-y ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
    <div className="max-w-[90rem] mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 divide-x divide-gray-100 dark:divide-gray-800">
      <div className="flex items-center gap-4 px-4">
        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700"><Users className="w-6 h-6" /></div>
        <div>
          <div className="text-2xl font-black">24</div>
          <div className="text-sm font-bold text-gray-500">AI Agents</div>
          <div className="text-xs text-gray-500">Working for you</div>
        </div>
      </div>
      <div className="flex items-center gap-4 px-4">
        <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600"><Rocket className="w-6 h-6" /></div>
        <div>
          <div className="text-2xl font-black">120K+</div>
          <div className="text-sm font-bold text-gray-500">Startups Generated</div>
          <div className="text-xs text-gray-500">By our platform</div>
        </div>
      </div>
      <div className="flex items-center gap-4 px-4">
        <div className="w-12 h-12 rounded-full bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600"><Globe2 className="w-6 h-6" /></div>
        <div>
          <div className="text-2xl font-black">18</div>
          <div className="text-sm font-bold text-gray-500">Languages</div>
          <div className="text-xs text-gray-500">Supported</div>
        </div>
      </div>
      <div className="flex items-center gap-4 px-4">
        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600"><Target className="w-6 h-6" /></div>
        <div>
          <div className="text-2xl font-black">98%</div>
          <div className="text-sm font-bold text-gray-500">Accuracy</div>
          <div className="text-xs text-gray-500">AI Predictions</div>
        </div>
      </div>
      <div className="flex items-center gap-4 px-4">
        <div className="w-12 h-12 rounded-full bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center text-pink-600"><Star className="w-6 h-6 fill-current" /></div>
        <div>
          <div className="text-2xl font-black">4.9/5</div>
          <div className="text-sm font-bold text-gray-500">User Rating</div>
          <div className="text-xs text-gray-500">From 10K+ users</div>
        </div>
      </div>
    </div>
  </section>
));

const FeatureGrid = memo(({ isDarkMode, quickDemoLogin }: any) => (
  <section id="agents" className="py-24 px-6 max-w-[90rem] mx-auto content-visibility-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-display font-black mb-4">
        Your Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">AI-Powered</span> Startup Team
      </h2>
      <p className="text-lg text-gray-500 font-medium">
        24 specialized AI agents working together to turn your idea into a successful business
      </p>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
      {[
        { icon: Lightbulb, title: "Idea Analyzer", desc: "Validates & enhances your startup idea", color: "teal" },
        { icon: LineChart, title: "Market Research", desc: "Analyzes market size, trends & opportunities", color: "purple" },
        { icon: Users, title: "Competitor Agent", desc: "Identifies competitors & gap analysis", color: "blue" },
        { icon: FileText, title: "Business Model", desc: "Creates revenue models & value proposition", color: "orange" },
        { icon: Layers, title: "UI/UX Designer", desc: "Designs beautiful UI wireframes", color: "pink" },
        { icon: Database, title: "Database Designer", desc: "Creates optimized database schemas", color: "emerald" },
        { icon: Server, title: "Backend Architect", desc: "Plans APIs & system architecture", color: "indigo" },
        { icon: TrendingUp, title: "Investor Pitch", desc: "Generates pitch deck & financials", color: "red" }
      ].map((feature, i) => {
        const Icon = feature.icon;
        return (
          <div key={i} className={`p-6 rounded-[2rem] border transition hover:shadow-md ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
            <div className={`w-12 h-12 rounded-xl bg-${feature.color}-50 dark:bg-${feature.color}-900/30 flex items-center justify-center text-${feature.color}-600 mb-6`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
          </div>
        );
      })}
    </div>

    <div className="mt-12 text-center">
      <button onClick={quickDemoLogin} className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full font-bold border transition ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:bg-gray-700 text-indigo-400' : 'bg-white border-indigo-100 hover:bg-indigo-50 text-indigo-600 shadow-sm'}`}>
        Explore All 24 Agents <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  </section>
));

const StepsSection = memo(({ isDarkMode }: { isDarkMode: boolean }) => (
  <section id="resources" className={`py-24 content-visibility-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
    <div className="max-w-[90rem] mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-display font-black mb-4">From Idea to Launch in Minutes</h2>
      </div>
      
      <div className="relative flex flex-col md:flex-row justify-between items-start max-w-6xl mx-auto gap-8">
         <div className="absolute top-8 left-10 right-10 h-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
         
         {[
           { icon: Lightbulb, title: "Describe Idea", desc: "Share your startup idea in simple words", color: "teal" },
           { icon: Brain, title: "AI Analysis", desc: "24 AI agents analyze & validate the idea", color: "purple" },
           { icon: FileText, title: "Generate Blueprint", desc: "Get full business plan, designs & tech stack", color: "orange" },
           { icon: Rocket, title: "Build & Launch", desc: "Build your startup with confidence", color: "blue" },
           { icon: TrendingUp, title: "Grow & Scale", desc: "AI continues to optimize your growth", color: "pink" }
         ].map((step, i) => {
           const Icon = step.icon;
           return (
             <div key={i} className="relative flex flex-col items-center text-center max-w-[200px] mx-auto z-10">
               <div className={`w-16 h-16 rounded-full bg-${step.color}-100 dark:bg-${step.color}-900/50 flex items-center justify-center text-${step.color}-600 mb-4 shadow-sm border-4 border-white dark:border-gray-900`}>
                 <Icon className="w-8 h-8" />
               </div>
               <div className={`w-8 h-8 rounded-full bg-white dark:bg-gray-800 text-${step.color}-600 font-bold border border-gray-200 dark:border-gray-700 flex items-center justify-center absolute top-12 shadow-sm`}>{i + 1}</div>
               <h3 className="font-bold text-lg mt-4 mb-2">{step.title}</h3>
               <p className="text-sm text-gray-500">{step.desc}</p>
             </div>
           );
         })}
      </div>
    </div>
  </section>
));

const CTABanner = memo(({ isDarkMode, quickDemoLogin }: any) => (
  <section id="pricing" className="py-24 px-6 max-w-[90rem] mx-auto content-visibility-auto">
    <div className="rounded-[3rem] bg-gradient-to-r from-orange-50 via-purple-50 to-blue-50 dark:from-orange-900/20 dark:via-purple-900/20 dark:to-blue-900/20 overflow-hidden relative shadow-md">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="relative z-10 grid lg:grid-cols-3 gap-12 items-center p-12 lg:p-20">
        
        <div className="hidden lg:flex items-center justify-center relative">
           <div className="absolute w-64 h-64 bg-gradient-to-tr from-orange-400 to-purple-500 rounded-full blur-2xl opacity-10"></div>
           <Rocket className="w-48 h-48 text-orange-500 drop-shadow-xl relative z-10 transform -rotate-12 hover:rotate-0 transition duration-500" />
        </div>

        <div className="lg:col-span-1 text-center lg:text-left space-y-6">
          <h2 className="text-4xl lg:text-5xl font-display font-black tracking-tight leading-tight">
            Ready to Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Dream Startup?</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join thousands of founders who are building the future with AI Startup Builder. Your idea is just one click away from reality.
          </p>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
            <button
              onClick={quickDemoLogin}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-md hover:shadow-lg transition transform hover:scale-105 flex items-center gap-2"
            >
              Start Building Now <Sparkles className="w-5 h-5" />
            </button>
            <button onClick={quickDemoLogin} className="px-8 py-4 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition flex items-center gap-2">
              <Play className="w-5 h-5 text-indigo-500" /> Watch Demo
            </button>
          </div>
        </div>

        <div className="space-y-4 lg:pl-12">
           <div className={`p-4 rounded-2xl flex items-center gap-4 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
             <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600"><Rocket className="w-6 h-6"/></div>
             <div>
               <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Startups Built Today</div>
               <div className="text-xl font-black">342</div>
             </div>
           </div>
           
           <div className={`p-4 rounded-2xl flex items-center gap-4 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
             <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600"><Activity className="w-6 h-6"/></div>
             <div>
               <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Time Saved</div>
               <div className="text-xl font-black">12,540+ <span className="text-sm font-semibold text-gray-500">Hours</span></div>
             </div>
           </div>

           <div className={`p-4 rounded-2xl flex items-center gap-4 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
             <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700"><TrendingUp className="w-6 h-6"/></div>
             <div>
               <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Funding Raised</div>
               <div className="text-xl font-black text-emerald-700">$24.8M+</div>
             </div>
           </div>
        </div>
      </div>
    </div>
  </section>
));

export const LandingPage: React.FC = () => {
  const setCurrentPage = useUIStore(state => state.setCurrentPage);
  const setUser = useAuthStore(state => state.setUser);
  const setToken = useAuthStore(state => state.setToken);
  const addToast = useUIStore(state => state.addToast);
  
  const [sampleIdea, setSampleIdea] = useState("I want to build a Food Delivery App for College Students");
  const [isDarkMode, setIsDarkMode] = useState(false);

  const quickDemoLogin = React.useCallback(() => {
    setCurrentPage('register');
  }, [setCurrentPage]);

  const handleBuildStartup = React.useCallback(() => {
    if (sampleIdea.trim()) {
      sessionStorage.setItem('initialIdea', sampleIdea);
    }
    setCurrentPage('register');
  }, [sampleIdea, setCurrentPage]);

  const handleAdvancedInput = React.useCallback((feature: string) => {
    addToast('info', `Please log in to use ${feature}`);
    setCurrentPage('login');
  }, [addToast, setCurrentPage]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} font-sans overflow-x-hidden`}>
      <TopNav isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} quickDemoLogin={quickDemoLogin} />
      <HeroSection isDarkMode={isDarkMode} handleBuildStartup={handleBuildStartup} handleAdvancedInput={handleAdvancedInput} sampleIdea={sampleIdea} setSampleIdea={setSampleIdea} />
      <StatsSection isDarkMode={isDarkMode} />
      <FeatureGrid isDarkMode={isDarkMode} quickDemoLogin={quickDemoLogin} />
      <StepsSection isDarkMode={isDarkMode} />
      <CTABanner isDarkMode={isDarkMode} quickDemoLogin={quickDemoLogin} />
    </div>
  );
};
