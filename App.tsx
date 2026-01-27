import React, { useState, useRef, useEffect } from 'react';
import { AppState, UserAnswers, UserComments, PsychologicalProfile, Mission, Blueprint, User, SavedBlueprint } from './types';
import { UserHistoryModal } from './components/UserHistoryModal';
import { ONBOARDING_SECTIONS } from './constants';
import { analyzeProfile, generateMission, generateBlueprint, generateNameIdeas, refineBlueprint } from './services/geminiService';
import { Button } from './components/Button';
import { QuestionInput } from './components/Input';
import { LoadingOverlay } from './components/LoadingOverlay';
import { HoverLinkPreview } from './components/HoverLinkPreview';
import { AuthModal } from './components/AuthModal';
import { PricingModal } from './components/PricingModal';
import { ThemeToggle } from './components/ThemeToggle';
import { WelcomeBackScreen } from './components/WelcomeBackScreen';
import { ReflectionFlow } from './components/ReflectionFlow';
import { LifestyleCompanion } from './components/LifestyleCompanion';
import { LumosWidget } from './components/LumosWidget';


import { supabase } from './services/supabaseClient';

// Icons
const CheckIcon = ({ className = "", strokeWidth = 2 }: { className?: string, strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12" /></svg>
);

const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
);

const PauseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
);

const SlidersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
);

const NotionIcon = () => (
  <img src="https://cm4-production-assets.s3.amazonaws.com/1767092733920-png-transparent-notion-hd-logo-3229477745.png" alt="Notion" className="w-5 h-5" />
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);

const LogOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);

const CursorIcon = () => (
  <svg id="Ebene_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 466.73 532.09" className="w-5 h-5 fill-current transition-colors">
    <path d="M457.43,125.94L244.42,2.96c-6.84-3.95-15.28-3.95-22.12,0L9.3,125.94c-5.75,3.32-9.3,9.46-9.3,16.11v247.99c0,6.65,3.55,12.79,9.3,16.11l213.01,122.98c6.84,3.95,15.28,3.95,22.12,0l213.01-122.98c5.75-3.32,9.3-9.46,9.3-16.11v-247.99c0-6.65-3.55-12.79-9.3-16.11h-.01ZM444.05,151.99l-205.63,356.16c-1.39,2.4-5.06,1.42-5.06,1.36v-233.21c0-4.66-2.49-8.97-6.53-11.31L24.87,145.67c-2.4-1.39-1.42-5.06,1.36-5.06h411.26c5.84,0,9.49,6.33,6.57,11.39h-.01Z" />
  </svg>
);

const WindsurfIcon = () => (
  <svg viewBox="0 0 1024 1024" className="w-5 h-5 fill-current transition-colors" xmlns="http://www.w3.org/2000/svg">
    <path d="M897.246 286.869H889.819C850.735 286.808 819.017 318.46 819.017 357.539V515.589C819.017 547.15 792.93 572.716 761.882 572.716C743.436 572.716 725.02 563.433 714.093 547.85L552.673 317.304C539.28 298.16 517.486 286.747 493.895 286.747C457.094 286.747 423.976 318.034 423.976 356.657V515.619C423.976 547.181 398.103 572.746 366.842 572.746C348.335 572.746 329.949 563.463 319.021 547.881L138.395 289.882C134.316 284.038 125.154 286.93 125.154 294.052V431.892C125.154 438.862 127.285 445.619 131.272 451.34L309.037 705.2C319.539 720.204 335.033 731.344 352.9 735.392C397.616 745.557 438.77 711.135 438.77 667.278V508.406C438.77 476.845 464.339 451.279 495.904 451.279H495.995C515.02 451.279 532.857 460.562 543.785 476.145L705.235 706.661C718.659 725.835 739.327 737.218 763.983 737.218C801.606 737.218 833.841 705.9 833.841 667.308V508.376C833.841 476.815 859.41 451.249 890.975 451.249H890.975C890.975 451.249 890.975 451.249 890.975 451.249H897.276C901.233 451.249 904.43 448.053 904.43 444.097V294.021C904.43 290.065 901.233 286.869 897.276 286.869H897.246Z" />
  </svg>
);

const LovableIcon = () => (
  <svg viewBox="0 0 121 122" className="w-5 h-5 transition-opacity" xmlns="http://www.w3.org/2000/svg">
    <mask id="b_app" width="121" height="122" x="0" y="0" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}><path fill="url(#a_app)" fillRule="evenodd" d="M36.069 0c19.92 0 36.068 16.155 36.068 36.084v13.713h12.004c19.92 0 36.069 16.156 36.069 36.084 0 19.928-16.149 36.083-36.069 36.083H0v-85.88C0 16.155 16.148 0 36.069 0Z" clipRule="evenodd" /></mask>
    <g mask="url(#b_app)">
      <ellipse cx="52.738" cy="65.101" fill="#4B73FF" rx="81.373" ry="81.192" />
      <ellipse cx="61.673" cy="20.547" fill="#FF66F4" rx="104.216" ry="81.192" />
      <ellipse cx="78.666" cy="5.268" fill="#FF0105" rx="81.373" ry="71.304" />
      <ellipse cx="63.121" cy="20.527" fill="#FE7B02" rx="48.937" ry="48.829" />
    </g>
    <defs>
      <linearGradient id="a_app" x1="40.453" x2="76.933" y1="21.433" y2="121.971" gradientUnits="userSpaceOnUse"><stop offset=".025" stopColor="#FF8E63" /><stop offset=".56" stopColor="#FF7EB0" /><stop offset=".95" stopColor="#4B73FF" /></linearGradient>
    </defs>
  </svg>
);

const ReplitIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 1.5A1.5 1.5 0 0 1 3.5 0h7A1.5 1.5 0 0 1 12 1.5V7H3.5A1.5 1.5 0 0 1 2 5.5v-4zM12 8.5V14h8.5a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-7a1.5 1.5 0 0 1-1.5-1.5V8.5zM2 18.5a1.5 1.5 0 0 1 1.5-1.5h7a1.5 1.5 0 0 1 1.5 1.5V24H3.5A1.5 1.5 0 0 1 2 22.5v-4z" />
  </svg>
);




const RefineWidget = ({ onClick, isActive }: { onClick: () => void, isActive: boolean }) => (
  <div onClick={onClick} className="fixed top-24 right-6 z-40 animate-fade-in cursor-pointer">
    <div className={`bg-white/90 dark:bg-black/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-white/5 rounded-full p-1.5 md:pr-5 flex items-center gap-3 transition-colors duration-300 group ${isActive ? 'ring-2 ring-slate-200 dark:ring-white/20' : ''}`}>
      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-white transition-colors text-slate-900">
        <SlidersIcon />
      </div>
      <div className="hidden md:flex flex-col text-left">
        <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold leading-none">Modify</span>
        <span className="text-sm font-serif font-bold text-slate-900 dark:text-white leading-none mt-1 group-hover:text-black dark:group-hover:text-white transition-colors">The Strategy</span>
      </div>
    </div>
  </div>
);

