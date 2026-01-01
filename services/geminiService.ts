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

  const prompt = `
    Based on the following psychological profile and user answers, generate ONE single business mission.
    
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
      whyFitsYou: { type: Type.STRING, description: "Who it is for (clear psychological profile) and why it fits the founder." },
      sustainability: { type: Type.STRING, description: "Emotional connection: Why the founder cares and why users will return repeatedly." },
      problemSolved: { type: Type.STRING, description: "Meaningful value: The specific problem being solved or the benefit given." },
      yourRole: { type: Type.STRING, description: "The founder's high-leverage role in this ecosystem." },
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

  let strategyContext = "";
  if (priority.includes("Profit")) {
    strategyContext = "STRATEGY: PROFIT FIRST. clearly monetizable, practical, SaaS-ready, subscription-friendly, financially solid. Price target $10-$35/mo. Discard gimmicks immediately.";
  } else if (priority.includes("Creativity")) {
    strategyContext = "STRATEGY: CREATIVE EXPLORATION. emotionally powerful, original, identity-driven. Must have purpose and users must meaningfully benefit. No single-session novelties.";
  } else {
    strategyContext = "STRATEGY: BALANCED. creativity + practicality. Something beautiful AND realistically monetizable. Avoid one-time-wow tools.";
  }

  const prompt = `
    Create a detailed execution blueprint for this mission: "${mission.title}".
    
    Context:
    Mission: ${JSON.stringify(mission)}
    Profile: ${JSON.stringify(profile)}
    User Aesthetics: Font=${aestheticFont}, Color=${aestheticColor}
    Strategy: ${strategyContext}
    
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
      }
    },
    required: ["actionPlan", "mvpPlan", "marketingStrategy", "branding", "emotionalAnchor", "executionLayer", "prompts", "techStack"],
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
      }
    },
    required: ["actionPlan", "mvpPlan", "marketingStrategy", "branding", "emotionalAnchor", "executionLayer", "prompts", "techStack"],
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