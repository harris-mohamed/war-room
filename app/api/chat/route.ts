import { NextRequest, NextResponse } from "next/server";
import { getOfficersForMission, getOfficerById, type CapabilityClass } from "@/lib/roster-manager";
import { callOfficersParallel, type Message } from "@/lib/openrouter";

export interface ChatRequest {
  message: string;
  capabilityClass: CapabilityClass;
  conversationHistory?: Message[];
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

    // Execute parallel fan-out to OpenRouter
    const results = await callOfficersParallel(officers, message, conversationHistory);

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
