export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  api_key?: string | null;
  usage_limit: number;
  subscription_status: string;
  created_at: string;
  // Onboarding fields
  onboardingCompleted?: boolean;
  industries?: string[];
  aiPreference?: string;
  notificationSettings?: Record<string, boolean>;
  workspacePreferences?: {
    language: string;
    currency: string;
    country: string;
    theme: string;
    timezone: string;
  };
}

export interface ProjectTag {
  id: string;
  project_id: string;
  name: string;
  color: string;
}

export interface SharedProject {
  id: string;
  project_id: string;
  user_email: string;
  role: 'viewer' | 'editor' | 'admin';
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  idea_description: string;
  industry: string;
  country: string;
  budget: string;
  business_type: string;
  target_users: string;
  tech_preference: string;
  status: 'draft' | 'generating' | 'completed' | 'failed';
  progress: number;
  current_agent: string;
  favorite: boolean;
  pinned: boolean;
  last_opened: string;
  last_active_tab: string;
  
  // New management fields
  is_archived: boolean;
  deleted_at: string | null;
  view_count: number;
  use_count: number;
  estimated_completion: string | null;
  keywords: string | null;
  
  owner_id: string;
  created_at: string;
  updated_at: string;
  
  // Nested
  tags: ProjectTag[];
  shares: SharedProject[];
}

export interface ProjectChat {
  id: string;
  project_id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
}

export interface Comment {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  content: string;
  created_at: string;
}

export interface ProjectVersion {
  id: string;
  project_id: string;
  version_number: number;
  name: string;
  data: BlueprintData;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  project_id: string;
  activity_type: string;
  description: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'completion' | 'error' | 'comment' | 'share' | 'general';
  read: boolean;
  created_at: string;
}

export interface Analytics {
  projects_created: number;
  reports_generated: number;
  most_used_industry: string;
  average_generation_time_seconds: number;
  total_ai_requests: number;
  favorite_projects_count: number;
  agent_performance: Array<{ agent: string; accuracy: number; speed: string }>;
  weekly_usage: Array<{ day: string; requests: number }>;
  monthly_usage: Array<{ month: string; projects: number; reports: number }>;
}

export interface AgentLog {
  id: string;
  project_id: string;
  agent_key: string;
  agent_name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  message: string;
  execution_time_seconds: number;
  timestamp: string;
}

export interface GenerationStatus {
  project_id: string;
  status: string;
  progress: number;
  current_agent: string;
  logs: AgentLog[];
}

export interface PitchDeckSlide {
  slide: number;
  title: string;
  content: string;
  sub?: string;
}

