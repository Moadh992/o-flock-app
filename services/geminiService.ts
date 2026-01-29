import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserAnswers, PsychologicalProfile, Mission, Blueprint, ExecutionLayer } from "../types";
import { SYSTEM_INSTRUCTION_BASE } from "../constants";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }
  return new GoogleGenAI({ apiKey });
};

const MODEL_NAME = "gemini-3-pro-preview";
const FAST_MODEL_NAME = "gemini-3-flash-preview";
const THINKING_BUDGET = 32768;

const SYSTEM_COMPONENTS_REFERENCE = `
### SYSTEM COMPONENTS (DESIGN STANDARDS)
Use these components as the standard for all apps. They are pre-styled for "Pure Dark" mode and optimized for B2C SaaS.

1. AuthModal: Multi-view (Google/Email) secure authentication.
2. PricingModal: Premium high-conversion lifetime/subscription offer.
3. UserHistoryModal: Personal "Founder Space" with usage tracking and mission history.

The styling uses:
- Background: bg-[#F7F7F5] (Light) / bg-black (Dark)
- Borders: border-slate-200 / border-white/10
- Typography: Serif headers (font-serif), sans-serif body.
- Backdrops: bg-slate-900/60 / bg-black/80 with backdrop-blur-xl.
`;

export const analyzeProfile = async (answers: UserAnswers): Promise<PsychologicalProfile> => {
  const ai = getClient();

  const prompt = `
    Analyze the following user answers deeply. 
    Construct a psychological profile based on their identity, drive, fears, and ambitions.
    Identify their "Unfair Advantage" that can be monetized.
    
    User Answers:
    ${JSON.stringify(answers, null, 2)}
    
    Output a raw JSON object (no markdown) representing the profile.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      dominantMotivations: { type: Type.STRING, description: "Primary internal motivations identified." },
      psychologicalDrivers: { type: Type.STRING, description: "Psychological drivers pushing them." },
      fearPatterns: { type: Type.STRING, description: "Detected patterns of fear or avoidance." },
      energySources: { type: Type.STRING, description: "Activities or thoughts that give them energy." },
      workingStyle: { type: Type.STRING, description: "Preferred way of working and executing." },
      constraints: { type: Type.STRING, description: "Realistic constraints (time, money, skills)." },
      desireThemes: { type: Type.STRING, description: "Recurring themes in their desires." },
      coreDesire: { type: Type.STRING, description: "One word: Money, Impact, Respect, Legacy, Power, Freedom, or Validation." },
      summary: { type: Type.STRING, description: "A concise paragraph summarizing who they are and their market strength." },
    },
    required: ["dominantMotivations", "psychologicalDrivers", "fearPatterns", "energySources", "workingStyle", "constraints", "desireThemes", "coreDesire", "summary"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: {
          thinkingBudget: THINKING_BUDGET,
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as PsychologicalProfile;
  } catch (error) {
    console.error("Profile Analysis Error:", error);
    throw error;
  }
};

export const generateMission = async (profile: PsychologicalProfile, answers: UserAnswers): Promise<Mission> => {
  const ai = getClient();
  const priority = answers['idea_prioritization'] || 'Balanced Strategy';
  const userAppName = answers['app_name_idea'] || '';

  // Paul Graham Framework: Extract founder's personal context
  const personalFrustration = answers['personal_frustration'] || '';
  const domainExpertise = answers['domain_expertise'] || '';
  const overlookedProblem = answers['overlooked_problem'] || '';
  const buildingSkills = answers['building_skills'] || '';

  let strategyInstruction = "";

  if (priority.includes("Profit")) {
    strategyInstruction = `
      STRATEGY MODE: PROFIT FIRST
      - Focus: clearly monetizable, practical, SaaS-ready, subscription-friendly, financially solid.
      - Prioritize recurring revenue and B2C / prosumer focus.
      - Focus on retention and solving real pain.
      - Price target: $10–$35/month.
      - Discard gimmicks immediately.
      `;
  } else if (priority.includes("Creativity")) {
    strategyInstruction = `
      STRATEGY MODE: CREATIVE EXPLORATION
      - Focus: emotionally powerful, original, identity-driven, artistic or conceptual.
      - Must still be meaningful and have purpose.
      - Users must meaningfully benefit and have a reason to return.
      - Reject "pretty visualizations" or single-session novelties.
      - Must allow for emotional depth, art, narrative, and taste.
      `;
  } else {
    strategyInstruction = `
      STRATEGY MODE: BALANCED
      - Focus: creativity + practicality. Something beautiful AND realistically monetizable.
      - Unique aesthetic or emotional angle but with a real-life ongoing purpose.
      - Must be repeat-use and avoid visual toys or "one-time wow" tools.
      `;
  }

  let nameInstruction = "";
  if (userAppName && userAppName.trim().length > 0) {
    nameInstruction = `The user has suggested the name: "${userAppName}". Use this name (or a slight variation if needed to make it stronger) for the title.`;
  }

  // Paul Graham Framework: Founder-centric idea generation
  const paulGrahamInstruction = `
    PAUL GRAHAM FRAMEWORK (MANDATORY):

    1. SCRATCH YOUR OWN ITCH - The founder stated this personal frustration:
       "${personalFrustration || 'Not specified'}"
       ${personalFrustration ? 'The idea MUST directly address or relate to this frustration. This is non-negotiable.' : 'Generate an idea based on their psychological profile.'}

    2. DOMAIN EXPERTISE - The founder's deep knowledge area:
       "${domainExpertise || 'Not specified'}"
       ${domainExpertise ? 'The idea should leverage this insider knowledge as an unfair advantage.' : ''}

    3. OVERLOOKED PROBLEM - The founder noticed this ignored problem:
       "${overlookedProblem || 'Not specified'}"
       ${overlookedProblem ? 'Consider this insight. Simple solutions to overlooked problems often make the best startups.' : ''}

    4. BUILDING SKILLS - The founder can build:
       "${buildingSkills || 'Not specified'}"
       ${buildingSkills ? 'The MVP MUST be buildable with these skills. Do not suggest ideas requiring skills they lack.' : ''}

    VALIDATION CRITERIA:
    - Does this idea solve a problem the founder personally experiences? (Required if they stated a frustration)
    - Does this leverage the founder's domain expertise? (Strong preference)
    - Can the founder actually build the MVP with their stated skills? (Required)
    - Is this a simple solution that others have overlooked? (Preferred)
  `;

  const prompt = `
    Based on the following psychological profile and user answers, generate ONE single business mission.

    ${paulGrahamInstruction}

    ${strategyInstruction}
    ${nameInstruction}

    Profile: ${JSON.stringify(profile)}
    Original Answers: ${JSON.stringify(answers)}

    Output a raw JSON object.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING, description: "Bold, commercial, authoritative title." },
      coreConcept: { type: Type.STRING, description: "The product/service definition. Include the monetization model." },
      whyFitsYou: { type: Type.STRING, description: "Who it is for (clear psychological profile) and why it fits the founder. MUST reference how this connects to their stated personal frustration and domain expertise." },
      sustainability: { type: Type.STRING, description: "Emotional connection: Why the founder cares and why users will return repeatedly." },
      problemSolved: { type: Type.STRING, description: "Meaningful value: The specific problem being solved. MUST connect to founder's stated frustration if provided." },
      yourRole: { type: Type.STRING, description: "The founder's high-leverage role in this ecosystem, considering their stated building skills." },
    },
    required: ["title", "coreConcept", "whyFitsYou", "sustainability", "problemSolved", "yourRole"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE + " Apply the specific Strategy Mode rules provided in the user prompt.",
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: {
          thinkingBudget: THINKING_BUDGET,
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as Mission;
  } catch (error) {
    console.error("Mission Generation Error:", error);
    throw error;
  }
};

