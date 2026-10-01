import React from 'react';
import { Sparkles, User } from 'lucide-react';
import { BusinessAnalysisCard } from './cards/BusinessAnalysisCard';
import { LocationCard } from './cards/LocationCard';
import { CompetitorCard } from './cards/CompetitorCard';
import { FinancialCard } from './cards/FinancialCard';
import { VisualizationCard } from './cards/VisualizationCard';
import { WorkspaceTabsCard } from './cards/WorkspaceTabsCard';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content?: string;
  cards?: string[]; // e.g., ['business-analysis', 'location', 'financial']
}

export const ChatMessage: React.FC<ChatMessageProps> = React.memo(({ role, content, cards }) => {
  const isUser = role === 'user';

  return (
    <div className={`py-4 flex w-full max-w-4xl mx-auto px-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex gap-4 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-secondary to-pink-accent text-white flex items-center justify-center shadow-lg shadow-secondary/30">
              <User className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-sky flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="w-5 h-5" />
            </div>
          )}
        </div>
        
        {/* Message Bubble */}
        <div className="flex-1 space-y-4">
          {content && (
            <div className={`p-5 rounded-[24px] shadow-premium backdrop-blur-[30px] border ${
              isUser 
                ? 'bg-secondary/40 text-white border-secondary/40 rounded-tr-sm shadow-[0_8px_32px_rgba(139,92,246,0.3)]' 
                : 'bg-primary/20 text-heading border-primary/30 rounded-tl-sm shadow-[0_8px_32px_rgba(91,140,255,0.2)]'
            }`}>
              <div className="text-[15px] leading-relaxed whitespace-pre-wrap font-medium">
                {content}
              </div>
            </div>
          )}
          
          {/* Dashboard Cards (AI Only) */}
          {!isUser && cards && cards.length > 0 && (
            <div className="flex flex-wrap gap-4 items-start mt-4">
              {cards.includes('business-analysis') && <BusinessAnalysisCard />}
              {cards.includes('location') && <LocationCard />}
              {cards.includes('competitor') && <CompetitorCard />}
              {cards.includes('financial') && <FinancialCard />}
              {cards.includes('visualization') && <VisualizationCard />}
              {cards.includes('workspace-tabs') && <WorkspaceTabsCard />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
