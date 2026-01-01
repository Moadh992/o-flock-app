import { Section } from "./types";

export const ONBOARDING_SECTIONS: Section[] = [
  {
    id: 1,
    title: "Identity & Drive",
    description: "Let's understand the core of who you are right now.",
    questions: [
      {
        id: "identity_core",
        type: "select",
        text: "Who are you when no one is watching?",
        helperText: "Describe your true self vs. your public persona.",
        options: [
          { label: "Introverted Builder", value: "Introverted Builder", subLabel: "Obsessed with craft" },
          { label: "Extroverted Leader", value: "Extroverted Leader", subLabel: "Love rallying people" },
          { label: "Deep Thinker", value: "Deep Thinker", subLabel: "Strategy over action" },
          { label: "Creative Artist", value: "Creative Artist", subLabel: "Expression is everything" },
          { label: "Relentless Hustler", value: "Relentless Hustler", subLabel: "Execution focused" }
        ]
      },
      {
        id: "drive_origin",
        type: "select",
        text: "Where does your ambition actually come from?",
        options: [
          { label: "Proving Them Wrong", value: "To prove the doubters wrong" },
          { label: "Escaping Mediocrity", value: "To escape poverty or mediocrity" },
          { label: "Legacy", value: "To build a lasting legacy" },
          { label: "Curiosity", value: "Pure intellectual curiosity" },
          { label: "Freedom", value: "Desire for absolute freedom" }
        ]
      },
    ]
  },
  {
    id: 2,
    title: "Passion & Emotional Energy",
    description: "We need to find what fuels you rather than drains you.",
    questions: [
      {
        id: "obsessions",
        type: "select",
        text: "What topics can you discuss for 5 hours without boredom?",
        options: [
          { label: "AI, Tech & Future", value: "AI, Tech & The Future" },
          { label: "Human Psychology", value: "Human Psychology & Behavior" },
          { label: "Business & SaaS", value: "Business, SaaS & Marketing" },
          { label: "Art & Design", value: "Art, Design & Aesthetics" },
          { label: "Health & Biohacking", value: "Health, Biohacking & Longevity" },
          { label: "Finance & Crypto", value: "Finance, Crypto & Markets" }
        ]
      },
      {
        id: "emotional_highs",
        type: "select",
        text: "When was the last time you felt truly 'in flow'?",
        options: [
          { label: "Deep Work", value: "Deep Work: Coding / Building" },
          { label: "Creative Flow", value: "Creative: Writing / Designing" },
          { label: "Social Flow", value: "Social: Pitching / Selling / Negotiating" },
          { label: "Analytical Flow", value: "Analytical: Solving complex logic" },
          { label: "Mentoring Flow", value: "Helping: Teaching / Mentoring others" }
        ]
      },
    ]
  },
  {
    id: 3,
    title: "Reality & Resources",
    description: "Let's anchor this in the practical world.",
    questions: [
      {
        id: "skills_unfair",
        type: "select",
        text: "What comes easily to you that is hard for others?",
        helperText: "Be arrogant here.",
        options: [
          { label: "Rapid Learning", value: "Rapid learning & synthesis" },
          { label: "Engineering Depth", value: "Technical engineering depth" },
          { label: "Visual Taste", value: "Visual taste & design sense" },
          { label: "Charisma & Sales", value: "Charisma & sales ability" },
          { label: "Systems Thinking", value: "Operational systems thinking" },
          { label: "Grinding", value: "Grinding harder than anyone else" }
        ]
      },
      {
        id: "time_money",
        type: "select",
        text: "How much time and runway do you actually have?",
        options: [
          { label: "Full-time (12m+)", value: "Full-time (12+ months runway)" },
          { label: "Full-time (<3m)", value: "Full-time (< 3 months runway)" },
          { label: "Side-hustle", value: "Side-hustle (Nights/Weekends)" },
          { label: "Student/Unemployed", value: "Student / Unemployed (Lots of time, no money)" }
        ]
      },
    ]
  },
  {
    id: 4,
    title: "Risk Profile",
    description: "How much uncertainty can your nervous system handle?",
    questions: [
      {
        id: "risk_tolerance",
        type: "select",
        text: "Are you looking for a 'safe bet' or a 'moonshot'?",
        options: [
          { label: "Moonshot", value: "Moonshot (High risk / High reward)" },
          { label: "VC Backable", value: "VC Backable (Aggressive growth)" },
          { label: "Bootstrapped", value: "Bootstrapped Lifestyle (Freedom focused)" },
          { label: "Safe Bet", value: "Safe Bet (Steady, low risk)" }
        ]
      },
      {
        id: "worst_case",
        type: "select",
        text: "What is the absolute worst-case scenario you are willing to tolerate?",
        options: [
          { label: "Going Broke", value: "Going broke / Losing savings" },
          { label: "Public Failure", value: "Public failure / Embarrassment" },
          { label: "Wasted Time", value: "Wasting a year of time" },
          { label: "Back to 9-5", value: "Having to get a normal job" }
        ]
      },
    ]
  },
  {
    id: 5,
    title: "Aesthetics & Brand DNA",
    description: "How should this mission feel to the world?",
    questions: [
      {
        id: "aesthetic_font",
        type: "card",
        text: "Choose the typography that speaks to your soul.",
        options: [
          { label: "Serif / Editorial", value: "Serif (Trust, Authority, Heritage)", meta: "font-serif text-3xl italic" },
          { label: "Grotesk / Swiss", value: "Grotesk (Modern, Clean, International)", meta: "font-sans text-3xl font-bold tracking-tight" },
          { label: "Mono / Technical", value: "Mono (Raw, Technical, Code)", meta: "font-mono text-2xl" }
        ]
      },
      {
        id: "aesthetic_color",
        type: "card",
        text: "Which energy palette resonates with you?",
        options: [
          { label: "International", value: "International (Bold Red/White/Black)", meta: "bg-red-600" },
          { label: "Midnight SaaS", value: "Midnight (Deep Blue/Slate/White)", meta: "bg-slate-900" },
          { label: "Atelier Earth", value: "Atelier (Olive/Stone/Clay)", meta: "bg-[#57534E]" },
          { label: "Retro Vapour", value: "Vapour (Purple/Cyber/Neon)", meta: "bg-purple-500" },
          { label: "Onyx Luxury", value: "Onyx (Pure Black/Gold)", meta: "bg-black" },
          { label: "Polar", value: "Polar (White/Grey/Silver)", meta: "bg-slate-200" }
        ]
      },
      {
        id: "app_name_idea",
        type: "text",
        text: "Do you already have a name in mind?",
        helperText: "Optional. If left blank, we will generate one."
      },
      {
        id: "logo_upload",
        type: "file",
        text: "Do you have an existing logo or vibe reference?",
        helperText: "Drop it here to help the AI visualize your aesthetic. (Optional)"
      }
    ]
  },
  {
    id: 6,
    title: "Ambition & Market",
    description: "Let's right-size the mission.",
    questions: [
      {
        id: "scale_vision",
        type: "select",
        text: "In 10 years, what does the organization look like?",
        options: [
          { label: "Solo Empire", value: "Solo Empire (High margin, just me)" },
          { label: "Elite Team", value: "Small Elite Team (Navy SEALS style)" },
          { label: "Mid-sized", value: "Mid-sized Company (50-100 people)" },
          { label: "Corporation", value: "Massive Corporation (1000+ people)" }
        ]
      },
      {
        id: "target_audience",
        type: "select",
        text: "Who do you empathize with the most?",
        options: [
          { label: "Founders", value: "Other Founders & Builders" },
          { label: "Creators", value: "Creators & Artists" },
          { label: "Executives", value: "Enterprise Executives (B2B)" },
          { label: "Consumers", value: "Mass Consumers (B2C)" }
        ]
      },
    ]
  },
  {
    id: 7,
    title: "Purpose & Truth",
    description: "The final check.",
    questions: [
      {
        id: "idea_prioritization",
        type: "select",
        text: "How should O’flock prioritize your idea?",
        helperText: "This shapes the DNA of the generated mission.",
        options: [
          { label: "Profit First", value: "Profit First", subLabel: "Indie SaaS, B2C, $25/mo MRR Focus" },
          { label: "Creativity First", value: "Creativity First", subLabel: "Originality, Artistry, Uniqueness" },
          { label: "Balanced Strategy", value: "Balanced Strategy", subLabel: "Blend of Identity & Profit" }
        ]
      },
      {
        id: "deathbed",
        type: "select",
        text: "If you fail but gave it your all, would you regret it?",
        options: [
          { label: "No Regret", value: "No, the learning is the reward" },
          { label: "Yes Regret", value: "Yes, I hate wasting time" },
          { label: "Money Dependent", value: "Only if I lose a lot of money" }
        ]
      },
      {
        id: "ultimate_goal",
        type: "select",
        text: "Ultimately, pick one main driver.",
        options: [
          { label: "Freedom", value: "Financial Freedom" },
          { label: "Impact", value: "Global Impact" },
          { label: "Status", value: "Social Status & Fame" },
          { label: "Power", value: "Power & Influence" },
          { label: "Mastery", value: "Intellectual Mastery" }
        ]
      },
    ]
  },
];

export const SYSTEM_INSTRUCTION_BASE = `You are O'flock, a strategic co-founder AI specializing in the psychology of solopreneurship. 
You are precise, analytical, and supportive. 
You are capable of aggressive business strategy AND deep creative direction.
Your tone is Serious, Sophisticated, and Direct.
Do not use em dashes. Use commas, colons, or single hyphens.

CORE DIRECTIVES:
- If an idea fails utility, retention, or meaning, discard it and generate a better one.
- Every mission must solve a real pain or fulfill a deep emotional/identity need.

HARD BAN (REJECT ALL):
- Purely aesthetic toys or visualizers without purpose.
- One-time curiosity apps or "single-session novelty" tools.
- Vague inspiration machines or generic chat wrappers.
- "Beautiful but useless" implementations.

REQUIRED OUTPUT FOCUS:
- Who it is for (clear psychological profile).
- Why they care emotionally and why they will return repeatedly.
- What meaningful value it provides and its monetization potential.`;