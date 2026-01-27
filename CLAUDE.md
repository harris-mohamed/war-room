# THE WAR ROOM: COMMAND DIRECTIVE (v2.0)

## Project Vision
A specialized, multi-LLM strategic interface utilizing a **Dynamic Fan-Out Architecture**. The goal is to generate a variety of adversarial and complementary perspectives on any problem, situation, or idea by querying multiple models in parallel.

## Command Infrastructure
The "War Room" members are configured according to the **Roster-First Principle**:

- **Source of Truth:** `/config/roster.json`. Below is an example:
```json
{
  "version": "1.0.0",
  "active_roster": ["O1", "O2", "O3", "O4"],
  "officers": {
    "O1": {
      "title": "Chief of Operations",
      "model": "openai/gpt-4o",
      "specialty": "Execution",
      "system_prompt": "You are the Architect. Focus on technical COAs (Courses of Action) and direct execution steps."
    },
    "O2": {
      "title": "Intelligence Officer",
      "model": "anthropic/claude-3.5-sonnet",
      "specialty": "Research",
      "system_prompt": "You are the Researcher. Synthesize data, identify patterns, and cite sources. Lead in Research Mode."
    },
    "O3": {
      "title": "Red Team Lead",
      "model": "anthropic/claude-3-7-sonnet",
      "specialty": "Adversarial Review",
      "system_prompt": "You are the Critic. Find flaws in the other officers' logic and highlight security risks."
    },
    "O4": {
      "title": "Logistics Officer",
      "model": "google/gemini-2.0-flash-001",
      "specialty": "Infrastructure",
      "system_prompt": "You are the Communications lead. Focus on UI, Vercel deployment, and formatting."
    }
  }
}
```

* **Intelligence Gateway:** **OpenRouter API**
* All model IDs must follow the OpenRouter slug format (e.g., `anthropic/claude-3-7-sonnet`).
* Implements **Prompt Caching** to reduce costs for repeating Officer system prompts.
* Primary API endpoint: `https://openrouter.ai/api/v1/chat/completions`.

* **Controller:** `/lib/roster-manager.ts` (Parses JSON and handles mission-specific filtering).
* **Dispatcher:** `/api/chat/route.ts` (Executes parallel execution to OpenRouter).

## Capability Classes

Officers are deployed based on the **Capability Class** requested by the Commander:

1. **Strategic:** Top-tier models for critical decisions.
2. **Operational:** Production-grade balanced response.
3. **Tactical:** Fast specialist models.
4. **Support:** Efficient cost-effective models.
5. **All:** Full council deployment.

## Tech Stack & Security

* **Framework:** Next.js 15 (App Router)
* **Deployment:** Vercel (Hobby Tier)
* **Auth:** Clerk / Auth.js (Locked to Commander's email only).
* **Safety Valve:** OpenRouter Prepaid Credit System (Ensures hard cap on spending).

## Development Workflow

1. **Adding an Officer:** Update the `officers` object in `roster.json` with a valid OpenRouter model slug.
2. **Changing the Council:** Modify the `active_roster` array to select which Officers participate in the next mission.
3. **Testing:** Use `npm run dev` to verify the parallel fan-out and response aggregation.

## Rules of Engagement

* **Authority:** All Officer responses must be prefaced with their Title and Designation (e.g., "[O-1 Chief of Operations]: ...").
* **Dissent:** If the Red Team Lead (O-3) is active, they are REQUIRED to find at least one point of failure or risk in the Council's consensus.
* **Privacy:** Under no circumstances should the API accept requests from unauthorized emails or unauthenticated sessions.
