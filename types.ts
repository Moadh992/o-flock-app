
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
  checkedTasks: string[];
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

// Paul Graham Framework: Lean Canvas for hypothesis validation
export interface LeanCanvas {
  problem: string[];           // Top 3 problems to validate
  customerSegments: string;    // Early adopters to target
  uniqueValueProp: string;     // Single clear message
  solution: string[];          // Top 3 features for MVP
  unfairAdvantage: string;     // What can't be copied
  revenueStreams: string;      // Pricing model
  costStructure: string;       // Key costs to track
  keyMetrics: string[];        // Numbers that matter
  channels: string[];          // Path to customers
}

// Paul Graham Framework: "Do Things That Don't Scale" early tactics
export interface EarlyTractionTactics {
  manualOutreach: string[];      // Specific outreach actions
  personalOnboarding: string;    // How to onboard first 10 users
  founderSelling: string;        // Direct sales approach
  communityEngagement: string;   // Where to find early users
  feedbackLoops: string;         // How to collect and act on feedback
}

// Design Thinking stages for iteration
export interface IterationCycle {
  empathize: string;    // How to understand users deeply
  define: string;       // Problem statement refinement
  ideate: string;       // Solution brainstorming approach
  prototype: string;    // What to build for testing
  test: string;         // How to validate with users
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
  // Paul Graham Framework additions
  leanCanvas?: LeanCanvas;
  earlyTraction?: EarlyTractionTactics;
  iterationCycle?: IterationCycle;
  founderProblemFit?: string;  // How this solves the founder's own problem
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
  currentMissionId: string | null;
}

export interface ReflectionAnswers {
  resonance: string; // 'deeply' | 'somewhat' | 'no'
  action: string;    // 'started' | 'planned' | 'nothing'
  why: string;       // 'none' | 'disbelief' | 'complexity' | 'distraction' | 'skills'
  feeling: string;   // Text input
}
