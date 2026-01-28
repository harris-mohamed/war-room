"use client";

import { useState, useEffect } from "react";
import MissionModeSelector from "./MissionModeSelector";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import Sidebar, { Chat } from "./Sidebar";
import ApiKeyBanner from "./ApiKeyBanner";

export type CapabilityClass = "Strategic" | "Operational" | "Tactical" | "Support" | "All";

export interface Message {
  id: string;
  type: "user" | "officer";
  content: string;
  officerId?: string;
  officerTitle?: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  capabilityClass: CapabilityClass;
  createdAt: Date;
  lastMessageAt: Date;
}

// Function to create demo session with pre-populated messages
const createDemoSession = (): ChatSession => {
  const now = new Date();
  const demoQuestion = "Analyze Evernote's downfall and what led to their decline";

  const demoMessages: Message[] = [
    {
      id: "demo-user-1",
      type: "user",
      content: demoQuestion,
      timestamp: now,
    },
    {
      id: "demo-o1",
      type: "officer",
      content: "*[Demo Response]*\n\n**Executive Analysis: Evernote's Strategic Missteps**\n\nThe collapse of Evernote represents a classic case of strategic drift and execution failure. Here are the critical factors:\n\n**1. Product Bloat & Loss of Focus**\n- Started as a simple note-taking app, became a cluttered everything-app\n- Added features (Work Chat, Context, Spaces) that users didn't request\n- Core note-taking experience degraded while complexity increased\n\n**2. Pricing & Monetization Failures**\n- Multiple pricing tier changes confused and alienated users\n- Free tier became increasingly restrictive (2-device limit in 2016)\n- Premium features weren't compelling enough to justify cost\n- Failed to find sustainable business model between freemium and enterprise\n\n**3. Leadership Instability**\n- 5 CEOs between 2015-2023 created strategic whiplash\n- Each leadership change brought new direction, fragmenting product vision\n\n**Recommendation:** Evernote's downfall is a cautionary tale about maintaining product discipline, sustainable pricing, and technical excellence.",
      officerId: "O1",
      officerTitle: "Chief of Operations",
      timestamp: now,
    },
    {
      id: "demo-o2",
      type: "officer",
      content: "*[Demo Response]*\n\n**Intelligence Report: Evernote Decline - Data Synthesis**\n\nAfter analyzing market data, user sentiment, and competitive dynamics:\n\n**Timeline of Decline:**\n- **2008-2012:** Golden era - product-market fit, rapid growth, reached 100M users by 2014\n- **2015-2016:** Peak valuation ($1B unicorn status), but cracks appearing\n- **2016-2018:** User exodus begins as pricing changes and product bloat intensify\n- **2020-2023:** Acquisition by Bending Spoons (2022), massive layoffs, damage control\n\n**Competitor Analysis:**\n| Competitor | Launch | Key Advantage |\n|------------|--------|---------------|\n| Notion | 2016 | Databases, collaboration, modern UX |\n| Roam Research | 2019 | Bi-directional linking |\n| Obsidian | 2020 | Local-first, markdown |\n| Apple Notes | Pre-existing | Free, native, \"good enough\" |\n\n**Critical Insight:** Evernote failed to recognize that note-taking is a deeply personal workflow. Users invested years building their system, but mounting frustrations eventually overcame switching costs.",
      officerId: "O2",
      officerTitle: "Intelligence Officer",
      timestamp: now,
    },
    {
      id: "demo-o3",
      type: "officer",
      content: "*[Demo Response]*\n\n**Red Team Assessment: What They Got Wrong**\n\nLet me tear apart the strategic failures and identify the vulnerabilities that weren't addressed:\n\n**CRITICAL FLAW #1: Ignored Network Effects Opportunity**\nEvernote positioned itself as a personal tool when collaboration was clearly the future. Notion understood this. Evernote didn't.\n\n**CRITICAL FLAW #2: Technical Architecture Rot**\nThe sync engine was fundamentally broken for YEARS. Users reported:\n- Lost notes (unacceptable for a note-taking app)\n- Conflict resolution disasters\n- Slow sync times (minutes vs. seconds for competitors)\n\nThey never rebuilt the foundation. They just painted over the cracks.\n\n**CRITICAL FLAW #3: Proprietary Format Lock-In Backfired**\nEvernote used a proprietary .enex format thinking it would create lock-in. Instead:\n- Users felt trapped and resentful\n- Competitors embraced Markdown and won goodwill\n\n**The Real Killer:** Evernote stopped being a product people loved and became a product people tolerated... until they didn't.",
      officerId: "O3",
      officerTitle: "Red Team Lead",
      timestamp: now,
    },
    {
      id: "demo-o4",
      type: "officer",
      content: "*[Demo Response]*\n\n**Logistics & Infrastructure Analysis: The Operational Breakdown**\n\nFrom an infrastructure and user experience perspective:\n\n**UI/UX Deterioration:**\n- Multiple redesigns (2013, 2015, 2019) that removed features users relied on\n- Desktop apps became bloated Electron wrappers (slower, higher memory usage)\n- Web clipper (a killer feature) became buggy and unreliable\n- Mobile apps fell behind iOS/Android design standards\n\n**Infrastructure Costs vs. Revenue:**\n- Hosting millions of free users with unlimited note storage was unsustainable\n- AWS bills grew while revenue per user stagnated\n- Had to impose device limits and upload caps to control costs\n- This created user hostility—felt like bait-and-switch\n\n**Modern SaaS Best Practices They Missed:**\n- No freemium-to-paid conversion funnel optimization\n- Weak onboarding (competitors had interactive tutorials)\n- No viral loops or referral programs\n- Poor customer success operations\n\n**Conclusion:** Operational excellence matters. Evernote lost because they couldn't ship fast enough, fix critical bugs quickly enough, or provide an experience that justified their premium pricing.",
      officerId: "O4",
      officerTitle: "Logistics Officer",
      timestamp: now,
    },
  ];

  return {
    id: "demo-session",
    title: "Demo: Evernote Analysis",
    messages: demoMessages,
    capabilityClass: "Operational",
    createdAt: now,
    lastMessageAt: now,
  };
};

