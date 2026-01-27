import { Officer } from "./roster-manager";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

// Demo responses for "Analyze Evernote's downfall"
const DEMO_RESPONSES: Record<string, string> = {
  O1: `**Executive Analysis: Evernote's Strategic Missteps**

The collapse of Evernote represents a classic case of strategic drift and execution failure. Here are the critical factors:

**1. Product Bloat & Loss of Focus**
- Started as a simple note-taking app, became a cluttered everything-app
- Added features (Work Chat, Context, Spaces) that users didn't request
- Core note-taking experience degraded while complexity increased

**2. Pricing & Monetization Failures**
- Multiple pricing tier changes confused and alienated users
- Free tier became increasingly restrictive (2-device limit in 2016)
- Premium features weren't compelling enough to justify cost
- Failed to find sustainable business model between freemium and enterprise

**3. Leadership Instability**
- 5 CEOs between 2015-2023 created strategic whiplash
- Each leadership change brought new direction, fragmenting product vision
- Phil Libin's departure (2015) marked the end of founder-led clarity

**4. Technical Debt & Performance Issues**
- Sync problems plagued users for years
- App became slow and resource-heavy
- Competitors offered faster, more reliable alternatives

**5. Market Disruption**
- Notion, Roam Research, Obsidian offered superior experiences
- Microsoft OneNote, Apple Notes became "good enough" free alternatives
- Failed to differentiate beyond "we were here first"

**Recommendation:** Evernote's downfall is a cautionary tale about maintaining product discipline, sustainable pricing, and technical excellence. Modern SaaS companies must resist feature bloat and prioritize core user needs over growth-at-all-costs strategies.`,

  O2: `**Intelligence Report: Evernote Decline - Data Synthesis**

After analyzing market data, user sentiment, and competitive dynamics, here are the key patterns:

**Timeline of Decline:**
- **2008-2012:** Golden era - product-market fit, rapid growth, reached 100M users by 2014
- **2015-2016:** Peak valuation ($1B unicorn status), but cracks appearing
- **2016-2018:** User exodus begins as pricing changes and product bloat intensify
- **2018-2020:** Desperate pivots, enterprise focus shift
- **2020-2023:** Acquisition by Bending Spoons (2022), massive layoffs, damage control

**Quantifiable Failures:**
- Lost ~75% of market share between 2016-2021 (estimated based on app store rankings)
- Employee count dropped from 400+ to under 100 post-acquisition
- App Store ratings declined from 4.5+ stars to 2.5-3 stars during 2016-2019 period
- Premium subscriber growth stagnated despite aggressive upselling

**Competitor Analysis:**
| Competitor | Launch | Key Advantage Over Evernote |
|------------|--------|----------------------------|
| Notion | 2016 | Databases, collaboration, modern UX |
| Roam Research | 2019 | Bi-directional linking, knowledge graphs |
| Obsidian | 2020 | Local-first, markdown, extensibility |
| Apple Notes | Pre-existing | Free, native, "good enough" |

**User Sentiment Analysis (Reddit, Twitter, HN):**
- Top complaints: sync issues (43%), pricing (38%), bloat (31%), performance (27%)
- Migration discussions peaked in 2018-2019
- "Evernote alternatives" searches increased 300% from 2016-2020

**Critical Insight:** Evernote failed to recognize that note-taking is a deeply personal workflow. Users invested years building their system in Evernote, but mounting frustrations eventually overcame switching costs. The lesson: Trust is hard-won but easily lost through degraded experience.`,

  O3: `**Red Team Assessment: What They Got Wrong**

Let me tear apart the strategic failures and identify the vulnerabilities that weren't addressed:

**CRITICAL FLAW #1: Ignored Network Effects Opportunity**
Evernote positioned itself as a personal tool when collaboration was clearly the future. Notion understood this. Evernote didn't. By the time they bolted on "Spaces" and team features, it was too late and poorly executed.

**CRITICAL FLAW #2: Technical Architecture Rot**
The sync engine was fundamentally broken for YEARS. This wasn't a minor bug—it was a core competency failure. Users reported:
- Lost notes (unacceptable for a note-taking app)
- Conflict resolution disasters
- Slow sync times (minutes vs. seconds for competitors)

They never rebuilt the foundation. They just painted over the cracks.

**CRITICAL FLAW #3: Elephant in the Room (Literally)**
The brand identity became a liability. "Remember Everything" was their tagline, but users couldn't even reliably save a note. The elephant logo became associated with a slow, bloated product. Brand damage is hard to quantify but deadly.

**CRITICAL FLAW #4: Proprietary Format Lock-In Backfired**
Evernote used a proprietary .enex format thinking it would create lock-in. Instead:
- Users felt trapped and resentful
- When they finally left, they had to use painful export tools
- Competitors embraced Markdown and won goodwill

Notion, Obsidian, and others used open formats. Users felt in control. Evernote felt like a walled garden prison.

**CRITICAL FLAW #5: Enterprise Pivot Was Too Late and Half-Baked**
Trying to go upmarket in 2018 when you have:
- A consumer brand
- No real enterprise features (SSO, admin controls, compliance were afterthoughts)
- Established competitors (Microsoft, Google, Atlassian) dominating enterprise

This was a Hail Mary, not a strategy.

**The Real Killer:** Evernote stopped being a product people loved and became a product people tolerated... until they didn't. No amount of marketing can overcome a degraded user experience. The other officers will sugarcoat this. I won't. Evernote's leadership ignored warning signs for years and paid the price.`,

  O4: `**Logistics & Infrastructure Analysis: The Operational Breakdown**

From an infrastructure and user experience perspective, Evernote's operational failures compounded their strategic missteps:

**UI/UX Deterioration:**
- Multiple redesigns (2013, 2015, 2019) that removed features users relied on
- Desktop apps became bloated Electron wrappers (slower, higher memory usage)
- Web clipper (a killer feature) became buggy and unreliable
- Mobile apps fell behind iOS/Android design standards
- Inconsistent experience across platforms (web, desktop, mobile)

**Deployment & Technical Operations:**
- Frequent outages during critical periods (2016-2018)
- No clear API strategy—third-party integrations withered
- Slow to adopt modern web technologies (competitors shipped faster)
- Legacy codebase made iteration slow and expensive

**Infrastructure Costs vs. Revenue:**
- Hosting millions of free users with unlimited note storage was unsustainable
- AWS bills grew while revenue per user stagnated
- Had to impose device limits and upload caps to control costs
- This created user hostility—felt like bait-and-switch

**Migration/Export Experience:**
- Poor export tools made leaving difficult (intentionally?)
- When users did export, .enex format was hard to convert
- Competitors offered "Import from Evernote" as a feature (Notion, OneNote)
- Exit friction created negative word-of-mouth

**Modern SaaS Best Practices They Missed:**
- No freemium-to-paid conversion funnel optimization
- Weak onboarding (competitors had interactive tutorials)
- No viral loops or referral programs
- Poor customer success operations (support was slow/unhelpful)

**Vercel/Modern Deployment Lens:**
Evernote's infrastructure was monolithic when competitors were shipping fast with modern stacks. If they had embraced:
- Jamstack architecture for speed
- Edge functions for sync
- Modern CI/CD for rapid iteration
- Microservices for feature modularity

...they might have been able to iterate faster and compete. Instead, they were stuck with legacy tech debt that slowed everything down.

**Conclusion:** Operational excellence matters. Evernote lost because they couldn't ship fast enough, fix critical bugs quickly enough, or provide an experience that justified their premium pricing. The infrastructure and UX degradation was a symptom of deeper organizational dysfunction.`,
};

