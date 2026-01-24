import { Officer } from "./roster-manager";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

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
 */
export async function callOfficer(
  officer: Officer,
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<{ officerId: string; content: string; error?: string }> {
  const apiKey = process.env.OPENROUTER_API_KEY;

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
 */
export async function callOfficersParallel(
  officers: Officer[],
  userMessage: string,
  conversationHistory: Message[] = []
): Promise<Array<{ officerId: string; content: string; error?: string }>> {
  // Execute all officer calls in parallel
  const promises = officers.map((officer) =>
    callOfficer(officer, userMessage, conversationHistory)
  );

  // Wait for all to complete
  const results = await Promise.all(promises);

  return results;
}