const LofiWidget = ({ expanded = false }: { expanded?: boolean }) => {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("https://stream.zeno.fm/0r0xa792kwzuv"); // Lofi Stream
    audioRef.current.volume = 0.4;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.error("Audio play failed", e));
    }
    setPlaying(!playing);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-fade-in block no-underline" onClick={togglePlay}>
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-white/5 rounded-full p-1.5 md:pr-5 flex items-center gap-3 cursor-pointer group">
        <div className={`w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 text-white transition-all ${playing ? 'shadow-lg shadow-blue-500/20' : ''}`}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </div>
        <div className={`${expanded ? 'flex' : 'hidden'} md:flex flex-col text-left`}>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold leading-none">Focus Mode</span>
          <span className="text-sm font-serif font-bold text-slate-900 dark:text-white leading-none mt-1 min-w-[60px]">
            {playing ? (
              <span className="flex items-center gap-1">
                Playing <span className="flex gap-[1px] items-end h-3 pb-0.5"><span className="w-0.5 h-1 bg-green-500 animate-pulse"></span><span className="w-0.5 h-2 bg-green-500 animate-pulse delay-75"></span><span className="w-0.5 h-1.5 bg-green-500 animate-pulse delay-150"></span></span>
              </span>
            ) : "Paused"}
          </span>
        </div>
      </div>
    </div>
  );
};

const UserProfileWidget = ({ user, onClick }: { user: User, onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="relative z-50 animate-fade-in font-sans"
    >
      <div
        className="bg-white/90 dark:bg-black/90 backdrop-blur-md border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-white/5 rounded-full p-1.5 pr-2 md:pr-4 flex items-center gap-3 transition-colors duration-300 cursor-pointer hover:border-slate-300 dark:hover:border-white/20"
      >
        <div className="w-10 h-10 bg-gradient-to-br from-slate-100 to-white rounded-full flex items-center justify-center border border-slate-200 text-slate-900 font-serif font-bold text-lg shadow-sm">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover rounded-full" />
          ) : (
            user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex flex-col text-left mr-2">
          <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-bold leading-none mb-0.5">
            Founder
          </span>
          <span className="text-sm font-bold text-slate-900 dark:text-white leading-none truncate max-w-[120px]">
            {user.name || user.email.split('@')[0]}
          </span>
        </div>
      </div>
    </div>
  );
};

