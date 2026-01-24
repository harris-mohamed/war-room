import rosterConfig from "@/config/roster.json";

export interface Officer {
  id: string;
  title: string;
  model: string;
  specialty: string;
  system_prompt: string;
}

export type MissionMode = "general" | "research" | "audit" | "problem-solving";

export interface RosterConfig {
  version: string;
  active_roster: string[];
  officers: Record<string, Omit<Officer, "id">>;
}

/**
 * Get all active officers from the roster
 */
export function getActiveOfficers(): Officer[] {
  const config = rosterConfig as RosterConfig;

  return config.active_roster.map((officerId) => {
    const officer = config.officers[officerId];
    if (!officer) {
      throw new Error(`Officer ${officerId} not found in roster`);
    }
    return {
      id: officerId,
      ...officer,
    };
  });
}

/**
 * Filter officers based on mission mode
 */
export function getOfficersForMission(mode: MissionMode): Officer[] {
  const allOfficers = getActiveOfficers();

  switch (mode) {
    case "research":
      // O-2 leads research mode
      return allOfficers.filter((o) => o.id === "O2" || o.specialty === "Research");

    case "audit":
      // O-3 takes point for security audits
      return allOfficers.filter((o) => o.id === "O3" || o.specialty === "Adversarial Review");

    case "problem-solving":
      // O-1 and O-4 collaborate on technical solutions
      return allOfficers.filter((o) => o.id === "O1" || o.id === "O4");

    case "general":
    default:
      // Full council for balanced perspective
      return allOfficers;
  }
}

/**
 * Get a specific officer by ID
 */
export function getOfficerById(officerId: string): Officer | null {
  const config = rosterConfig as RosterConfig;
  const officer = config.officers[officerId];

  if (!officer) {
    return null;
  }

  return {
    id: officerId,
    ...officer,
  };
}

/**
 * Validate that all active officers exist in the configuration
 */
export function validateRoster(): { valid: boolean; errors: string[] } {
  const config = rosterConfig as RosterConfig;
  const errors: string[] = [];

  // Check that all active roster officers exist
  for (const officerId of config.active_roster) {
    if (!config.officers[officerId]) {
      errors.push(`Officer ${officerId} in active_roster does not exist in officers config`);
    }
  }

  // Check that all officers have valid OpenRouter model slugs
  for (const [officerId, officer] of Object.entries(config.officers)) {
    if (!officer.model || !officer.model.includes("/")) {
      errors.push(`Officer ${officerId} has invalid OpenRouter model format: ${officer.model}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
