import rosterConfig from "@/config/roster.json";

export interface Officer {
  id: string;
  title: string;
  model: string;
  capability_class: string;
  specialty: string;
  system_prompt: string;
}

export type CapabilityClass = "Strategic" | "Operational" | "Tactical" | "Support" | "All";

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
 * Filter officers based on capability class
 */
export function getOfficersForMission(capabilityClass: CapabilityClass): Officer[] {
  const allOfficers = getActiveOfficers();

  if (capabilityClass === "All") {
    // Full council response
    return allOfficers;
  }

  // Filter by capability class
  return allOfficers.filter((o) => o.capability_class === capabilityClass);
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
