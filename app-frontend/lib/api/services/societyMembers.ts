import apiClient from "@/lib/api/client";
import { SocietyMember, CreateSocietyMemberRequest } from "@/types/api";
import { MOCK_MEMBERS } from "@/lib/mockData";

export const societyMembersApi = {
  /**
   * GET /api/society-members/society/{societyId} — Fetch all members of a specific society
   */
  async getBySocietyId(societyId: number): Promise<SocietyMember[]> {
    try {
      return await apiClient.get<SocietyMember[]>(`/api/society-members/society/${societyId}`);
    } catch (err) {
      console.warn("[societyMembersApi.getBySocietyId] Falling back to mock members:", err);
      return MOCK_MEMBERS.filter((m) => m.society.societyId === societyId);
    }
  },

  /**
   * GET /api/society-members/user/{userId} — Fetch all society memberships for a specific user
   */
  async getByUserId(userId: number): Promise<SocietyMember[]> {
    try {
      return await apiClient.get<SocietyMember[]>(`/api/society-members/user/${userId}`);
    } catch (err) {
      return MOCK_MEMBERS.filter((m) => m.user.userId === userId);
    }
  },

  /**
   * POST /api/society-members — Add a new member to a society
   */
  async addMember(member: CreateSocietyMemberRequest | Partial<SocietyMember>): Promise<SocietyMember> {
    return apiClient.post<SocietyMember>("/api/society-members", member);
  },

  /**
   * DELETE /api/society-members/{id} — Remove a member by ID
   */
  async removeMember(id: number): Promise<void> {
    await apiClient.delete<void>(`/api/society-members/${id}`);
  },
};