export const generateBlueprint = async (mission: Mission, profile: PsychologicalProfile, answers: UserAnswers): Promise<Blueprint> => {
  const ai = getClient();

  const priority = answers['idea_prioritization'] || 'Balanced Strategy';
  // Extract aesthetics if available, otherwise default
  const aestheticFont = answers['aesthetic_font'] || "Modern Sans-Serif";
  const aestheticColor = answers['aesthetic_color'] || "Clean Minimalist";
  const buildComplexity = answers['build_complexity'] || "Functional MVP";

  // Paul Graham Framework: Extract founder context for blueprint
  const personalFrustration = answers['personal_frustration'] || '';
  const domainExpertise = answers['domain_expertise'] || '';
  const buildingSkills = answers['building_skills'] || '';

  let strategyContext = "";
  if (priority.includes("Profit")) {
    strategyContext = "STRATEGY: PROFIT FIRST. clearly monetizable, practical, SaaS-ready, subscription-friendly, financially solid. Price target $10-$35/mo. Discard gimmicks immediately.";
  } else if (priority.includes("Creativity")) {
    strategyContext = "STRATEGY: CREATIVE EXPLORATION. emotionally powerful, original, identity-driven. Must have purpose and users must meaningfully benefit. No single-session novelties.";
  } else {
    strategyContext = "STRATEGY: BALANCED. creativity + practicality. Something beautiful AND realistically monetizable. Avoid one-time-wow tools.";
  }

  const paulGrahamBlueprintContext = `
    PAUL GRAHAM FRAMEWORK CONTEXT:
    - Founder's Personal Frustration: "${personalFrustration || 'Not specified'}"
    - Founder's Domain Expertise: "${domainExpertise || 'Not specified'}"
    - Founder's Building Skills: "${buildingSkills || 'Not specified'}"

    Apply these principles in the blueprint:
    1. MVP should be the CRUDEST possible version that tests the core hypothesis
    2. Early traction MUST include manual, unscalable tactics (founder-led outreach, personal demos)
    3. Include Lean Canvas validation steps before heavy building
    4. Frame the action plan around learning, not just building
  `;

  const prompt = `
    Create a detailed execution blueprint for this mission: "${mission.title}".

    Context:
    Mission: ${JSON.stringify(mission)}
    Profile: ${JSON.stringify(profile)}
    User Aesthetics: Font=${aestheticFont}, Color=${aestheticColor}
    Strategy: ${strategyContext}

    ${paulGrahamBlueprintContext}

    ${SYSTEM_COMPONENTS_REFERENCE}

    REQUIREMENTS:

    1. Action Plan: A 30-day plan.
       - Week 1: Build Core Value.
       - Week 2-4: Sell/Market/Scale.

    2. MVP Plan: The "Steel Thread" MVP.
       - Focus on the feature that solves the core problem.

    3. Business Execution Layer (PRICING FRAMEWORK):
       - **Monetization**:
         - Define specific pricing tiers. 
         - Profit mode: $10-$35/mo. 
         - Creative mode: Must still have a repeat-use monetization reason.
         - Mention checkout integration (Stripe/Polar).
       - **Landing Page Copy**: Draft real copy.
         - TONE: Cognitive Luxury, Anti-Bloat, Confidence.
       - **Domain**: Suggest 2 premium TLDs (.so, .app, .studio).
       - **Visual Theme**: Finalize high-fidelity aesthetic spec.
         - Theme Name and Intention.

    4. Prompts (INTEGRATION GUIDELINES):
       - **Replit Agent Prompt**: Optimized for Vibe Coding. Integrate AuthModal, PricingModal, and UserHistoryModal using the System Components standards. Build the MVP.
       - **Lovable.dev Prompt**: Follow "Prompt Better" guidelines. Focus on conversion-oriented UI using the provided Modal styling and backdrop standards.
       - **Google AI Studio Prompt**: Use the exact XML structure below, but Ensure the system instructions reflect the need for Auth and History views.
            <role>You are O'flock, a strategic co-founder AI specializing in the psychology of solopreneurship. You are precise, analytical, and supportive but never hype-driven.</role>
            <instructions>
            1. **Plan**: Deconstruct user queries into actionable steps that integrate user authentication and history.
            2. **Execute**: Provide strategic advice on building '${mission.title}'. Focus on the synthesis of media (writing/brand) and code (SaaS utility).
            3. **Validate**: Ensure every piece of advice aligns with the core value of '${profile.coreDesire}'. If a feature creates a treadmill, reject it.
            </instructions>
            <constraints>
            - Verbosity: Low. Be concise.
            - Tone: Serious, Sophisticated, Direct.
            - Knowledge Cutoff: Jan 2025.
            - Grounding: Strictly grounded in the context of building a 'one-person unicorn'.
            </constraints>
            <context>
            User Motivation: ${profile.dominantMotivations}. 
            Psychological Driver: ${profile.psychologicalDrivers}.
            Mission: '${mission.title}' - ${mission.coreConcept}.
            Aesthetic: ${aestheticFont}, ${aestheticColor}.
            </context>
            <output_format>
            Structure response with:
            **Executive Summary**: A 1-sentence strategic overview.
            **Detailed Strategy**: Bullet points focusing on execution and code/media leverage.
            </output_format>

       - **Notion Prompt**: Dashboard for project management.
       - **GitHub**: Readme description.
       
    5. Tech Stack: A list of 4-6 specific technologies/platforms recommended for this mission.
       - Each item MUST have a 'name', the 'domain' of the tool (e.g. nextjs.org), and a concise 'purpose' (e.g. "Primary Framework", "Authentication & Database", "Transactional Email").
       - Focus on modern, high-leverage tools (e.g., Supabase, PostHog, Vercel, Resend).

    6. LEAN CANVAS (Paul Graham Validation Framework):
       - Problem: Top 3 problems/hypotheses to validate with users BEFORE building
       - Customer Segments: Specific early adopter profile (not broad market)
       - Unique Value Proposition: One clear sentence
       - Solution: Top 3 MVP features only
       - Unfair Advantage: What the founder has that can't be copied (domain expertise, audience, etc.)
       - Revenue Streams: Specific pricing model
       - Cost Structure: Key costs to track
       - Key Metrics: 3-5 numbers that indicate success
       - Channels: Specific paths to reach early adopters

    7. EARLY TRACTION TACTICS ("Do Things That Don't Scale"):
       - Manual Outreach: 5 specific actions to find first 10 users (NOT ads or content marketing)
       - Personal Onboarding: Exactly how to onboard each of the first 10 users by hand
       - Founder Selling: How the founder personally sells/demos to early users
       - Community Engagement: Specific communities/forums/groups to engage with
       - Feedback Loops: How to collect and act on user feedback weekly

    8. ITERATION CYCLE (Design Thinking):
       - Empathize: How to deeply understand user pain (interviews, shadowing, etc.)
       - Define: How to refine the problem statement based on learnings
       - Ideate: Approach to brainstorming solutions with users
       - Prototype: What quick prototypes to build for testing
       - Test: How to validate with users before committing to code

    9. FOUNDER-PROBLEM FIT:
       - A paragraph explaining exactly how this mission connects to the founder's stated personal frustration and domain expertise. Why is THIS founder uniquely positioned to solve THIS problem?

    Output a raw JSON object.
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      actionPlan: {
        type: Type.OBJECT,
        properties: {
          week1: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific checklist tasks for Week 1" },
          week2: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific checklist tasks for Week 2" },
          week3: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific checklist tasks for Week 3" },
          week4: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific checklist tasks for Week 4" },
        },
        required: ["week1", "week2", "week3", "week4"]
      },
      mvpPlan: { type: Type.STRING, description: "Exactly what to build first." },
      marketingStrategy: { type: Type.STRING, description: "Growth Leverage, Funnels, and Acquisition." },
      branding: {
        type: Type.OBJECT,
        properties: {
          nameSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          tagline: { type: Type.STRING },
          audienceAngle: { type: Type.STRING },
        },
        required: ["nameSuggestions", "tagline", "audienceAngle"]
      },
      emotionalAnchor: { type: Type.STRING, description: "A reminder using their own words/drivers." },
      executionLayer: {
        type: Type.OBJECT,
        properties: {
          monetization: { type: Type.STRING, description: "Pricing strategy: Profit mode target $10-$35/mo. Creative mode must still have monetization possibility." },
          landingPageCopy: { type: Type.STRING, description: "Positioning-first copy: Headline, Pain/Benefit, Pricing." },
          domainRecommendation: { type: Type.STRING, description: "TLD suggestions and DNS instructions." },
          visualThemeInstructions: { type: Type.STRING, description: "Theme Name, Hex codes, typography, spacing." },
        },
        required: ["monetization", "landingPageCopy", "domainRecommendation", "visualThemeInstructions"]
      },
      prompts: {
        type: Type.OBJECT,
        properties: {
          replit: { type: Type.STRING, description: "Detailed prompt for Replit Agent." },
          lovable: { type: Type.STRING, description: "Highly detailed Lovable.dev prompt." },
          googleAI: { type: Type.STRING, description: "XML-structured system prompt for Gemini 3 in AI Studio." },
          notion: { type: Type.STRING, description: "Prompt to setup the project dashboard." },
          github: { type: Type.STRING, description: "Description for the Repo Readme." },
        },
        required: ["replit", "lovable", "googleAI", "notion", "github"]
      },
      techStack: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            domain: { type: Type.STRING },
            purpose: { type: Type.STRING, description: "Short description of what this tool is used for." }
          },
          required: ["name", "domain", "purpose"]
        },
        description: "List of recommended technologies with their domains for logo fetching."
      },
      // Paul Graham Framework additions
      leanCanvas: {
        type: Type.OBJECT,
        properties: {
          problem: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 3 problems/hypotheses to validate" },
          customerSegments: { type: Type.STRING, description: "Specific early adopter profile" },
          uniqueValueProp: { type: Type.STRING, description: "One clear value proposition sentence" },
          solution: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Top 3 MVP features only" },
          unfairAdvantage: { type: Type.STRING, description: "What the founder has that can't be copied" },
          revenueStreams: { type: Type.STRING, description: "Specific pricing model" },
          costStructure: { type: Type.STRING, description: "Key costs to track" },
          keyMetrics: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 success metrics" },
          channels: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Paths to reach early adopters" }
        },
        required: ["problem", "customerSegments", "uniqueValueProp", "solution", "unfairAdvantage", "revenueStreams", "costStructure", "keyMetrics", "channels"]
      },
      earlyTraction: {
        type: Type.OBJECT,
        properties: {
          manualOutreach: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 specific actions to find first 10 users" },
          personalOnboarding: { type: Type.STRING, description: "How to onboard first 10 users by hand" },
          founderSelling: { type: Type.STRING, description: "How founder personally sells/demos" },
          communityEngagement: { type: Type.STRING, description: "Specific communities to engage with" },
          feedbackLoops: { type: Type.STRING, description: "How to collect and act on feedback" }
        },
        required: ["manualOutreach", "personalOnboarding", "founderSelling", "communityEngagement", "feedbackLoops"]
      },
      iterationCycle: {
        type: Type.OBJECT,
        properties: {
          empathize: { type: Type.STRING, description: "How to understand user pain deeply" },
          define: { type: Type.STRING, description: "How to refine the problem statement" },
          ideate: { type: Type.STRING, description: "Approach to brainstorming with users" },
          prototype: { type: Type.STRING, description: "Quick prototypes to build for testing" },
          test: { type: Type.STRING, description: "How to validate before committing to code" }
        },
        required: ["empathize", "define", "ideate", "prototype", "test"]
      },
      founderProblemFit: { type: Type.STRING, description: "Why THIS founder is uniquely positioned to solve THIS problem" }
    },
    required: ["actionPlan", "mvpPlan", "marketingStrategy", "branding", "emotionalAnchor", "executionLayer", "prompts", "techStack", "leanCanvas", "earlyTraction", "iterationCycle", "founderProblemFit"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE + " " + strategyContext,
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: {
          thinkingBudget: THINKING_BUDGET,
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as Blueprint;
  } catch (error) {
    console.error("Blueprint Generation Error:", error);
    throw error;
  }
};

export const refineBlueprint = async (
  currentBlueprint: Blueprint,
  mission: Mission,
  profile: PsychologicalProfile,
  instructions: string
): Promise<Blueprint> => {
  const ai = getClient();

  const prompt = `
      Refine the following Execution Blueprint based strictly on the user's new constraints or instructions.
      
      Current Blueprint: ${JSON.stringify(currentBlueprint)}
      Mission: ${JSON.stringify(mission)}
      Profile Context: ${JSON.stringify(profile)}
      
      USER INSTRUCTION: "${instructions}"
      
      Directives:
      1. Keep the core mission and branding unless explicitly asked to change.
      2. Update the Action Plan, MVP features, or Tools if the instruction requires it.
      
      ${SYSTEM_COMPONENTS_REFERENCE}
      3. Ensure consistency across the JSON.
      4. If the user asks for a pivot in business model, update the Monetization and Marketing sections accordingly.
      
      5. Tech Stack: Update or maintain the 4-6 specific technologies recommended.
      
      Output a raw JSON object matching the Blueprint schema.
    `;

  // Same schema as generateBlueprint to ensure consistency
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      actionPlan: {
        type: Type.OBJECT,
        properties: {
          week1: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific checklist tasks for Week 1" },
          week2: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific checklist tasks for Week 2" },
          week3: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific checklist tasks for Week 3" },
          week4: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of specific checklist tasks for Week 4" },
        },
        required: ["week1", "week2", "week3", "week4"]
      },
      mvpPlan: { type: Type.STRING, description: "Exactly what to build first." },
      marketingStrategy: { type: Type.STRING, description: "Growth Leverage, Funnels, and Acquisition." },
      branding: {
        type: Type.OBJECT,
        properties: {
          nameSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
          tagline: { type: Type.STRING },
          audienceAngle: { type: Type.STRING },
        },
        required: ["nameSuggestions", "tagline", "audienceAngle"]
      },
      emotionalAnchor: { type: Type.STRING, description: "A reminder using their own words/drivers." },
      executionLayer: {
        type: Type.OBJECT,
        properties: {
          monetization: { type: Type.STRING, description: "Pricing strategy: Profit mode target $10-$35/mo. Creative mode must still have monetization possibility." },
          landingPageCopy: { type: Type.STRING, description: "Positioning-first copy: Headline, Pain/Benefit, Pricing." },
          domainRecommendation: { type: Type.STRING, description: "TLD suggestions and DNS instructions." },
          visualThemeInstructions: { type: Type.STRING, description: "Theme Name, Hex codes, typography, spacing." },
        },
        required: ["monetization", "landingPageCopy", "domainRecommendation", "visualThemeInstructions"]
      },
      prompts: {
        type: Type.OBJECT,
        properties: {
          replit: { type: Type.STRING, description: "Detailed prompt for Replit Agent." },
          lovable: { type: Type.STRING, description: "Highly detailed Lovable.dev prompt." },
          googleAI: { type: Type.STRING, description: "XML-structured system prompt for Gemini 3 in AI Studio." },
          notion: { type: Type.STRING, description: "Prompt to setup the project dashboard." },
          github: { type: Type.STRING, description: "Description for the Repo Readme." },
        },
        required: ["replit", "lovable", "googleAI", "notion", "github"]
      },
      techStack: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            domain: { type: Type.STRING },
            purpose: { type: Type.STRING }
          },
          required: ["name", "domain", "purpose"]
        }
      },
      // Paul Graham Framework additions (optional for refinement)
      leanCanvas: {
        type: Type.OBJECT,
        properties: {
          problem: { type: Type.ARRAY, items: { type: Type.STRING } },
          customerSegments: { type: Type.STRING },
          uniqueValueProp: { type: Type.STRING },
          solution: { type: Type.ARRAY, items: { type: Type.STRING } },
          unfairAdvantage: { type: Type.STRING },
          revenueStreams: { type: Type.STRING },
          costStructure: { type: Type.STRING },
          keyMetrics: { type: Type.ARRAY, items: { type: Type.STRING } },
          channels: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["problem", "customerSegments", "uniqueValueProp", "solution", "unfairAdvantage", "revenueStreams", "costStructure", "keyMetrics", "channels"]
      },
      earlyTraction: {
        type: Type.OBJECT,
        properties: {
          manualOutreach: { type: Type.ARRAY, items: { type: Type.STRING } },
          personalOnboarding: { type: Type.STRING },
          founderSelling: { type: Type.STRING },
          communityEngagement: { type: Type.STRING },
          feedbackLoops: { type: Type.STRING }
        },
        required: ["manualOutreach", "personalOnboarding", "founderSelling", "communityEngagement", "feedbackLoops"]
      },
      iterationCycle: {
        type: Type.OBJECT,
        properties: {
          empathize: { type: Type.STRING },
          define: { type: Type.STRING },
          ideate: { type: Type.STRING },
          prototype: { type: Type.STRING },
          test: { type: Type.STRING }
        },
        required: ["empathize", "define", "ideate", "prototype", "test"]
      },
      founderProblemFit: { type: Type.STRING }
    },
    required: ["actionPlan", "mvpPlan", "marketingStrategy", "branding", "emotionalAnchor", "executionLayer", "prompts", "techStack", "leanCanvas", "earlyTraction", "iterationCycle", "founderProblemFit"],
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_BASE,
        responseMimeType: "application/json",
        responseSchema: schema,
        thinkingConfig: {
          thinkingBudget: THINKING_BUDGET,
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text) as Blueprint;
  } catch (error) {
    console.error("Blueprint Refinement Error:", error);
    throw error;
  }
};

export const generateNameIdeas = async (answers: UserAnswers): Promise<string[]> => {
  const ai = getClient();
  const prompt = `
    Generate 8 distinct, premium, and brandable SaaS names based on the user's profile context.
    
    Styles: 
    - Compound (e.g. Superhuman, O'flock)
    - Abstract (e.g. Lumos, Vercel)
    - Real words (e.g. Notion, Linear)
    - Evocative (e.g. Anchor, Torch)
    
    Context:
    ${JSON.stringify(answers, null, 2)}
    
    Output ONLY a raw JSON array of strings. No markdown.
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: { type: Type.STRING },
  };

  try {
    const response = await ai.models.generateContent({
      model: FAST_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text) as string[];
  } catch (error) {
    console.error("Name Generation Error:", error);
    return [];
  }
};