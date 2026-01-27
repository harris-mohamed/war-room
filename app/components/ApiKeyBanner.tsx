"use client";

import { useState, useEffect } from "react";
import { X, Key, Check } from "lucide-react";

interface ApiKeyBannerProps {
  onApiKeyChange: (apiKey: string | null) => void;
}

export default function ApiKeyBanner({ onApiKeyChange }: ApiKeyBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [hasApiKey, setHasApiKey] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check if API key exists in sessionStorage
    const storedKey = sessionStorage.getItem("warroom-api-key");
    if (storedKey) {
      setHasApiKey(true);
      onApiKeyChange(storedKey);
    }
  }, [onApiKeyChange]);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      sessionStorage.setItem("warroom-api-key", apiKeyInput.trim());
      setHasApiKey(true);
      onApiKeyChange(apiKeyInput.trim());
      setApiKeyInput("");
      setIsExpanded(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleRemoveApiKey = () => {
    sessionStorage.removeItem("warroom-api-key");
    setHasApiKey(false);
    onApiKeyChange(null);
    setApiKeyInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveApiKey();
    }
  };

  return (
    <>
      {/* Main Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white px-4 py-3 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">
                {hasApiKey ? (
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Live Mode Active
                  </span>
                ) : (
                  "Demo Mode"
                )}
              </p>
              <p className="text-xs text-white/80">
                {hasApiKey
                  ? "Using your OpenRouter API key • Responses from real AI models"
                  : "Showing sample responses • Add your OpenRouter API key to use real AI models"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasApiKey ? (
              <button
                onClick={handleRemoveApiKey}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
              >
                Remove Key
              </button>
            ) : (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="px-4 py-2 bg-white text-blue-600 hover:bg-white/90 rounded-lg text-sm font-medium transition-colors"
              >
                {isExpanded ? "Cancel" : "Add API Key"}
              </button>
            )}
          </div>
        </div>

        {/* Expanded Input Section */}
        {isExpanded && (
          <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-white/20">
            <div className="flex gap-3">
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your OpenRouter API key (sk-or-v1-...)"
                className="flex-1 px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                onClick={handleSaveApiKey}
                disabled={!apiKeyInput.trim()}
                className="px-6 py-2 bg-white text-blue-600 hover:bg-white/90 disabled:bg-white/40 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-white/70 mt-2">
              Your API key is stored in your browser session only and never sent to our servers. It will be cleared when you close this tab.{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white"
              >
                Get an API key from OpenRouter
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-20 right-4 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-top z-50">
          <Check className="w-5 h-5" />
          <p className="font-medium">API key saved! Now using live mode.</p>
        </div>
      )}
    </>
  );
}
