"use client";

import { CapabilityClass } from "./ChatInterface";

interface MissionModeSelectorProps {
  currentMode: CapabilityClass;
  onModeChange: (mode: CapabilityClass) => void;
}

const modes: { id: CapabilityClass; label: string; description: string; icon: string }[] = [
  {
    id: "Strategic",
    label: "Strategic",
    description: "Top-tier models for critical decisions",
    icon: "⭐",
  },
  {
    id: "Operational",
    label: "Operational",
    description: "Production-grade balanced response",
    icon: "⚡",
  },
  {
    id: "Tactical",
    label: "Tactical",
    description: "Fast specialist models",
    icon: "🎯",
  },
  {
    id: "Support",
    label: "Support",
    description: "Efficient cost-effective models",
    icon: "🛠️",
  },
  {
    id: "All",
    label: "All",
    description: "Full council deployment",
    icon: "🌐",
  },
];

export default function MissionModeSelector({
  currentMode,
  onModeChange,
}: MissionModeSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mr-2">
        Capability Class:
      </span>
      <div className="flex gap-2 flex-wrap">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`
              group relative px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                currentMode === mode.id
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </span>

            {/* Tooltip */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-slate-900 text-slate-200 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 border border-slate-700">
              {mode.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
