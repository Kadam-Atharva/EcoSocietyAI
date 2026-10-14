import apiClient from "@/lib/api/client";
import { UtilityLog, CreateUtilityLogRequest } from "@/types/api";
import { MOCK_UTILITY_LOGS } from "@/lib/mockData";

export const utilityLogsApi = {
  /**
   * GET /api/utility-logs/society/{societyId} — Fetch all utility logs for a specific society
   */
  async getBySocietyId(societyId: number): Promise<UtilityLog[]> {
    try {
      return await apiClient.get<UtilityLog[]>(`/api/utility-logs/society/${societyId}`);
    } catch (err) {
      console.warn("[utilityLogsApi.getBySocietyId] Falling back to mock logs:", err);
      return MOCK_UTILITY_LOGS.filter((l) => l.society.societyId === societyId);
    }
  },

  /**
   * GET /api/utility-logs/society/{societyId}/type/{typeId} — Fetch logs filtered by both society and utility type
   */
  async getBySocietyAndType(societyId: number, typeId: number): Promise<UtilityLog[]> {
    try {
      return await apiClient.get<UtilityLog[]>(`/api/utility-logs/society/${societyId}/type/${typeId}`);
    } catch (err) {
      return MOCK_UTILITY_LOGS.filter(
        (l) => l.society.societyId === societyId && l.utilityType.utilityTypeId === typeId
      );
    }
  },

  /**
   * GET /api/utility-logs/society/{societyId}/range?startDate={date}&endDate={date}
   * Fetch logs for a society within a specific date range
   */
  async getByDateRange(
    societyId: number,
    startDate: string,
    endDate: string
  ): Promise<UtilityLog[]> {
    try {
      return await apiClient.get<UtilityLog[]>(`/api/utility-logs/society/${societyId}/range`, {
        startDate,
        endDate,
      });
    } catch (err) {
      return MOCK_UTILITY_LOGS.filter((l) => {
        if (l.society.societyId !== societyId) return false;
        return (
          l.billingPeriodStart >= startDate && l.billingPeriodEnd <= endDate
        );
      });
    }
  },

  /**
   * POST /api/utility-logs — Create a new utility log
   */
  async create(log: CreateUtilityLogRequest | Partial<UtilityLog>): Promise<UtilityLog> {
    return apiClient.post<UtilityLog>("/api/utility-logs", log);
  },

  /**
   * DELETE /api/utility-logs/{id} — Delete a utility log by ID
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete<void>(`/api/utility-logs/${id}`);
  },
};
