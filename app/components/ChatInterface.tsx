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

export default function ChatInterface() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userApiKey, setUserApiKey] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("warroom-chats");
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