/**
 * Get demo response for an officer
 */
function getDemoResponse(officerId: string): string {
  return DEMO_RESPONSES[officerId] || `Demo response from ${officerId}: This is a demonstration of the War Room interface. In live mode with an API key, real AI models would analyze your query.`;
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface OpenRouterResponse {
  id: string;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call OpenRouter API for a single officer
 * @param customApiKey - Optional API key from user (session-only, takes precedence)
 */
export async function callOfficer(
  officer: Officer,
  userMessage: string,
  conversationHistory: Message[] = [],
  customApiKey?: string
): Promise<{ officerId: string; content: string; error?: string }> {
  // Check for custom API key first (user-provided), then fallback to env
  const apiKey = customApiKey || process.env.OPENROUTER_API_KEY;
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  // If no API key and demo mode is enabled, return demo response
  if (!apiKey && isDemoMode) {
    // Simulate API delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

    return {
      officerId: officer.id,
      content: getDemoResponse(officer.id),
    };
  }

  // If no API key and not in demo mode, throw error
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set in environment variables");
  }

  try {
    // Build messages array with system prompt and history
    const messages: Message[] = [
      {
        role: "system",
        content: officer.system_prompt,
      },
      ...conversationHistory,
      {
        role: "user",
        content: userMessage,
      },
    ];

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "War Room",
      },
      body: JSON.stringify({
        model: officer.model,
        messages,
        // Prompt caching - cache the system prompt
        transforms: ["middle-out"],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter error for ${officer.id}:`, errorText);
      return {
        officerId: officer.id,
        content: "",
        error: `API Error: ${response.status} - ${errorText}`,
      };
    }

    const data: OpenRouterResponse = await response.json();

    return {
      officerId: officer.id,
      content: data.choices[0]?.message?.content || "No response",
    };
  } catch (error) {
    console.error(`Error calling officer ${officer.id}:`, error);
    return {
      officerId: officer.id,
      content: "",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Call multiple officers in parallel (Dynamic Fan-Out Architecture)
 * @param customApiKey - Optional API key from user (session-only)
 */
export async function callOfficersParallel(
  officers: Officer[],
  userMessage: string,
  conversationHistory: Message[] = [],
  customApiKey?: string
): Promise<Array<{ officerId: string; content: string; error?: string }>> {
  // Execute all officer calls in parallel
  const promises = officers.map((officer) =>
    callOfficer(officer, userMessage, conversationHistory, customApiKey)
  );

  // Wait for all to complete
  const results = await Promise.all(promises);

  return results;
}
