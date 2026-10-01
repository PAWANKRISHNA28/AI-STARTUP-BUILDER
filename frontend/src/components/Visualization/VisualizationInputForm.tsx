import React, { useState } from 'react';
import { m } from 'framer-motion';
import { Building2, Palette, Sofa, Lightbulb, MapPin, CheckCircle, Loader2 } from 'lucide-react';

interface Props {
  onSubmit: (data: any) => void;
  isGenerating: boolean;
}

const STYLE_OPTIONS = ["Modern", "Luxury", "Minimal", "Industrial", "Classic", "Eco Friendly", "Traditional", "Futuristic", "Premium", "Scandinavian"];
const BUDGET_OPTIONS = ["$10k - $50k", "$50k - $200k", "$200k - $500k", "$500k+"];

export const VisualizationInputForm: React.FC<Props> = ({ onSubmit, isGenerating }) => {
  const [formData, setFormData] = useState({
    business_type: '',
    business_name: '',
    brand_style: 'Modern',
    budget: '$50k - $200k',
    target_audience: '',
    store_size: 'Medium (1000-3000 sq ft)',
    number_of_floors: 1,
    preferred_theme: '',
    furniture_style: '',
    lighting_style: '',
    outdoor_seating: false,
    parking_requirement: false,
    garden: false,
    drive_through: false,
    accessibility_features: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Business Requirements</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Business Name</label>
          <input
            type="text"
            name="business_name"
            required
            value={formData.business_name}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="e.g. Brew & Co."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Business Type</label>
          <input
            type="text"
            name="business_type"
            required
            value={formData.business_type}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="e.g. Coffee Shop, Retail Store"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Brand Style</label>
          <select
            name="brand_style"
            value={formData.brand_style}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {STYLE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Budget Estimate</label>
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {BUDGET_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="outdoor_seating" checked={formData.outdoor_seating} onChange={handleChange} className="rounded text-primary focus:ring-primary" />
          <span className="text-sm">Outdoor Seating</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="parking_requirement" checked={formData.parking_requirement} onChange={handleChange} className="rounded text-primary focus:ring-primary" />
          <span className="text-sm">Parking Area</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="garden" checked={formData.garden} onChange={handleChange} className="rounded text-primary focus:ring-primary" />
          <span className="text-sm">Garden</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" name="drive_through" checked={formData.drive_through} onChange={handleChange} className="rounded text-primary focus:ring-primary" />
          <span className="text-sm">Drive Through</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isGenerating}
        className="w-full py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Palette className="w-5 h-5" />}
        {isGenerating ? 'AI Agents Generating...' : 'Generate Visualization Concepts'}
      </button>
    </form>
  );
};
