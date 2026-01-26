"use client";

import { useState, useEffect } from "react";
import MissionModeSelector from "./MissionModeSelector";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import Sidebar, { Chat } from "./Sidebar";

export type CapabilityClass = "Strategic" | "Operational" | "Tactical" | "Support" | "All";

export interface Message {
  id: string;
  type: "user" | "officer";
  content: string;
  officerId?: string;
  officerTitle?: string;
  officerModel?: string;
  capabilityClass?: CapabilityClass;
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

export default function ChatInterface() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load sessions from database on mount
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await fetch("/api/sessions");
        if (!response.ok) throw new Error("Failed to load sessions");

        const sessions = await response.json();
        const formattedSessions = sessions.map((session: any) => ({
          ...session,
          createdAt: new Date(session.createdAt),
          lastMessageAt: new Date(session.lastMessageAt),
          messages: [], // Messages loaded separately when needed
        }));

        setChatSessions(formattedSessions);

        // Auto-select first session if exists
        if (formattedSessions.length > 0 && !currentChatId) {
          setCurrentChatId(formattedSessions[0].id);
          loadSessionMessages(formattedSessions[0].id);
        }
      } catch (error) {
        console.error("Failed to load sessions:", error);
      }
    };

    loadSessions();
  }, []);

  // Load messages for a specific session
  const loadSessionMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`);
      if (!response.ok) throw new Error("Failed to load session");

      const session = await response.json();
      const messages = session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      }));

      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === sessionId ? { ...chat, messages } : chat
        )
      );
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  const currentChat = chatSessions.find((chat) => chat.id === currentChatId);

  const generateChatTitle = (firstMessage: string): string => {
    // Generate a title from the first message (max 50 chars)
    return firstMessage.length > 50
      ? firstMessage.substring(0, 50) + "..."
      : firstMessage;
  };

  const handleNewChat = async () => {
    try {
      const response = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Mission",
          capabilityClass: "All",
        }),
      });

      if (!response.ok) throw new Error("Failed to create session");

      const newSession = await response.json();
      const newChat: ChatSession = {
        ...newSession,
        createdAt: new Date(newSession.createdAt),
        lastMessageAt: new Date(newSession.lastMessageAt),
        messages: [],
      };

      setChatSessions((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    // Load messages for this chat if not already loaded
    const chat = chatSessions.find((c) => c.id === chatId);
    if (chat && chat.messages.length === 0) {
      loadSessionMessages(chatId);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    try {
      const response = await fetch(`/api/sessions/${chatId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete session");

      setChatSessions((prev) => prev.filter((chat) => chat.id !== chatId));
      if (currentChatId === chatId) {
        const remaining = chatSessions.filter((chat) => chat.id !== chatId);
        setCurrentChatId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    try {
      const response = await fetch(`/api/sessions/${chatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) throw new Error("Failed to rename session");

      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, title: newTitle } : chat
        )
      );
    } catch (error) {
      console.error("Failed to rename chat:", error);
    }
  };

  const handleCapabilityClassChange = async (capabilityClass: CapabilityClass) => {
    if (!currentChatId) return;

    try {
      const response = await fetch(`/api/sessions/${currentChatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ capabilityClass }),
      });

      if (!response.ok) throw new Error("Failed to update capability class");

      setChatSessions((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId ? { ...chat, capabilityClass } : chat
        )
      );
    } catch (error) {
      console.error("Failed to update capability class:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!currentChatId) return;

    const currentChat = chatSessions.find((c) => c.id === currentChatId);
    if (!currentChat) return;

    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    // Optimistically update UI
    setChatSessions((prev) =>
      prev.map((chat) => {
        if (chat.id === currentChatId) {
          return {
            ...chat,
            messages: [...chat.messages, userMessage],
            lastMessageAt: new Date(),
          };
        }
        return chat;
      })
    );

    setIsLoading(true);

    try {
      // Auto-generate title from first message
      if (currentChat.messages.length === 0) {
        const newTitle = generateChatTitle(content);
        await fetch(`/api/sessions/${currentChatId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle }),
        });

        setChatSessions((prev) =>
          prev.map((chat) =>
            chat.id === currentChatId ? { ...chat, title: newTitle } : chat
          )
        );
      }

      // Call the War Room API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          capabilityClass: currentChat.capabilityClass,
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
        content: resp.error ? `[Error] ${resp.error}` : resp.content,
        officerId: resp.officerId,
        officerTitle: resp.officerTitle,
        officerModel: resp.officerModel,
        capabilityClass: currentChat.capabilityClass,
        timestamp: new Date(),
      }));

      // Save all messages to database
      const allMessages = [userMessage, ...officerMessages];
      await fetch(`/api/sessions/${currentChatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: allMessages }),
      });

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

  // Create first chat if none exist
  useEffect(() => {
    if (chatSessions.length === 0 && currentChatId === null) {
      handleNewChat();
    }
  }, []);

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

        {/* Capability Class Selector */}
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
