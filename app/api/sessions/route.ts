import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/sessions - List all chat sessions
export async function GET() {
  try {
    const sessions = await prisma.chatSession.findMany({
      orderBy: {
        lastMessageAt: "desc",
      },
      include: {
        _count: {
          select: { messages: true },
        },
      },
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("[API] Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

// POST /api/sessions - Create a new chat session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, capabilityClass } = body;

    const session = await prisma.chatSession.create({
      data: {
        title: title || "New Mission",
        capabilityClass: capabilityClass || "All",
      },
    });

    return NextResponse.json(session);
  } catch (error) {
    console.error("[API] Error creating session:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 }
    );
  }
}
