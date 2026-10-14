import apiClient from "@/lib/api/client";
import { HousingSociety, CreateSocietyRequest } from "@/types/api";
import { MOCK_SOCIETIES } from "@/lib/mockData";

export const societiesApi = {
  /**
   * GET /api/societies — Fetch all housing societies
   */
  async getAll(): Promise<HousingSociety[]> {
    try {
      return await apiClient.get<HousingSociety[]>("/api/societies");
    } catch (err) {
      console.warn("[societiesApi.getAll] Falling back to mock societies:", err);
      return MOCK_SOCIETIES;
    }
  },

  /**
   * GET /api/societies/{id} — Fetch a specific society by ID
   */
  async getById(id: number): Promise<HousingSociety> {
    try {
      return await apiClient.get<HousingSociety>(`/api/societies/${id}`);
    } catch (err) {
      const match = MOCK_SOCIETIES.find((s) => s.societyId === id);
      if (match) return match;
      throw err;
    }
  },

  /**
   * GET /api/societies/city/{city} — Fetch all societies in a specific city
   */
  async getByCity(city: string): Promise<HousingSociety[]> {
    try {
      return await apiClient.get<HousingSociety[]>(`/api/societies/city/${encodeURIComponent(city)}`);
    } catch (err) {
      return MOCK_SOCIETIES.filter(
        (s) => s.city?.toLowerCase() === city.toLowerCase()
      );
    }
  },

  /**
   * POST /api/societies — Create a new housing society
   */
  async create(society: CreateSocietyRequest): Promise<HousingSociety> {
    return apiClient.post<HousingSociety>("/api/societies", society);
  },
};
