import apiClient from "@/lib/api/client";
import { User, CreateUserRequest } from "@/types/api";
import { MOCK_USERS } from "@/lib/mockData";

export const usersApi = {
  /**
   * GET /api/users — Fetch all users
   */
  async getAll(): Promise<User[]> {
    try {
      return await apiClient.get<User[]>("/api/users");
    } catch (err) {
      console.warn("[usersApi.getAll] Falling back to mock users:", err);
      return MOCK_USERS;
    }
  },

  /**
   * GET /api/users/{id} — Fetch a specific user by ID
   */
  async getById(id: number): Promise<User> {
    try {
      return await apiClient.get<User>(`/api/users/${id}`);
    } catch (err) {
      const match = MOCK_USERS.find((u) => u.userId === id);
      if (match) return match;
      throw err;
    }
  },

  /**
   * GET /api/users/role/{roleId} — Fetch all users assigned to a specific role
   */
  async getByRoleId(roleId: number): Promise<User[]> {
    try {
      return await apiClient.get<User[]>(`/api/users/role/${roleId}`);
    } catch (err) {
      return MOCK_USERS.filter((u) => u.role?.roleId === roleId);
    }
  },

  /**
   * POST /api/users — Create a new user
   */
  async create(user: CreateUserRequest | Partial<User>): Promise<User> {
    return apiClient.post<User>("/api/users", user);
  },

  /**
   * DELETE /api/users/{id} — Delete a user by ID
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete<void>(`/api/users/${id}`);
  },
};