export interface BlueprintData {
  meta?: {
    title: string;
    idea: string;
    industry: string;
    country: string;
    budget: string;
    business_type: string;
    target_users: string;
    tech_preference: string;
    generated_at: string;
  };
  idea_analyzer?: {
    validation_score: number;
    problem_statement: string;
    solution_overview: string;
    innovation_score: string;
    unique_value_proposition: string;
    market_viability: string;
    key_differentiators: string[];
  };
  market_research?: {
    industry_growth_rate: string;
    tam: string;
    sam: string;
    som: string;
    market_trends: string[];
    demand_analysis: string;
  };
  competitor?: {
    top_competitors: Array<{ name: string; market_share: string; weakness: string }>;
    gap_analysis: string;
    competitive_advantage: string[];
  };
  business_model?: {
    key_partners: string[];
    key_activities: string[];
    value_propositions: string;
    customer_relationships: string;
    customer_segments: string[];
    key_resources: string[];
    channels: string[];
    cost_structure: string[];
    revenue_streams: string[];
  };
  revenue?: {
    primary_model: string;
    revenue_drivers: string[];
    projected_mrr_year1: string;
    projected_arr_year3: string;
    gross_margin: string;
  };
  pricing?: {
    tiers: Array<{ name: string; price: string; features: string[] }>;
    annual_discount: string;
  };
  customer_persona?: {
    persona_name: string;
    age: number;
    role: string;
    pain_points: string[];
    goals: string[];
    user_journey: string[];
  };
  feature_planning?: {
    mvp_features: string[];
    v2_roadmap_features: string[];
  };
  ui_designer?: {
    design_system: Record<string, string>;
    wireframe_layouts: Array<{ screen: string; layout: string }>;
  };
  ux_research?: {
    key_insights: string;
    accessibility: string;
    user_flow: string;
  };
  database_designer?: {
    tables: Array<{ name: string; columns: string[] }>;
    sql_schema: string;
  };
  api_designer?: {
    base_url: string;
    endpoints: Array<{ method: string; path: string; summary: string }>;
  };
  backend_architect?: {
    architecture: string;
    folder_structure: string;
    patterns: string[];
  };
  frontend_architect?: {
    framework: string;
    styling: string;
    state_management: string;
    animations: string;
  };
  security?: {
    authentication: string;
    authorization: string;
    owasp_mitigations: string[];
  };
  deployment?: {
    containerization: string;
    orchestration: string;
    ci_cd: string;
    cloud_provider: string;
  };
  finance?: {
    initial_build_cost: string;
    monthly_server_infra: string;
    break_even_timeline: string;
    roi_year3: string;
  };
  marketing?: {
    launch_strategy: string;
    content_channels: string[];
    cac_target: string;
    ltv_target: string;
  };
  seo?: {
    target_keywords: string[];
    meta_title: string;
    meta_description: string;
  };
  risk_analysis?: {
    risks: Array<{ category: string; risk: string; mitigation: string }>;
  };
  roadmap?: {
    timeline_months: number;
    milestones: Array<{ phase: string; goal: string }>;
  };
  investor_pitch?: {
    slides: PitchDeckSlide[];
  };
}

export interface Blueprint {
  id: string;
  project_id: string;
  data: BlueprintData;
  pdf_file?: string;
  ppt_file?: string;
  docx_file?: string;
  created_at: string;
}

// -----------------------------------------------------------------------------
// VISUALIZATION STUDIO TYPES
// -----------------------------------------------------------------------------

export interface VisualizationProject {
  id: string;
  project_id: string;
  business_type?: string;
  business_name?: string;
  brand_style?: string;
  budget?: string;
  target_audience?: string;
  store_size?: string;
  number_of_floors?: number;
  preferred_theme?: string;
  color_palette?: string[];
  furniture_style?: string;
  lighting_style?: string;
  outdoor_seating?: boolean;
  parking_requirement?: boolean;
  garden?: boolean;
  drive_through?: boolean;
  accessibility_features?: boolean;
  created_at: string;
}

export interface VisualizationImage {
  id: string;
  visualization_project_id: string;
  concept_name: string;
  view_type: string;
  image_url: string;
  style?: string;
  created_at: string;
}

export interface DesignReport {
  id: string;
  visualization_project_id: string;
  design_summary?: string;
  business_theme?: string;
  architecture_style?: string;
  color_palette?: string[];
  material_suggestions?: string[];
  furniture_suggestions?: string[];
  lighting_suggestions?: string[];
  branding_suggestions?: string[];
  smart_suggestions?: string[];
  created_at: string;
}

export interface BrandStyle {
  id: string;
  visualization_project_id: string;
  store_logo_placement?: string;
  sign_board?: string;
  menu_board?: string;
  reception_branding?: string;
  employee_uniform_colors?: string[];
  packaging_style?: string;
  business_cards?: string;
  created_at: string;
}

export interface FavoriteDesign {
  id: string;
  user_id: string;
  visualization_image_id: string;
  notes?: string;
  created_at: string;
}

export interface VisualizationResponse {
  project: VisualizationProject;
  images: VisualizationImage[];
  report: DesignReport | null;
  brand_style: BrandStyle | null;
}
