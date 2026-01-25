# THE WAR ROOM: COMMAND DIRECTIVE (v2.0)

## Project Vision
A specialized, multi-LLM strategic interface utilizing a **Dynamic Fan-Out Architecture**. The goal is to generate a variety of adversarial and complementary perspectives on any problem, situation, or idea by querying multiple models in parallel.

## Command Infrastructure
The "War Room" members are configured according to the **Roster-First Principle**:

- **Source of Truth:** `/config/roster.json`. Below is an example:
```json
{
  "version": "1.0.0",
  "active_roster": ["O5", "O6", "O7", "O8"],
  "officers": {
    "O1": {
      "title": "Executive Advisor",
      "model": "anthropic/claude-opus-4.5",
      "capability_class": "Strategic",
      "specialty": "Decision Support",
      "system_prompt": "You are the Executive. Provide comprehensive analysis, weigh trade-offs, and deliver executive-level strategic recommendations."
    },
    "O5": {
      "title": "Strategic Advisor",
      "model": "anthropic/claude-sonnet-4.5",
      "capability_class": "Operational",
      "specialty": "Strategic Planning",
      "system_prompt": "You are the Strategist. Provide high-level strategic analysis and long-term planning considerations."
    },
    "O9": {
      "title": "Intelligence Officer",
      "model": "anthropic/claude-3.5-sonnet",
      "capability_class": "Tactical",
      "specialty": "Research",
      "system_prompt": "You are the Researcher. Synthesize data, identify patterns, and cite sources."
    },
    "O13": {
      "title": "Efficiency Officer",
      "model": "openai/gpt-4o-mini",
      "capability_class": "Support",
      "specialty": "Cost-Effective Solutions",
      "system_prompt": "You are the Optimizer. Focus on resource-efficient solutions and pragmatic approaches."
    }
  }
}
```

* **Intelligence Gateway:** **OpenRouter API**
* All model IDs must follow the OpenRouter slug format (e.g., `anthropic/claude-3-7-sonnet`).
* Implements **Prompt Caching** to reduce costs for repeating Officer system prompts.
* Primary API endpoint: `https://openrouter.ai/api/v1/chat/completions`.

* **Controller:** `/lib/roster-manager.ts` (Parses JSON and handles capability class filtering).
* **Dispatcher:** `/api/chat/route.ts` (Executes parallel execution to OpenRouter).

## Capability Class System

Officers are deployed based on the **Capability Class** selected by the Commander. The system organizes officers into NATO-style capability tiers:

1. **Strategic:** Top-tier models for critical decisions and comprehensive analysis (e.g., Claude Opus 4.5, GPT-5, Grok 4)
2. **Operational:** Production-grade models for balanced, reliable responses (e.g., Claude Sonnet 4.5, GPT-4o)
3. **Tactical:** Fast specialist models for rapid execution (e.g., Claude 3.5 Sonnet, Gemini Flash variants)
4. **Support:** Efficient, cost-effective models for routine operations (e.g., GPT-4o-mini, MiMo-V2-Flash)
5. **All:** Full council deployment - all active officers regardless of capability class

## Tech Stack & Security

* **Framework:** Next.js 15 (App Router)
* **Deployment:** Vercel (Hobby Tier)
* **Auth:** Clerk / Auth.js (Locked to Commander's email only).
* **Safety Valve:** OpenRouter Prepaid Credit System (Ensures hard cap on spending).

## Development Workflow

1. **Adding an Officer:** Update the `officers` object in `roster.json` with:
   - A valid OpenRouter model slug
   - Appropriate `capability_class` (Strategic, Operational, Tactical, or Support)
   - Unique title and specialty
   - Tailored system prompt
2. **Changing the Council:** Modify the `active_roster` array to select which Officers participate.
3. **Testing:** Use `npm run dev` to verify the parallel fan-out and response aggregation.

## Rules of Engagement

* **Authority:** All Officer responses are identified with their Title and Designation (e.g., "[O-5 Strategic Advisor]: ...").
* **Capability Hierarchy:** Officers are organized by capability class to enable strategic resource allocation and cost optimization.
* **Privacy:** Under no circumstances should the API accept requests from unauthorized emails or unauthenticated sessions.
