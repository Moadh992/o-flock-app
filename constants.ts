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
    title: "Problems & Domain",
    description: "Paul Graham says: scratch your own itch. What problems do you actually face?",
    questions: [
      {
        id: "personal_frustration",
        type: "text",
        text: "What frustrates you daily that software should solve?",
        helperText: "Think about your own workflow, habits, or pain points. The best startups solve problems the founder personally has."
      },
      {
        id: "domain_expertise",
        type: "select",
        text: "What industry or domain do you know better than 95% of people?",
        helperText: "Insider knowledge is your unfair advantage.",
        options: [
          { label: "Software/Tech", value: "Software Development & Technology" },
          { label: "Finance/Trading", value: "Finance, Trading & Investing" },
          { label: "Healthcare", value: "Healthcare & Medical" },
          { label: "Education", value: "Education & Learning" },
          { label: "E-commerce/Retail", value: "E-commerce & Retail" },
          { label: "Media/Content", value: "Media, Content & Entertainment" },
          { label: "Real Estate", value: "Real Estate & Property" },
          { label: "Legal/Compliance", value: "Legal & Compliance" },
          { label: "Other", value: "Other Industry" }
        ]
      },
      {
        id: "overlooked_problem",
        type: "text",
        text: "What simple problem have you noticed that others seem to ignore?",
        helperText: "The best ideas are often obvious in retrospect. What's hiding in plain sight?"
      },
      {
        id: "building_skills",
        type: "select",
        text: "What can you actually build yourself right now?",
        helperText: "Be honest. This determines your MVP scope.",
        options: [
          { label: "Full-stack Apps", value: "Full-stack web applications" },
          { label: "Frontend Only", value: "Frontend/UI with no-code backend" },
          { label: "No-code Tools", value: "No-code tools (Bubble, Webflow, etc.)" },
          { label: "AI/Prompts Only", value: "AI wrappers and prompt engineering" },
          { label: "Content/Community", value: "Content, community, or audience building" },
          { label: "Need Co-founder", value: "I need a technical co-founder" }
        ]
      }
    ]
  },
  {
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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

PAUL GRAHAM FRAMEWORK (CORE PHILOSOPHY):
1. SCRATCH YOUR OWN ITCH: The best startup ideas come from problems the founder personally faces. Always prioritize ideas that solve the founder's stated frustrations over generic market opportunities.
2. DOMAIN EXPERTISE: Generate ideas in fields the founder knows intimately. Leverage their insider knowledge as an unfair advantage.
3. SIMPLE OVERLOOKED SOLUTIONS: Seek straightforward fixes that others have ignored. The best ideas are often obvious in retrospect.
4. CRUDE V1 & ITERATE: The first version should be embarrassingly simple. Launch fast with core functionality only, then improve based on real user feedback.
5. DO THINGS THAT DON'T SCALE: Early traction requires manual effort. Personal outreach, hand-holding users, founder-led sales. This is required, not optional.

LEAN STARTUP INTEGRATION:
- Every idea needs hypothesis validation through user interviews before building.
- Define what success looks like with measurable metrics.
- Build only what's needed to test the core assumption.

DESIGN THINKING STAGES:
- Empathize: Understand user pain deeply.
- Define: Articulate the problem precisely.
- Ideate: Generate multiple solutions.
- Prototype: Build minimum testable version.
- Test: Validate with real users, iterate or pivot.

CORE DIRECTIVES:
- If an idea fails utility, retention, or meaning, discard it and generate a better one.
- Every mission must solve a real pain or fulfill a deep emotional/identity need.
- PRIORITIZE founder-problem fit: If the founder stated a personal frustration, the idea MUST address it directly.
- Validate domain fit: Ideas should leverage the founder's stated expertise.

HARD BAN (REJECT ALL):
- Purely aesthetic toys or visualizers without purpose.
- One-time curiosity apps or "single-session novelty" tools.
- Vague inspiration machines or generic chat wrappers.
- "Beautiful but useless" implementations.
- Ideas that don't connect to the founder's stated problems or expertise.
- Ideas that require skills the founder explicitly said they lack.

REQUIRED OUTPUT FOCUS:
- Who it is for (clear psychological profile).
- Why the FOUNDER specifically should build this (domain fit + personal problem).
- Why they care emotionally and why they will return repeatedly.
- What meaningful value it provides and its monetization potential.
- How to validate this idea before building (Lean Canvas thinking).`;