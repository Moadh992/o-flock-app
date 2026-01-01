
export type AppStep =
  | 'DISCLAIMER'
  | 'ONBOARDING'
  | 'ANALYSIS'
  | 'MISSION'
  | 'BLUEPRINT'
  | 'WELCOME'
  | 'REFLECTION'
  | 'LIFESTYLE';

export interface Option {
  label: string;
  value: string;
  subLabel?: string; // For extra context
  meta?: string; // For colors, font classes, etc.
}

export interface Question {
  id: string;
  type: 'text' | 'select' | 'card' | 'file';
  text: string;
  helperText?: string;
  options?: Option[];
}

export interface Section {
  id: number;
  title: string;
  description: string;
  questions: Question[];
}

export interface UserAnswers {
  [key: string]: string;
}

export interface UserComments {
  [key: string]: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  plan?: 'free' | 'pro';
  createdAt: string;
}

export interface SavedBlueprint {
  id: string;
  mission: Mission;
  blueprint: Blueprint;
  timestamp: string;
}

export interface PsychologicalProfile {
  dominantMotivations: string;
  psychologicalDrivers: string;
  fearPatterns: string;
  energySources: string;
  workingStyle: string;
  constraints: string;
  desireThemes: string;
  coreDesire: string; // Money, Impact, Respect, etc.
  summary: string;
}

export interface Mission {
  title: string;
  coreConcept: string;
  whyFitsYou: string;
  sustainability: string; // Why you will stick with it
  problemSolved: string;
  yourRole: string;
}

export interface ExecutionLayer {
  monetization: string;
  landingPageCopy: string;
  domainRecommendation: string;
  visualThemeInstructions: string;
}

export interface Blueprint {
  actionPlan: {
    week1: string[];
    week2: string[];
    week3: string[];
    week4: string[];
  };
  mvpPlan: string;
  marketingStrategy: string;
  branding: {
    nameSuggestions: string[];
    tagline: string;
    audienceAngle: string;
  };
  emotionalAnchor: string;
  executionLayer: ExecutionLayer;
  prompts: {
    replit: string;
    lovable: string;
    googleAI: string;
    notion: string;
    github: string;
  };
  techStack?: { name: string, domain: string, purpose: string }[];
}

export interface AppState {
  currentStep: AppStep;
  onboardingSectionIndex: number;
  currentQuestionIndex: number;
  answers: UserAnswers;
  comments: UserComments;
  isAnalyzing: boolean;
  profile: PsychologicalProfile | null;
  mission: Mission | null;
  blueprint: Blueprint | null;
  error: string | null;
  showRefineModal: boolean;
  refinementQuery: string;
  user: User | null;
  showAuthModal: boolean;
  showHistoryModal: boolean;
  showPricingModal: boolean;
  showNewMissionModal: boolean; // For "New Mission" decision from history
  checkedTasks: string[];
}
