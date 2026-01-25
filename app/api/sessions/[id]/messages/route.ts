import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/sessions/[id]/messages - Add messages to a session
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { messages } = body;

    if (!Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages must be an array" },
        { status: 400 }
      );
    }

    // Create all messages in a transaction
    const createdMessages = await prisma.$transaction(
      messages.map((msg: any) =>
        prisma.message.create({
          data: {
            chatId: id,
            type: msg.type,
            content: msg.content,
            officerId: msg.officerId,
            officerTitle: msg.officerTitle,
            officerModel: msg.officerModel,
          },
        })
      )
    );

    // Update session's lastMessageAt
    await prisma.chatSession.update({
      where: { id },
      data: {
        lastMessageAt: new Date(),
      },
    });

    return NextResponse.json(createdMessages);
  } catch (error) {
    console.error("[API] Error adding messages:", error);
    return NextResponse.json(
      { error: "Failed to add messages" },
      { status: 500 }
    );
  }
}
