export interface SocietyAIContext {
  societyName: string;
  city?: string;
  address?: string;
  totalFlats?: number;
  totalResidents?: number;
  availableRoofAreaSqft?: number;
  availableGroundAreaSqft?: number;
  monthlySustainabilityBudget?: number;
  recentEnergy?: { consumption: number; cost: number; unit: string };
  recentWater?: { consumption: number; cost: number; unit: string };
  recentWaste?: { consumption: number; cost: number; unit: string };
  solarArea?: number;
  solarCapacityKWp?: number;
  rainwaterArea?: number;
  compostArea?: number;
  pendingRfpsCount?: number;
  memberCount?: number;
}

export interface AIAdvisorResponse {
  success: boolean;
  source: string;
  analysis: string;
  isLiveGemini: boolean;
  metrics?: {
    solar?: any;
    rainwater?: any;
    carbon?: any;
  };
  error?: string;
}

export const aiAdvisorApi = {
  /**
   * Generate complete society sustainability audit & executive roadmap via Gemini
   */
  async generateAudit(
    societyContext: SocietyAIContext,
    customApiKey?: string
  ): Promise<AIAdvisorResponse> {
    const res = await fetch("/api/ai/advisor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "audit",
        societyContext,
        customApiKey,
      }),
    });

    if (!res.ok) {
      throw new Error(`AI Advisor request failed with HTTP status ${res.status}`);
    }

    return res.json();
  },

  /**
   * Ask interactive AI questions or query custom recommendations for the society
   */
  async askQuestion(
    userQuery: string,
    societyContext: SocietyAIContext,
    customApiKey?: string
  ): Promise<AIAdvisorResponse> {
    const res = await fetch("/api/ai/advisor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "chat",
        userQuery,
        societyContext,
        customApiKey,
      }),
    });

    if (!res.ok) {
      throw new Error(`AI Advisor request failed with HTTP status ${res.status}`);
    }

    return res.json();
  },
};
