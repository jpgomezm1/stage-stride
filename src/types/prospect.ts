export interface Prospect {
  id: string;
  company_name: string;
  contact_name: string;
  contact_email?: string;
  contact_phone?: string;
  first_contact_date: string;
  assigned_to: string;
  current_stage: number;
  stage_progress: any; // JSON field from Supabase
  is_lost: boolean;
  lost_reason?: string;
  priority_level: string; // Allowing string for DB compatibility
  estimated_value?: number;
  expected_close_date?: string;
  created_at: string;
  updated_at: string;
  last_action?: string;
  next_step?: string;
  tags?: string[];
}

export interface StageProgress {
  stage1?: Stage1Data;
  stage2?: Stage2Data;
  stage3?: Stage3Data;
  stage4?: Stage4Data;
  stage5?: Stage5Data;
}

export interface Stage1Data {
  business_analysis: string;
  digital_channels: string;
  tech_stack: string;
  pain_hypothesis: string;
  potential_use_case: string;
  direct_competitors: string;
  decision_maker: string;
  completed: boolean;
}

export interface Stage2Data {
  budget_range: string;
  authority_map: string;
  need_urgency: string;
  timeline: string;
  cultural_fit_score: number;
  friction_area: string;
  critical_processes: ProcessMapping[];
  secondary_pain_points: string[];
  urgency_score: number;
  urgency_justification: string;
  meeting_transcript?: string;
  follow_up_notes: string;
  qualification_score: number;
  completed: boolean;
}

export interface ProcessMapping {
  process: string;
  current_friction: string;
  impact_score: number;
  worth_intervening: boolean;
  priority: number;
}

export interface Stage3Data {
  project_phases: ProjectPhase[];
  solutions_table: SolutionMapping[];
  technical_dependencies: string;
  success_metrics: string;
  approval_status: 'approved' | 'pending' | 'rejected';
  sent_date?: string;
  client_feedback?: string;
  roadmap_versions: number;
  completed: boolean;
}

export interface ProjectPhase {
  name: string;
  timeline: string;
  description: string;
}

export interface SolutionMapping {
  process: string;
  proposed_solution: string;
  quantified_benefit: string;
  estimated_roi: string;
  implementation_time: string;
}

export interface Stage4Data {
  total_price: number;
  payment_structure: string;
  specific_deliverables: string[];
  commercial_conditions: string;
  proposal_alternatives: ProposalAlternative[];
  approval_status: 'approved' | 'in_review' | 'rejected';
  advance_paid: boolean;
  advance_amount?: number;
  advance_date?: string;
  closing_probability: number;
  decision_deadline?: string;
  completed: boolean;
}

export interface ProposalAlternative {
  name: string;
  price: number;
  description: string;
}

export interface Stage5Data {
  technical_session_date?: string;
  session_duration: string;
  meeting_link?: string;
  participants: string[];
  workflow_diagrams: string;
  tools_to_integrate: string[];
  technical_restrictions: string;
  validated_deliverables: string[];
  proposed_architecture: string;
  technical_approval: boolean;
  ready_for_implementation: boolean;
  completed: boolean;
}

export interface ProspectFile {
  id: string;
  prospect_id: string;
  stage: number;
  file_name: string;
  file_url: string;
  file_type?: string;
  uploaded_at: string;
}

export interface ProspectActivity {
  id: string;
  prospect_id: string;
  activity_type: string;
  description: string;
  stage?: number;
  created_by: string;
  created_at: string;
}

export const STAGE_NAMES = {
  1: 'Research Pre-Reunión',
  2: 'Reunión Inicial (BANT+)',
  3: 'Roadmap y Propuesta de Valor',
  4: 'Propuesta Económica',
  5: 'Levantamiento Técnico'
} as const;

export const PRIORITY_COLORS = {
  low: 'bg-info/10 text-info border-info/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20'
} as const;

export const STAGE_COLORS = {
  1: 'bg-blue-500',
  2: 'bg-yellow-500',
  3: 'bg-purple-500',
  4: 'bg-orange-500',
  5: 'bg-green-500'
} as const;