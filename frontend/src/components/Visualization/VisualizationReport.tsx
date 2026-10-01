import React from 'react';
import { DesignReport, BrandStyle } from '../../types';
import { FileText, Brush, Sparkles, Building, Briefcase, Palette } from 'lucide-react';

interface Props {
  report: DesignReport | null;
  brand: BrandStyle | null;
}

export const VisualizationReport: React.FC<Props> = ({ report, brand }) => {
  if (!report && !brand) return null;

  return (
    <div className="space-y-6">
      {/* Design Report */}
      {report && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50">
          <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
            <FileText className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">AI Design Report</h3>
          </div>
          
          <div className="mb-6 bg-primary/5 p-4 rounded-xl border border-primary/10 text-primary-foreground font-medium">
            <p>{report.design_summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <Building className="w-4 h-4" /> Core Theme
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Theme</p>
                    <p className="font-medium">{report.business_theme}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg">
                    <p className="text-xs text-muted-foreground">Style</p>
                    <p className="font-medium">{report.architecture_style}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  <Palette className="w-4 h-4" /> Color Palette
                </h4>
                <div className="flex gap-2">
                  {report.color_palette?.map(color => (
                    <div 
                      key={color} 
                      className="w-10 h-10 rounded-full shadow-inner border border-border"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
               <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Materials</h4>
                <div className="flex flex-wrap gap-2">
                  {report.material_suggestions?.map(m => <span key={m} className="px-3 py-1 bg-muted/50 rounded-full text-sm font-medium">{m}</span>)}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Lighting</h4>
                <div className="flex flex-wrap gap-2">
                  {report.lighting_suggestions?.map(l => <span key={l} className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">{l}</span>)}
                </div>
              </div>
            </div>
          </div>

          {report.smart_suggestions && report.smart_suggestions.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border/50">
               <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  <Sparkles className="w-4 h-4 text-amber-500" /> AI Smart Suggestions
                </h4>
                <ul className="space-y-3">
                  {report.smart_suggestions.map((s, idx) => (
                    <li key={idx} className="flex gap-3 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                      <span className="text-amber-500 font-bold">{idx + 1}.</span>
                      <span className="text-sm">{s}</span>
                    </li>
                  ))}
                </ul>
            </div>
          )}
        </div>
      )}

      {/* Branding */}
      {brand && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border/50">
          <div className="flex items-center gap-2 mb-6 border-b border-border/50 pb-4">
            <Brush className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-bold">Business Branding</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Logo Placement</span>
              <p className="font-medium text-sm">{brand.store_logo_placement}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Sign Board</span>
              <p className="font-medium text-sm">{brand.sign_board}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Menu Board</span>
              <p className="font-medium text-sm">{brand.menu_board}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Reception</span>
              <p className="font-medium text-sm">{brand.reception_branding}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Packaging</span>
              <p className="font-medium text-sm">{brand.packaging_style}</p>
            </div>
             <div className="space-y-1">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Business Cards</span>
              <p className="font-medium text-sm">{brand.business_cards}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
