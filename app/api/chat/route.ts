import { NextRequest, NextResponse } from "next/server";
import { getOfficersForMission, getOfficerById, type CapabilityClass } from "@/lib/roster-manager";
import { callOfficersParallel, type Message } from "@/lib/openrouter";

// Frontend Message type (from ChatInterface.tsx)
interface FrontendMessage {
  id: string;
  type: "user" | "officer";
  content: string;
  officerId?: string;
  officerTitle?: string;
  officerModel?: string;
  capabilityClass?: CapabilityClass;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  capabilityClass: CapabilityClass;
  conversationHistory?: FrontendMessage[];
}

export interface OfficerResponse {
  officerId: string;
  officerTitle: string;
  officerModel: string;
  content: string;
  error?: string;
}

export interface ChatResponse {
  responses: OfficerResponse[];
  error?: string;
}

// Valid memory modes
type MemoryMode = "isolated" | "collaborative";

function validateMemoryMode(mode: string): MemoryMode {
  if (mode === "collaborative") return "collaborative";
  return "isolated"; // Default fallback
}

/**
 * Build per-officer conversation history.
 * Each officer sees:
 * - All user messages
 * - Officer responses based on memory mode:
 *   - "isolated": Only their own previous responses (default)
 *   - "collaborative": All officers' previous responses
 * - Limited to last N exchanges (user + officer pairs)
 */
function buildOfficerHistory(
  allMessages: FrontendMessage[],
  officerId: string,
  memoryDepth: number,
  memoryMode: MemoryMode
): Message[] {
  // Filter messages based on memory mode
  const relevantMessages = allMessages.filter((msg) => {
    // Always include user messages
    if (msg.type === "user") return true;

    // Filter officer messages based on memory mode
    switch (memoryMode) {
      case "isolated":
        // Current behavior: only this officer's responses
        return msg.officerId === officerId;

      case "collaborative":
        // New behavior: all officers' responses
        return msg.type === "officer";

      default:
        // Fallback to isolated mode
        return msg.officerId === officerId;
    }
  });

  // Take last N exchanges (each exchange = user message + officer response)
  // Memory depth of 5 means last 10 messages (5 user + 5 officer)
  const recentMessages = relevantMessages.slice(-memoryDepth * 2);

  // Convert to OpenRouter message format
  return recentMessages.map((msg) => ({
    role: msg.type === "user" ? "user" : "assistant",
    content: msg.content,
  }));
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, capabilityClass, conversationHistory = [] } = body;

    // Validate input
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    if (!capabilityClass) {
      return NextResponse.json(
        { error: "Capability class is required" },
        { status: 400 }
      );
    }

    // Get officers for this capability class
    const officers = getOfficersForMission(capabilityClass);

    if (officers.length === 0) {
      return NextResponse.json(
        { error: "No officers available for this capability class" },
        { status: 500 }
      );
    }

    console.log(`[War Room] Capability ${capabilityClass}: Deploying ${officers.length} officers`);
    console.log(`[War Room] Officers: ${officers.map(o => o.id).join(", ")}`);

    // Get memory configuration from environment
    const memoryDepth = parseInt(process.env.OFFICER_MEMORY_DEPTH || "5", 10);
    const memoryMode = validateMemoryMode(process.env.OFFICER_MEMORY_MODE || "isolated");

    // Build per-officer histories
    const officersWithHistory = officers.map((officer) => ({
      officer,
      history: buildOfficerHistory(conversationHistory, officer.id, memoryDepth, memoryMode),
    }));

    console.log(`[War Room] Memory depth: ${memoryDepth} exchanges, mode: ${memoryMode}`);

    // Execute parallel fan-out to OpenRouter
    const results = await callOfficersParallel(officersWithHistory, message);

    // Format responses
    const responses: OfficerResponse[] = results.map((result) => {
      const officer = getOfficerById(result.officerId);
      return {
        officerId: result.officerId,
        officerTitle: officer?.title || "Unknown Officer",
        officerModel: officer?.model || "Unknown Model",
        content: result.content,
        error: result.error,
      };
    });

    // Log any errors
    const errors = responses.filter(r => r.error);
    if (errors.length > 0) {
      console.error(`[War Room] ${errors.length} officer(s) failed:`, errors);
    }

    const response: ChatResponse = {
      responses,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("[War Room] API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "War Room Command Interface",
    version: "2.0",
  });
}