const ToolCard = ({ logo, darkLogo, name, prompt, domain, renderLogo: RenderLogo }: { logo?: string, darkLogo?: string, name: string, prompt: string, domain?: string, renderLogo?: React.FC }) => {
  const logoDevToken = 'pk_YBlqx6vUR_mo5wCxEWUzXw';
  const displayLogo = (domain && !darkLogo && !RenderLogo) ? `https://img.logo.dev/${domain}?token=${logoDevToken}` : undefined;

  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="group relative w-full border rounded-xl shadow-sm overflow-visible cursor-pointer transition-all flex items-center justify-between p-4 bg-white dark:bg-black border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/30"
      onClick={handleCopy}
    >
      {/* Tooltip */}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 w-80 hidden md:block">
        <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl text-center leading-relaxed">
          <span className="font-bold block mb-1">Click to copy build prompt</span>
          <span className="opacity-75 font-mono text-[10px] block truncate">{prompt.substring(0, 50)}...</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-slate-50 dark:bg-white/5 p-2 rounded-lg border border-slate-100 dark:border-white/5 flex items-center justify-center min-w-[40px]">
          {RenderLogo ? (
            <RenderLogo />
          ) : displayLogo ? (
            <>
              <img src={displayLogo} alt={name} className="h-8 w-8 object-contain" />
            </>
          ) : darkLogo ? (
            <>
              <img src={logo} alt={name} className="h-8 w-8 object-contain dark:hidden" />
              <img src={darkLogo} alt={name} className="h-8 w-8 object-contain hidden dark:block" />
            </>
          ) : (
            <img src={logo} alt={name} className="h-8 w-8 object-contain" />
          )}
        </div>
        <div>
          <span className="font-serif text-lg text-slate-900 dark:text-white block leading-none">{name}</span>
        </div>
      </div>

      <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${copied ? 'text-green-500' : 'text-slate-300 dark:text-slate-600 group-hover:text-slate-900 dark:group-hover:text-white'}`}>
        {copied ? (
          <>
            <CheckIcon />
            <span className="hidden md:inline">Copied</span>
          </>
        ) : (
          <CopyIcon />
        )}
      </div>
    </div>
  );
};

// --- Utility Components for Render ---

const Card = ({ title, content, highlight = 'slate', large = false }: { title: string, content: string, highlight?: 'slate' | 'red' | 'blue', large?: boolean }) => {
  // For light theme, we use subtle borders or background tints
  const borderColors = {
    slate: 'border-slate-200 bg-white dark:bg-black dark:border-white/10 dark:text-white',
    red: 'border-red-100 bg-red-50/50 dark:bg-red-900/10 dark:border-red-500/20',
    blue: 'border-blue-100 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-500/20'
  };
  return (
    <div className={`border ${borderColors[highlight]} p-6 rounded-xl ${large ? 'md:col-span-2' : ''} shadow-sm`}>
      <h3 className="text-slate-400 text-xs font-bold uppercase mb-3 tracking-wider">{title}</h3>
      <p className={`text-slate-800 dark:text-slate-200 ${large ? 'text-xl font-serif' : 'text-base'}`}>{content}</p>
    </div>
  );
};

const DetailSection = ({ title, content }: { title: string, content: string }) => (
  <div className="bg-white dark:bg-black border-l-2 border-slate-900 dark:border-white/20 pl-6 py-4 shadow-sm rounded-r-lg">
    <h3 className="text-slate-400 dark:text-slate-500 font-bold text-xs uppercase mb-2 tracking-widest">{title}</h3>
    <p className="text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{content}</p>
  </div>
);

const PlanCard = ({ week, tasks, checkedTasks, onToggle }: { week: string; tasks: string[]; checkedTasks: Set<string>; onToggle: (task: string) => void }) => (
  <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
    <h4 className="text-slate-900 dark:text-white font-bold mb-4 font-serif text-lg">{week}</h4>
    <ul className="space-y-3">
      {tasks.map((task, i) => {
        const isChecked = checkedTasks.has(task);
        return (
          <li key={i} className="flex items-start gap-3 group cursor-pointer" onClick={() => onToggle(task)}>
            <div className={`mt-0.5 w-4 h-4 shrink-0 rounded-sm border flex items-center justify-center transition-all ${isChecked ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-black' : 'bg-white border-slate-900 dark:bg-slate-950 dark:border-slate-500 group-hover:border-slate-700 dark:group-hover:border-slate-300'}`}>
              {isChecked && <CheckIcon className="w-3 h-3 text-current" strokeWidth={3} />}
            </div>
            <span className={`text-sm leading-relaxed transition-colors ${isChecked ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{task}</span>
          </li>
        );
      })}
    </ul>
  </div>
);


export default function App() {
  const [state, setState] = useState<AppState>(() => {
    // Initialize from local storage to handle redirects from OAuth
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('oflock_state');
        if (saved) {
          const parsed = JSON.parse(saved);


          // Determine initial step for returning users
          const step = parsed.currentStep;

          return {
            ...parsed,
            currentStep: step,
            isAnalyzing: false,
            error: null,
            showAuthModal: false,
            user: null // Let Supabase listener handle user state
          };
        }
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
    return {
      currentStep: 'DISCLAIMER',
      onboardingSectionIndex: 0,
      currentQuestionIndex: 0,
      answers: {},
      comments: {},
      isAnalyzing: false,
      profile: null,
      mission: null,
      blueprint: null,
      error: null,
      showRefineModal: false,
      refinementQuery: '',
      user: null,
      showAuthModal: false,
      showHistoryModal: false,
      showPricingModal: false,
      showNewMissionModal: false,
      checkedTasks: [],
      currentMissionId: null
    };
  });

  // History & Usage Data (from Supabase)
  const [userHistory, setUserHistory] = useState<SavedBlueprint[]>([]);
  // usageCount removed, derived from userHistory.length
  const [disclaimerAgreed, setDisclaimerAgreed] = useState(false);
  // checkedTasks moved to global state

  // Fetch History & Usage when User Changes
  useEffect(() => {
    if (state.user) {
      const fetchData = async () => {
        // Fetch History
        const { data: historyData } = await supabase
          .from('missions')
          .select('*')
          .order('created_at', { ascending: false });

        if (historyData) {
          const formatted: SavedBlueprint[] = historyData.map((item: any) => ({
            id: item.id,
            mission: item.mission_data || {
              title: item.title,
              coreConcept: item.idea_summary || '',
              whyFitsYou: '', // Legacy/Fallback
              sustainability: '',
              problemSolved: '',
              yourRole: ''
            },
            blueprint: item.blueprint,
            timestamp: item.created_at,
            checkedTasks: item.checked_tasks || []
          }));
          setUserHistory(formatted);

          // If user has history and is at the start, welcome them back
          if (formatted.length > 0 && state.currentStep === 'DISCLAIMER') {
            setState(prev => ({
              ...prev,
              currentStep: 'WELCOME',
              // Restore most recent mission to context if available
              mission: formatted[0].mission,
              blueprint: formatted[0].blueprint
            }));
          }
        }

      };

      fetchData();
    }
  }, [state.user]);

  const toggleTask = (task: string) => {
    // Optimistic Update
    setState(prev => {
      const current = new Set(prev.checkedTasks || []);
      if (current.has(task)) {
        current.delete(task);
      } else {
        current.add(task);
      }
      const newChecked = Array.from(current);

      // Sync to Supabase if we have a saved mission context
      if (prev.user) {
        // Find current mission ID from history if possible, or assume it's the active one if we track context better.
        // Wait, 'state.mission' doesn't have an ID attached directly in the state interface?
        // Let's use userHistory to find the matching mission or we need to store currentMissionId in state.
        // For now, let's try to match by title/timestamp or improvements.
        // Actually, better: We need the mission ID. Let's look at how userHistory works.
        // If we selected from history, we know the ID.
        // But state doesn't store currentMissionId.
        // Let's rely on finding it in history for now or just updating if we can.
        // Actually, let's check if we can retrieve the ID.
        // If not, we might be only modifying local state for new missions until saved.

        // Let's assume we need to sync.
        // We need to know WHICH mission to update. 
        // If the user just generated it, we saved it. But we didn't store the ID in state. 
        // We should probably store currentMissionId in AppState.
      }
      return { ...prev, checkedTasks: newChecked };
    });
  };


  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Persistence Listener
  useEffect(() => {
    const stateToSave = {
      ...state,
      isAnalyzing: false,
      error: null,
      showAuthModal: false,
      showRefineModal: false,
      // We generally don't persist the user object itself as source of truth, but Supabase session
      user: null
    };
    localStorage.setItem('oflock_state', JSON.stringify(stateToSave));
  }, [state]);

  // Supabase Auth Listener
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setState(prev => ({
          ...prev,
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || undefined,
            createdAt: session.user.created_at
          }
        }));
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setState(prev => ({
          ...prev,
          user: {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || undefined,
            createdAt: session.user.created_at
          },
          showAuthModal: false
        }));

        // Clean URL hash if present (Supabase puts tokens there)
        if (window.location.hash && window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      } else {
        // Only clear user if no session
        setState(prev => ({ ...prev, user: null }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  };

  // --- Lifestyle System Handlers ---

  const handleContinueMission = () => {
    if (state.blueprint) {
      setState(prev => ({ ...prev, currentStep: 'BLUEPRINT' }));
    } else if (state.mission) {
      setState(prev => ({ ...prev, currentStep: 'MISSION' }));
    } else {
      // Fallback
      setState(prev => ({ ...prev, currentStep: 'WELCOME' }));
    }
    scrollToTop();
  };

  const handleStartReflection = () => {
    setState(prev => ({ ...prev, currentStep: 'REFLECTION' }));
    scrollToTop();
  };

  const handleAnalyzeReflection = (decision: 'STAY' | 'REFINE' | 'PIVOT') => {
    if (decision === 'STAY') {
      handleContinueMission();
    } else if (decision === 'REFINE') {
      // user stays on mission but opens refine modal immediately? 
      // or we just go to mission and let them refine there.
      // For simplicity: Go to Blueprint if exists, else Mission, and maybe auto-open refine?
      // Let's just go to Mission/Blueprint.
      handleContinueMission();
      // optionally set showRefineModal: true
      setState(prev => ({ ...prev, showRefineModal: true }));
    } else if (decision === 'PIVOT') {
      // Pivot: Clear Mission & Blueprint, Keep Profile but allow editing aesthetics/idea
      setState(prev => ({
        ...prev,
        mission: null,
        blueprint: null,
        // Clear specific project details so they can enter new ones
        answers: { ...prev.answers, app_name_idea: '', logo_upload: '' },
        currentStep: 'ONBOARDING',
        onboardingSectionIndex: 4, // Jump to Aesthetics & Brand DNA (Index 4)
        currentQuestionIndex: 0
      }));
      scrollToTop();
    }
  };

  const handleLogoClick = () => {
    if (state.user) {
      // Always try to go to Welcome if logged in. 
      // The Welcome step renders Disclaimer if no mission exists, which is the correct fallback.
      setState(prev => ({ ...prev, currentStep: 'WELCOME' }));
    } else {
      setState(prev => ({ ...prev, currentStep: 'DISCLAIMER' }));
    }
    scrollToTop();
  };

  const handleNewMissionClick = () => {
    setState(prev => ({ ...prev, showNewMissionModal: true, showHistoryModal: false }));
  };

  const handleNewMissionDecision = (type: 'FRESH' | 'REFINE') => {
    if (type === 'FRESH') {
      handleReset();
    } else {
      // Refine: Keep Profile, Reset Mission/Blueprint
      setState(prev => ({
        ...prev,
        mission: null,
        blueprint: null,
        // Clear project specific answers
        answers: { ...prev.answers, app_name_idea: '', logo_upload: '' },
        currentStep: 'ONBOARDING',
        onboardingSectionIndex: 1, // Start from Passion & Emotional Energy (Index 1)
        currentQuestionIndex: 0,
        showAuthModal: false,
        showHistoryModal: false,
        showPricingModal: false,
        showNewMissionModal: false,
        checkedTasks: [],
        currentMissionId: null
      }));
      scrollToTop();
    }
  };

  // --- Handlers ---

  const handleReset = () => {
    const currentUser = state.user; // Preserve user
    localStorage.removeItem('oflock_state');
    setState({
      currentStep: 'DISCLAIMER',
      onboardingSectionIndex: 0,
      currentQuestionIndex: 0,
      answers: {},
      comments: {},
      isAnalyzing: false,
      profile: null,
      mission: null,
      blueprint: null,
      error: null,
      showRefineModal: false,
      refinementQuery: '',
      user: currentUser, // Restore user
      showAuthModal: false,
      showHistoryModal: false,
      showPricingModal: false,
      showNewMissionModal: false,
      checkedTasks: [],
      currentMissionId: null
    });
    scrollToTop();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const triggerSave = () => {
    if (state.user) {
      // Already logged in, show saved confirmation (mock)
      alert("Mission saved to your Founder Space!");
    } else {
      // Trigger Auth Modal
      setState(prev => ({ ...prev, showAuthModal: true }));
    }
  };

  const handleDisclaimerAgree = () => {
    setState(prev => ({ ...prev, currentStep: 'ONBOARDING' }));
    scrollToTop();
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: value }
    }));
  };

  const handleCommentChange = (questionId: string, value: string) => {
    setState(prev => ({
      ...prev,
      comments: { ...prev.comments, [questionId]: value }
    }));
  };

  const handleBack = () => {
    if (state.currentQuestionIndex > 0) {
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }));
    } else if (state.onboardingSectionIndex > 0) {
      // Go to last question of previous section
      const prevSectionIndex = state.onboardingSectionIndex - 1;
      const prevSection = ONBOARDING_SECTIONS[prevSectionIndex];
      setState(prev => ({
        ...prev,
        onboardingSectionIndex: prevSectionIndex,
        currentQuestionIndex: prevSection.questions.length - 1
      }));
    }
  };

  const handleNext = async () => {
    const currentSection = ONBOARDING_SECTIONS[state.onboardingSectionIndex];
    const currentQuestion = currentSection.questions[state.currentQuestionIndex];

    // Validation
    const answer = state.answers[currentQuestion.id];
    const isOptional = currentQuestion.id === 'logo_upload' || currentQuestion.id === 'app_name_idea';

    if (currentQuestion.type !== 'file' && !isOptional && (!answer || answer.trim().length < 1)) {
      return;
    }

    // Determine next step
    const isLastQuestionInSection = state.currentQuestionIndex === currentSection.questions.length - 1;
    const isLastSection = state.onboardingSectionIndex === ONBOARDING_SECTIONS.length - 1;

    if (!isLastQuestionInSection) {
      // Next Question
      setState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex + 1 }));
    } else if (!isLastSection) {
      // Next Section
      setState(prev => ({
        ...prev,
        onboardingSectionIndex: prev.onboardingSectionIndex + 1,
        currentQuestionIndex: 0
      }));
      scrollToTop();
    } else {
      // Finish
      setState(prev => ({ ...prev, isAnalyzing: true, currentStep: 'ANALYSIS' }));
      try {
        // Combine answers and comments for analysis
        const fullContext = { ...state.answers, ...state.comments };
        const profile = await analyzeProfile(fullContext);
        setState(prev => ({ ...prev, profile, isAnalyzing: false }));
      } catch (e) {
        setState(prev => ({ ...prev, isAnalyzing: false, error: "Failed to generate profile. Please try again." }));
      }
    }
  };

  const handleNameGeneration = async (): Promise<string[]> => {
    try {
      const ideas = await generateNameIdeas(state.answers);
      return ideas;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const handleGenerateMission = async () => {
    if (!state.profile) return;
    setState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      const fullContext = { ...state.answers, ...state.comments };
      const mission = await generateMission(state.profile, fullContext);
      setState(prev => ({ ...prev, mission, isAnalyzing: false, currentStep: 'MISSION' }));
      scrollToTop();
    } catch (e) {
      setState(prev => ({ ...prev, isAnalyzing: false, error: "Failed to generate mission." }));
    }
  };

  const handleGenerateBlueprint = async () => {
    if (!state.mission || !state.profile) return;

    // 1. Check Limits (only for authenticated users)
    if (state.user) {
      const { data: canGenerate } = await supabase.rpc('can_generate_mission', { check_user_id: state.user.id });
      if (canGenerate === false) { // Strict false check
        setState(prev => ({ ...prev, showPricingModal: true }));
        return;
      }
    }

    setState(prev => ({ ...prev, isAnalyzing: true }));
    try {
      // Pass full context to generate detailed prompts that use user aesthetics
      const fullContext = { ...state.answers, ...state.comments };
      const blueprint = await generateBlueprint(state.mission, state.profile, fullContext);

      // 2. Auto-save & Increment Usage (only for authenticated users)
      // 2. Auto-save & Increment Usage (only for authenticated users)
      let savedMission: any = null;
      if (state.user) {
        const { data } = await supabase.from('missions').insert({
          user_id: state.user.id,
          title: state.mission.title,
          idea_summary: state.mission.coreConcept,
          blueprint: blueprint,
          mission_data: state.mission
        }).select().single();
        savedMission = data;


        // increment_usage RPC removed - logic now counts directly from missions table


        if (savedMission) {
          const newItem: SavedBlueprint = {
            id: savedMission.id,
            mission: savedMission.mission_data || state.mission,
            blueprint: savedMission.blueprint,
            timestamp: savedMission.created_at,
            checkedTasks: []
          };
          setUserHistory(prev => [newItem, ...prev]);
        }
      }

      setState(prev => ({
        ...prev,
        blueprint,
        isAnalyzing: false,
        currentStep: 'BLUEPRINT',
        checkedTasks: [],
        currentMissionId: (state.user && savedMission) ? savedMission.id : null
      }));
      scrollToTop();
    } catch (e) {
      console.error(e);
      setState(prev => ({ ...prev, isAnalyzing: false, error: "Failed to generate blueprint." }));
    }
  };

  const handleRefineStrategy = async () => {
    if (!state.blueprint || !state.mission || !state.profile || !state.refinementQuery) return;

    // Show global loader by setting isAnalyzing, and close modal
    setState(prev => ({ ...prev, isAnalyzing: true, showRefineModal: false }));

    try {
      const newBlueprint = await refineBlueprint(state.blueprint, state.mission, state.profile, state.refinementQuery);
      setState(prev => ({
        ...prev,
        blueprint: newBlueprint,
        isAnalyzing: false,
        refinementQuery: '' // Reset query after success
      }));
    } catch (e) {
      setState(prev => ({ ...prev, isAnalyzing: false, error: "Failed to refine strategy." }));
    }
  };

  // Add global keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();

        // If Refine Modal is open, trigger update
        if (state.showRefineModal && state.refinementQuery.trim().length > 0) {
          handleRefineStrategy();
          return;
        }

        // If in Onboarding, trigger Next/Continue
        if (state.currentStep === 'ONBOARDING') {
          const currentSection = ONBOARDING_SECTIONS[state.onboardingSectionIndex];
          const currentQuestion = currentSection.questions[state.currentQuestionIndex];

          // Allow shortcut only if input is valid (same logic as button)
          const answer = state.answers[currentQuestion.id];
          const isValid = currentQuestion.type === 'file' || (answer && answer.trim().length > 0);

          if (isValid) {
            handleNext();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, handleNext, handleRefineStrategy]);

  // --- Render Steps ---

  const renderDisclaimer = () => (
    <div className="max-w-2xl mx-auto space-y-6 md:space-y-10 animate-fade-in pt-6 md:pt-12 px-4 md:px-0 pb-20 overflow-y-auto">
      <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-4 sm:p-6 md:p-8 rounded-xl md:rounded-2xl space-y-4 md:space-y-6 shadow-xl shadow-slate-200/40 dark:shadow-black/60">
        <h2 className="text-xl font-serif text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/10 pb-4 flex items-center gap-2">
          <span>Prerequisites</span>
          <span className="text-slate-400 text-xs font-sans font-normal lowercase tracking-tighter">| Before You Begin</span>
        </h2>

        <div className="space-y-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed italic">
            O’Flock is not a place for rushing or shallow answers. It is a space for honesty between you and yourself.
          </p>

          <div className="grid gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px]">1</span>
                Mentally Present
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed ml-7">
                Come in with as much mental clarity as possible. If your mind feels heavy or overwhelmed… take a breath, pause for a moment, then continue.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px]">2</span>
                Physically Comfortable
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed ml-7">
                If you’re exhausted, hungry, or dehydrated… take care of your body first. A balanced body helps your mind speak honestly.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px]">3</span>
                No Rush
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed ml-7">
                Read slowly. Answer truthfully… without exaggeration, without overthinking, and without trying to please a “perfect version” of yourself.
              </p>
            </div>



            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px]">5</span>
                One Idea. Full Presence.
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed ml-7">
                Stay with one direction at a time. Give the idea space to breathe. Depth appears when attention is not divided.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-white/5">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-2 hidden md:block">Why These Prerequisites Exist</h4>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed hidden md:block">
              They protect your authenticity — so your answers don’t become distorted by stress, fatigue, or urgency. When you are present… O’Flock understands you better.
            </p>
          </div>
        </div>


        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer group mb-4">
            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${disclaimerAgreed ? 'bg-slate-900 border-slate-900 dark:bg-white dark:border-white' : 'bg-white dark:bg-black border-slate-300 dark:border-white/20 group-hover:border-slate-400 dark:group-hover:border-white/40'}`}>
              {disclaimerAgreed && <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white dark:text-black"><polyline points="20 6 9 17 4 12" /></svg>}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={disclaimerAgreed}
              onChange={(e) => setDisclaimerAgreed(e.target.checked)}
            />
            <span className={`text-sm select-none ${disclaimerAgreed ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
              I have read and agree to the prerequisites.
            </span>
          </label>

          <Button fullWidth onClick={handleDisclaimerAgree} disabled={!disclaimerAgreed} className="dark:bg-white dark:text-black">
            I Accept & Begin
          </Button>
        </div>
      </div>
      <p className="text-center text-slate-400 text-xs md:text-sm">
        This is an intense psychological process. Proceed with intent.
      </p>
    </div>
  );

  const renderOnboarding = () => {
    const section = ONBOARDING_SECTIONS[state.onboardingSectionIndex];
    const question = section.questions[state.currentQuestionIndex];

    // Calculate global progress
    let totalQuestions = 0;
    let questionsAnswered = 0;

    ONBOARDING_SECTIONS.forEach((s, sIdx) => {
      totalQuestions += s.questions.length;
      if (sIdx < state.onboardingSectionIndex) {
        questionsAnswered += s.questions.length;
      } else if (sIdx === state.onboardingSectionIndex) {
        questionsAnswered += state.currentQuestionIndex;
      }
    });

    const progress = (questionsAnswered / totalQuestions) * 100;
    const isFinished = state.onboardingSectionIndex === ONBOARDING_SECTIONS.length - 1 &&
      state.currentQuestionIndex === section.questions.length - 1;
    const canGoBack = state.onboardingSectionIndex > 0 || state.currentQuestionIndex > 0;

    return (
      <div className="w-full flex flex-col min-h-[calc(100vh-80px)] justify-center">
        {/* Progress Fixed at Top */}
        <div className="fixed top-20 left-0 w-full z-30 bg-[#F7F7F5]/80 dark:bg-black/90 backdrop-blur-sm pt-4 pb-2 px-4 md:px-6 border-b border-transparent dark:border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Progression</span>
              <span className="text-xs font-mono text-slate-400">{Math.round(progress)}%</span>
            </div>
            <div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-slate-900 dark:bg-white transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>

        <div key={question.id} className="animate-fade-in-up w-full max-w-4xl mx-auto px-0 md:px-4 py-8">
          <div className="mb-8 text-center">
            <span className="text-slate-500 dark:text-slate-400 font-bold tracking-widest text-[10px] uppercase border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-full bg-white dark:bg-black">
              {section.title}
            </span>
          </div>

          <QuestionInput
            question={question}
            value={state.answers[question.id] || ''}
            comment={state.comments[question.id] || ''}
            onChange={(val) => handleAnswerChange(question.id, val)}
            onCommentChange={(val) => handleCommentChange(question.id, val)}
            onEnter={handleNext}
            onAiAssist={question.id === 'app_name_idea' ? handleNameGeneration : undefined}
          />

          <div className="pt-12 flex flex-col-reverse md:flex-row justify-center gap-4">
            {canGoBack && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="px-6 border-transparent hover:border-slate-200 hover:bg-white w-full md:w-auto"
              >
                <ArrowLeftIcon /> Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="px-10 shadow-xl shadow-slate-900/10 group w-full md:w-auto"
              disabled={question.type !== 'file' && (!state.answers[question.id] || state.answers[question.id].length < 1)}
            >
              {isFinished ? 'Analyze Me' : 'Continue'}
              {!isFinished && <ArrowRightIcon />}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalysis = () => {
    if (!state.profile) return null;
    return (
      <div className="max-w-3xl mx-auto pt-8 pb-20 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 dark:text-white mb-8 text-center">Psychological Profile</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title="Dominant Motivations" content={state.profile.dominantMotivations} />
          <Card title="Energy Sources" content={state.profile.energySources} />
          <Card title="Fear Patterns" content={state.profile.fearPatterns} highlight="red" />
          <Card title="Core Desire" content={state.profile.coreDesire} highlight="blue" large />
        </div>

        <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-8 rounded-2xl mb-8 shadow-lg shadow-slate-200/50 dark:shadow-none">
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase mb-4 tracking-widest">Analysis Summary</h3>
          <p className="text-slate-800 dark:text-slate-200 leading-loose text-lg font-serif">{state.profile.summary}</p>
        </div>

        <div className="text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-6">Does this feel like you? If so, let's find your mission.</p>
          <Button onClick={handleGenerateMission} fullWidth>
            Generate My One Mission
          </Button>
        </div>

        {/* Refine Widget for Profile */}
        <RefineWidget
          onClick={() => setState(prev => ({ ...prev, showRefineModal: !prev.showRefineModal }))}
          isActive={state.showRefineModal}
        />

        {state.showRefineModal && (
          <div className="fixed top-44 right-6 z-40 w-80 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 animate-fade-in-up">
            <h3 className="font-serif text-lg mb-2 text-slate-900 dark:text-white">Refine Profile</h3>
            <p className="text-xs text-slate-500 mb-4">Does this profile feel slightly off? Teach O'flock.</p>
            <textarea
              className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900 dark:focus:ring-white outline-none transition-all resize-none mb-4 h-24"
              placeholder="e.g. I am actually more introverted than this..."
            ></textarea>
            <Button fullWidth className="text-sm py-2">Update Profile</Button>
          </div>
        )}
      </div>
    );
  };

  const renderMission = () => {
    if (!state.mission) return null;
    return (
      <div className="max-w-3xl mx-auto pt-8 pb-20 animate-fade-in">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-slate-100 dark:bg-white text-slate-600 dark:text-black rounded-full text-xs font-bold tracking-widest mb-6 border border-slate-200 dark:border-transparent">YOUR MISSION</span>
          <h1 className="text-4xl md:text-6xl font-serif text-slate-900 dark:text-white mb-8 leading-tight">{state.mission.title}</h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">{state.mission.coreConcept}</p>
        </div>

        <div className="space-y-6">
          <DetailSection title="Why This Fits You" content={state.mission.whyFitsYou} />
          <DetailSection title="The Problem You Solve" content={state.mission.problemSolved} />
          <DetailSection title="Your Role" content={state.mission.yourRole} />
          <DetailSection title="Why You Will Stick With It" content={state.mission.sustainability} />
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/10 text-center">
          <p className="text-slate-500 dark:text-slate-400 mb-6">Ready to execute? Get the blueprint.</p>
          <Button onClick={handleGenerateBlueprint} fullWidth>
            Reveal Execution Blueprint
          </Button>
        </div>
      </div>
    );
  };

  const renderBlueprint = () => {
    if (!state.blueprint || !state.mission) return null;

    const copyPlanToNotion = () => {
      if (!state.blueprint) return;
      let text = `# Execution Blueprint: ${state.mission?.title}\n\n`;
      text += `## 30-Day Plan\n\n`;

      ['week1', 'week2', 'week3', 'week4'].forEach((key) => {
        const weekTasks = state.blueprint!.actionPlan[key as keyof typeof state.blueprint.actionPlan];
        text += `### ${key.replace('week', 'Week ')}\n`;
        weekTasks.forEach((task) => text += `- [ ] ${task}\n`);
        text += `\n`;
      });

      navigator.clipboard.writeText(text);
      window.open('https://notion.so/new', '_blank');
    };

    return (
      <div className="max-w-4xl mx-auto pt-8 pb-20 animate-fade-in relative">
        <h2 className="text-2xl md:text-3xl font-serif text-slate-900 dark:text-white mb-8 text-center">Execution Blueprint</h2>

        {/* Emotional Anchor */}
        <div className="bg-slate-900 dark:bg-black border border-transparent dark:border-white/10 text-white p-6 md:p-10 rounded-2xl mb-12 text-center shadow-xl shadow-slate-900/20">
          <h3 className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-4">Your Anchor</h3>
          <p className="text-xl md:text-3xl font-sans font-medium leading-relaxed">"{state.blueprint.emotionalAnchor}"</p>

          {/* Save CTA for Authenticated User High Value Action */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={triggerSave}
              className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-slate-100 transition-colors flex items-center gap-2 shadow-lg shadow-black/20"
            >
              {state.user ? (
                <>
                  <CheckIcon />
                  <span>Saved to Space</span>
                </>
              ) : (
                <>
                  <SaveIcon />
                  <span>Save to Founder Space</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 30 Day Plan */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl md:text-2xl text-slate-900 dark:text-white font-serif flex items-center gap-3">
              <span className="bg-slate-900 dark:bg-white text-white dark:text-black w-6 h-6 rounded flex items-center justify-center text-xs font-bold">A</span>
              30-Day Action Plan
            </h3>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={copyPlanToNotion} className="text-xs py-2 px-4 h-auto gap-2 dark:!bg-white dark:!text-black dark:!border-white dark:hover:!bg-slate-200 shadow-lg shadow-black/20">
                <NotionIcon /> Add to Notion
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PlanCard week="Week 1" tasks={state.blueprint.actionPlan.week1} checkedTasks={new Set(state.checkedTasks)} onToggle={toggleTask} />
            <PlanCard week="Week 2" tasks={state.blueprint.actionPlan.week2} checkedTasks={new Set(state.checkedTasks)} onToggle={toggleTask} />
            <PlanCard week="Week 3" tasks={state.blueprint.actionPlan.week3} checkedTasks={new Set(state.checkedTasks)} onToggle={toggleTask} />
            <PlanCard week="Week 4" tasks={state.blueprint.actionPlan.week4} checkedTasks={new Set(state.checkedTasks)} onToggle={toggleTask} />
          </div>
        </div>

        {/* MVP & Strategy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-2xl shadow-sm">
            <h3 className="text-lg text-slate-900 dark:text-white font-serif font-bold mb-4">MVP Build Plan</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{state.blueprint.mvpPlan}</p>
          </div>
          <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-2xl shadow-sm">
            <h3 className="text-lg text-slate-900 dark:text-white font-serif font-bold mb-4">Marketing Strategy</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{state.blueprint.marketingStrategy}</p>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-slate-50 dark:bg-black border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-2xl mb-12">
          <h3 className="text-lg text-slate-900 dark:text-white font-serif font-bold mb-4">Branding Concept</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Suggestions</span>
              <ul className="mt-2 space-y-2">
                {state.blueprint.branding.nameSuggestions.map((n, i) => (
                  <li key={i} className="text-slate-700 dark:text-slate-300 font-medium">{n}</li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Tagline</span>
              <p className="text-slate-900 dark:text-white mt-2 text-xl font-serif">{state.blueprint.branding.tagline}</p>
              <div className="mt-6">
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Audience Angle</span>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">{state.blueprint.branding.audienceAngle}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h3 className="text-3xl text-slate-900 dark:text-white font-serif font-bold">Vibecoding Integration</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Optimized build prompts for the most powerful AI development tools.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <ToolCard
              renderLogo={ReplitIcon}
              name="Replit"
              prompt={state.blueprint.prompts.replit}
            />
            <ToolCard
              renderLogo={LovableIcon}
              name="Lovable"
              prompt={state.blueprint.prompts.lovable}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToolCard
              renderLogo={CursorIcon}
              name="Cursor"
              prompt={state.blueprint.prompts.replit}
            />
            <ToolCard
              renderLogo={WindsurfIcon}
              name="Windsurf"
              prompt={state.blueprint.prompts.replit}
            />
          </div>
        </div>

        {/* Execution Strategy */}
        <div className="mb-16">
          <h3 className="text-2xl text-slate-900 dark:text-white font-serif mb-6">Business Strategy</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-2xl shadow-sm">
              <h4 className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-4 tracking-widest">Monetization</h4>
              <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{state.blueprint.executionLayer.monetization}</p>
            </div>
            <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-2xl shadow-sm">
              <h4 className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-4 tracking-widest">Domain & Branding</h4>
              <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{state.blueprint.executionLayer.domainRecommendation}</p>
            </div>
            <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-2xl shadow-sm md:col-span-2">
              <h4 className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-4 tracking-widest">Landing Page Logic</h4>
              <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{state.blueprint.executionLayer.landingPageCopy}</p>
            </div>
            <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-6 md:p-8 rounded-2xl shadow-sm md:col-span-2">
              <h4 className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-4 tracking-widest">Visual Identity</h4>
              <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{state.blueprint.executionLayer.visualThemeInstructions}</p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mb-16">
          <h3 className="text-2xl text-slate-900 dark:text-white font-serif mb-6">Generated Tech Stack</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">High-leverage technologies recommended for your mission.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.blueprint.techStack?.map((tech, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl hover:border-slate-300 dark:hover:border-white/30 transition-all group group-hover:shadow-lg dark:group-hover:shadow-none">
                <div className="w-14 h-14 shrink-0 flex items-center justify-center p-2.5 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5">
                  <img
                    src={`https://img.logo.dev/${tech.domain}?token=pk_YBlqx6vUR_mo5wCxEWUzXw`}
                    alt={tech.name}
                    className="w-full h-full object-contain transition-transform group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{tech.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{tech.purpose}</span>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Product Hunt Launch Card */}
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 p-6 md:p-8 rounded-2xl mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#FF6154] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-3xl pb-1">P</span>
            </div>
            <div>
              <h3 className="text-[#FF6154] font-serif font-bold text-lg mb-1">Launch on Product Hunt</h3>
              <p className="text-[#FF6154]/80 text-sm">Once you build the MVP, launch it here for maximum visibility.</p>
            </div>
          </div>
          <Button
            className="!bg-[#FF6154] hover:!bg-[#FF6154]/90 text-white border-none shadow-lg shadow-red-500/20"
            onClick={() => window.open('https://www.producthunt.com/', '_blank')}
          >
            Prepare Launch
          </Button>
        </div>


        {/* Concierge Build CTA */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl mb-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <span className="inline-block px-3 py-1 bg-amber-400 text-slate-900 text-[10px] font-bold tracking-widest uppercase rounded-full">Concierge</span>
              <span className="text-slate-400 text-xs">Limited Availability</span>
            </div>
            <h3 className="text-3xl font-serif text-white mb-3">We Build It For You</h3>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed mx-auto md:mx-0">
              Don't want to code? Our agency team will build the "Steel Thread" MVP of this exact blueprint for a one-time fee. Delivered in 7 days.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-4 min-w-[200px]">
            <span className="text-3xl font-serif text-white">$199</span>
            <Button
              variant="secondary"
              className="bg-white hover:bg-slate-200 text-slate-900 border-none font-bold px-8 py-3 h-auto text-base w-full md:w-auto transition-colors"
              onClick={() => window.open('https://cal.com/md-gemini/30min', '_blank')}
            >
              Request Build
            </Button>
          </div>
        </div>

        {/* Refine Button & Widget */}
        <RefineWidget
          onClick={() => setState(prev => ({ ...prev, showRefineModal: !prev.showRefineModal }))}
          isActive={state.showRefineModal}
        />

        {
          state.showRefineModal && (
            <div className="fixed top-44 right-6 z-40 w-80 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 animate-fade-in-up">
              <h3 className="font-serif text-lg mb-2 text-slate-900 dark:text-white">Refine Strategy</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Ask O'flock to adjust the plan based on new constraints.</p>
              <textarea
                className="w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-lg p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:border-slate-900 dark:focus:border-white focus:ring-1 focus:ring-slate-900 dark:focus:ring-white outline-none transition-all resize-none mb-4 h-24"
                placeholder="e.g. I have $0 budget, adjust marketing..."
                value={state.refinementQuery}
                onChange={(e) => setState(prev => ({ ...prev, refinementQuery: e.target.value }))}
              ></textarea>
              <Button
                fullWidth
                className="text-sm py-2"
                onClick={handleRefineStrategy}
                disabled={!state.refinementQuery.trim()}
              >
                Update Plan
              </Button>
            </div>
          )
        }


      </div>
    );
  };


  // --- Main Render ---

  const renderContent = () => {
    switch (state.currentStep) {
      case 'WELCOME':
        return state.user && state.mission ? (
          <WelcomeBackScreen
            user={state.user}
            onContinue={handleContinueMission}
            onReflect={handleStartReflection}
            onViewHistory={() => setState(prev => ({ ...prev, showHistoryModal: true }))}
          />
        ) : renderDisclaimer();
      case 'REFLECTION':
        return (
          <ReflectionFlow
            onComplete={handleAnalyzeReflection}
            onCancel={() => setState(prev => ({ ...prev, currentStep: 'WELCOME' }))}
          />
        );
      case 'LIFESTYLE':
        return (
          <LifestyleCompanion
            onClose={() => setState(prev => ({ ...prev, currentStep: 'WELCOME' }))}
          />
        );
      case 'DISCLAIMER':
        return renderDisclaimer();
      case 'ONBOARDING':
        return renderOnboarding();
      case 'ANALYSIS':
        return !state.isAnalyzing ? renderAnalysis() : null;
      case 'MISSION':
        return !state.isAnalyzing ? renderMission() : null;
      case 'BLUEPRINT':
        return !state.isAnalyzing ? renderBlueprint() : null;
      default:
        return renderDisclaimer();
    }
  };

  return (
    <div className={`min-h-screen bg-[#F7F7F5] dark:bg-black text-slate-900 dark:text-white font-sans selection:bg-slate-900 selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300 ${['DISCLAIMER', 'ONBOARDING', 'WELCOME'].includes(state.currentStep) ? 'md:h-screen md:overflow-hidden' : ''
      }`} ref={scrollRef}>
      {state.isAnalyzing && (
        <LoadingOverlay
          message={
            state.currentStep === 'ANALYSIS' ? "Analyzing psychological drivers" :
              state.currentStep === 'MISSION' ? "Constructing mission parameters" :
                "Architecting execution blueprint"
          }
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={state.showAuthModal}
        onClose={() => setState(prev => ({ ...prev, showAuthModal: false }))}
      />

      {/* New Mission Decision Modal */}
      {state.showNewMissionModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setState(prev => ({ ...prev, showNewMissionModal: false }))}></div>
          <div className="relative bg-white dark:bg-black rounded-2xl shadow-2xl w-full max-w-md p-8 border border-slate-200 dark:border-white/10 animate-fade-in-up">
            <h2 className="text-2xl font-serif text-slate-900 dark:text-white mb-2">New Mission</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">
              Do you want to start completely fresh, or keep your psychological profile and just refine your idea?
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleNewMissionDecision('REFINE')}
                className="w-full py-4 px-6 rounded-xl border border-slate-200 dark:border-white/10 hover:border-slate-900 dark:hover:border-white bg-slate-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all text-left group"
              >
                <span className="block font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">Reuse My Profile</span>
                <span className="block text-xs text-slate-500">Keep your personality analysis. Just enter a new idea/vibe.</span>
              </button>

              <button
                onClick={() => handleNewMissionDecision('FRESH')}
                className="w-full py-4 px-6 rounded-xl border border-transparent hover:bg-red-50 dark:hover:bg-red-900/10 text-left group"
              >
                <span className="block font-bold text-slate-900 dark:text-white mb-1 group-hover:text-red-600">Start Fresh</span>
                <span className="block text-xs text-slate-500">Re-take the personality test and start from scratch.</span>
              </button>
            </div>
            <button
              onClick={() => setState(prev => ({ ...prev, showNewMissionModal: false }))}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </div>
        </div>
      )}

      {state.user && (
        <UserHistoryModal
          isOpen={state.showHistoryModal}
          onClose={() => setState(prev => ({ ...prev, showHistoryModal: false }))}
          user={state.user}
          history={userHistory}
          usageCount={userHistory.length}
          onSelect={(item) => {
            setState(prev => ({
              ...prev,
              mission: item.mission,
              blueprint: item.blueprint,
              currentStep: 'BLUEPRINT',
              showHistoryModal: false,
              checkedTasks: item.checkedTasks || [],
              currentMissionId: item.id
            }));
          }}
          onLogout={() => {
            handleLogout();
            setState(prev => ({ ...prev, showHistoryModal: false }));
          }}
          onReset={handleReset}
          onNewMission={handleNewMissionClick}
          onUpgrade={() => {
            setState(prev => ({ ...prev, showHistoryModal: false, showPricingModal: true }));
          }}
        />
      )}

      {/* Pricing Modal */}
      <PricingModal
        isOpen={state.showPricingModal}
        onClose={() => setState(prev => ({ ...prev, showPricingModal: false }))}
        onSubscribe={() => {
          // Upgrade logic
          if (state.user) {
            const updatedUser = { ...state.user, plan: 'pro' as const };
            setState(prev => ({ ...prev, user: updatedUser, showPricingModal: false }));
            alert("Welcome to the Foundry!");
          } else {
            setState(prev => ({ ...prev, showPricingModal: false }));
            alert("Please sign in first.");
          }
        }}
      />

      <div className="fixed top-6 left-6 z-50 animate-fade-in hidden md:block">
        <ThemeToggle />
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full bg-[#F7F7F5]/80 dark:bg-black/90 backdrop-blur-md border-b border-slate-200 dark:border-white/10 z-40 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={handleLogoClick}>
              <span className="font-serif font-bold text-2xl tracking-tight text-slate-900 dark:text-white">O'flock</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="md:hidden">
              <ThemeToggle />
            </div>
            {state.user ? (
              // User is logged in, UserProfileWidget will handle display
              <UserProfileWidget user={state.user} onClick={() => setState(prev => ({ ...prev, showHistoryModal: true }))} />
            ) : (
              <button
                onClick={() => setState(prev => ({ ...prev, showAuthModal: true }))}
                className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-full hover:bg-white dark:hover:bg-slate-800"
              >
                {state.currentStep === 'DISCLAIMER' ? 'Login' : 'Save Mission'}
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="pt-20 px-4 md:px-6 max-w-6xl mx-auto min-h-screen pb-12">
        {state.error && (
          <div className="max-w-xl mx-auto mb-8 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-center shadow-sm mt-8">
            {state.error}
            <button onClick={() => setState(prev => ({ ...prev, error: null }))} className="block w-full mt-2 text-sm font-semibold hover:text-red-900">Dismiss</button>
          </div>
        )}

        {renderContent()}
      </main>





      {/* LofiWidget handles its own visibility (hidden on mobile landing, visible in onboarding) */}
      <div className={`${state.currentStep === "ONBOARDING" ? "block" : "hidden md:block"}`}>
        <LofiWidget expanded={state.currentStep === "ONBOARDING"} />
      </div>

      {/* LumosWidget handles its own visibility (hidden on mobile, visible on desktop) */}
      {state.currentStep !== 'ONBOARDING' && <LumosWidget />}
    </div>
  );
}