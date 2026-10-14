import apiClient from "@/lib/api/client";
import { UtilityType, CreateUtilityTypeRequest } from "@/types/api";
import { MOCK_UTILITY_TYPES } from "@/lib/mockData";

export const utilityTypesApi = {
  /**
   * GET /api/utility-types — Fetch all utility types (e.g., Water, Electricity)
   */
  async getAll(): Promise<UtilityType[]> {
    try {
      return await apiClient.get<UtilityType[]>("/api/utility-types");
    } catch (err) {
      console.warn("[utilityTypesApi.getAll] Falling back to mock data:", err);
      return MOCK_UTILITY_TYPES;
    }
  },

  /**
   * GET /api/utility-types/{id} — Fetch a specific utility type by ID
   */
  async getById(id: number): Promise<UtilityType> {
    try {
      return await apiClient.get<UtilityType>(`/api/utility-types/${id}`);
    } catch (err) {
      const match = MOCK_UTILITY_TYPES.find((t) => t.utilityTypeId === id);
      if (match) return match;
      throw err;
    }
  },

  /**
   * POST /api/utility-types — Create a new utility type
   */
  async create(type: CreateUtilityTypeRequest): Promise<UtilityType> {
    return apiClient.post<UtilityType>("/api/utility-types", type);
  },
};
