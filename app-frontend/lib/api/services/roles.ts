import apiClient from "@/lib/api/client";
import { Role, CreateRoleRequest } from "@/types/api";
import { MOCK_ROLES } from "@/lib/mockData";

export const rolesApi = {
  /**
   * GET /api/roles — Fetch all roles
   */
  async getAll(): Promise<Role[]> {
    try {
      return await apiClient.get<Role[]>("/api/roles");
    } catch (err) {
      console.warn("[rolesApi.getAll] Falling back to mock roles:", err);
      return MOCK_ROLES;
    }
  },

  /**
   * GET /api/roles/{id} — Fetch a specific role by ID
   */
  async getById(id: number): Promise<Role> {
    try {
      return await apiClient.get<Role>(`/api/roles/${id}`);
    } catch (err) {
      const match = MOCK_ROLES.find((r) => r.roleId === id);
      if (match) return match;
      throw err;
    }
  },

  /**
   * POST /api/roles — Create a new role
   */
  async create(role: CreateRoleRequest): Promise<Role> {
    return apiClient.post<Role>("/api/roles", role);
  },
};