export default function ChatInterface() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);

  // Load from localStorage on mount, or create demo session
  useEffect(() => {
    const saved = localStorage.getItem("warroom-chats");
    const hasApiKey = sessionStorage.getItem("warroom-api-key");
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const sessions = parsed.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          lastMessageAt: new Date(session.lastMessageAt),
          messages: session.messages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        }));
        setChatSessions(sessions);
        if (sessions.length > 0 && !currentChatId) {
          setCurrentChatId(sessions[0].id);
        }
      } catch (error) {
        console.error("Failed to load chats:", error);
      }
    } else if (!hasApiKey && isDemoMode) {
      // Create demo session on first load when in demo mode
      const demoSession = createDemoSession();
      setChatSessions([demoSession]);
      setCurrentChatId(demoSession.id);
    }
  }, []);

  // Save to localStorage whenever chatSessions change
  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem("warroom-chats", JSON.stringify(chatSessions));
    }
  }, [chatSessions]);

  const currentChat = chatSessions.find((chat) => chat.id === currentChatId);

  const generateChatTitle = (firstMessage: string): string => {
    // Generate a title from the first message (max 50 chars)
    return firstMessage.length > 50
      ? firstMessage.substring(0, 50) + "..."
      : firstMessage;
  };

  const handleNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Mission",
      messages: [],
      capabilityClass: "Operational",
      createdAt: new Date(),
      lastMessageAt: new Date(),
    };
    setChatSessions((prev) => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = (chatId: string) => {
    setChatSessions((prev) => prev.filter((chat) => chat.id !== chatId));
    if (currentChatId === chatId) {
      const remaining = chatSessions.filter((chat) => chat.id !== chatId);
      setCurrentChatId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const handleRenameChat = (chatId: string, newTitle: string) => {
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );
  };

  const handleCapabilityClassChange = (capClass: CapabilityClass) => {
    if (!currentChatId) return;
    setChatSessions((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId ? { ...chat, capabilityClass: capClass } : chat
      )
    );
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChatId || !currentChat) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setChatSessions((prev) =>
      prev.map((chat) => {
        if (chat.id === currentChatId) {
          const updatedMessages = [...chat.messages, userMessage];
          // Auto-generate title from first message
          const newTitle =
            chat.messages.length === 0 ? generateChatTitle(content) : chat.title;
          return {
            ...chat,
            messages: updatedMessages,
            title: newTitle,
            lastMessageAt: new Date(),
          };
        }
        return chat;
      })
    );

    setIsLoading(true);

    try {
      // Call the War Room API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          capabilityClass: currentChat.capabilityClass,
          apiKey: userApiKey || undefined, // Pass user API key if available
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get officer responses");
      }

      const data = await response.json();

      // Convert API responses to Message objects
      const officerMessages: Message[] = data.responses.map((resp: any) => ({
        id: `${Date.now()}-${resp.officerId}`,
        type: "officer" as const,
        content: resp.error
          ? `[Error] ${resp.error}`
          : resp.content,
        officerId: resp.officerId,
        officerTitle: resp.officerTitle,
        timestamp: new Date(),
      }));

      // Update chat with officer responses
      setChatSessions((prev) =>
        prev.map((chat) => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, ...officerMessages],
              lastMessageAt: new Date(),
            };
          }
          return chat;
        })
      );

      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message to chat
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        type: "officer",
        content: `Error: ${error instanceof Error ? error.message : "Failed to contact officers"}`,
        timestamp: new Date(),
      };

      setChatSessions((prev) =>
        prev.map((chat) => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage],
              lastMessageAt: new Date(),
            };
          }
          return chat;
        })
      );

      setIsLoading(false);
    }
  };

  // Create first chat if none exist (not in demo mode)
  useEffect(() => {
    const hasApiKey = sessionStorage.getItem("warroom-api-key");
    const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

    // Only auto-create if not in demo mode or user has added API key
    if (chatSessions.length === 0 && currentChatId === null && (!isDemoMode || hasApiKey)) {
      handleNewChat();
    }
  }, [chatSessions.length, currentChatId]);

  const chats: Chat[] = chatSessions.map((session) => ({
    id: session.id,
    title: session.title,
    createdAt: session.createdAt,
    lastMessageAt: session.lastMessageAt,
  }));

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
                  THE WAR ROOM
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Multi-LLM Strategic Command Interface
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  System Online
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* API Key Banner */}
        <ApiKeyBanner onApiKeyChange={setUserApiKey} />

        {/* Mission Mode Selector */}
        {currentChat && (
          <div className="border-b border-slate-800 bg-slate-900/30">
            <div className="px-6 py-3">
              <MissionModeSelector
                currentMode={currentChat.capabilityClass}
                onModeChange={handleCapabilityClassChange}
              />
            </div>
          </div>
        )}

        {/* Demo Banner */}
        {currentChat?.id === "demo-session" && (
          <div className="bg-blue-900/30 border-b border-blue-700/50 px-6 py-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <div>
                <p className="text-sm font-semibold text-blue-100">
                  Demo Session - Sample Responses
                </p>
                <p className="text-xs text-blue-200/80">
                  This shows example multi-LLM analysis. Add your OpenRouter API key above to query real AI models with your own questions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <MessageList
            messages={currentChat?.messages || []}
            isLoading={isLoading}
          />
        </div>

        {/* Input */}
        {currentChat && (
          <div className="border-t border-slate-800 bg-slate-900/50 backdrop-blur">
            <div className="px-6 py-4">
              <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
