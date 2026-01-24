"use client";

import { useEffect, useRef } from "react";
import { Message } from "./ChatInterface";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const officerColors: Record<string, { bg: string; border: string; text: string }> = {
  O1: { bg: "bg-blue-950/40", border: "border-blue-700/50", text: "text-blue-400" },
  O2: { bg: "bg-purple-950/40", border: "border-purple-700/50", text: "text-purple-400" },
  O3: { bg: "bg-red-950/40", border: "border-red-700/50", text: "text-red-400" },
  O4: { bg: "bg-amber-950/40", border: "border-amber-700/50", text: "text-amber-400" },
  O5: { bg: "bg-emerald-950/40", border: "border-emerald-700/50", text: "text-emerald-400" },
  O6: { bg: "bg-cyan-950/40", border: "border-cyan-700/50", text: "text-cyan-400" },
};

// Group consecutive officer messages together
function groupMessages(messages: Message[]): (Message | Message[])[] {
  const grouped: (Message | Message[])[] = [];
  let currentOfficerGroup: Message[] = [];

  for (const message of messages) {
    if (message.type === "officer") {
      currentOfficerGroup.push(message);
    } else {
      // User message - flush any pending officer group
      if (currentOfficerGroup.length > 0) {
        grouped.push(currentOfficerGroup);
        currentOfficerGroup = [];
      }
      grouped.push(message);
    }
  }

  // Don't forget the last group
  if (currentOfficerGroup.length > 0) {
    grouped.push(currentOfficerGroup);
  }

  return grouped;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const groupedMessages = groupMessages(messages);

  return (
    <div className="h-full overflow-y-auto">
      <div className="w-full px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-20">
            <div className="text-6xl mb-4">🎖️</div>
            <h2 className="text-2xl font-bold text-slate-300 mb-2">
              War Room Ready
            </h2>
            <p className="text-slate-500 max-w-md">
              Select a mission mode and brief your officers. They stand ready to
              provide strategic analysis from multiple perspectives.
            </p>
          </div>
        )}

        {groupedMessages.map((item, index) => {
          // Single user message
          if (!Array.isArray(item)) {
            const message = item;
            return (
              <div
                key={message.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-300"
              >
                <div className="flex justify-end">
                  <div className="max-w-3xl">
                    <div className="bg-slate-800 rounded-lg px-4 py-3 border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Commander
                        </span>
                        <span className="text-xs text-slate-500">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-slate-100 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Group of officer messages - display in columns
          const officerMessages = item;
          return (
            <div
              key={`group-${index}`}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {officerMessages.map((message) => (
                  <div key={message.id} className="flex flex-col h-full">
                    <div
                      className={`
                        flex-1 rounded-lg px-4 py-3 border flex flex-col
                        ${message.officerId ? officerColors[message.officerId]?.bg : "bg-slate-800/40"}
                        ${message.officerId ? officerColors[message.officerId]?.border : "border-slate-700"}
                      `}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={`
                            text-xs font-bold uppercase tracking-wider px-2 py-1 rounded
                            ${message.officerId ? officerColors[message.officerId]?.text : "text-slate-400"}
                            bg-slate-900/60
                          `}
                        >
                          {message.officerId || "System"}
                        </span>
                        <span className="text-xs text-slate-500 ml-auto">
                          {message.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-xs text-slate-400 font-medium">
                          {message.officerTitle}
                        </span>
                      </div>
                      <p className="text-slate-200 whitespace-pre-wrap leading-relaxed text-sm flex-1">
                        {message.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800/40 border border-slate-700 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></span>
                </div>
                <span className="text-sm text-slate-400">
                  Officers analyzing...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
