import apiClient from "@/lib/api/client";
import { VendorProfile, CreateVendorProfileRequest } from "@/types/api";
import { MOCK_VENDOR_PROFILES } from "@/lib/mockData";

export const vendorProfilesApi = {
  /**
   * GET /api/vendor-profiles — Fetch all vendor profiles
   */
  async getAll(): Promise<VendorProfile[]> {
    try {
      return await apiClient.get<VendorProfile[]>("/api/vendor-profiles");
    } catch (err) {
      console.warn("[vendorProfilesApi.getAll] Falling back to mock data:", err);
      return MOCK_VENDOR_PROFILES;
    }
  },

  /**
   * GET /api/vendor-profiles/{id} — Fetch a specific vendor profile by ID
   */
  async getById(id: number): Promise<VendorProfile> {
    try {
      return await apiClient.get<VendorProfile>(`/api/vendor-profiles/${id}`);
    } catch (err) {
      const match = MOCK_VENDOR_PROFILES.find((v) => v.vendorId === id);
      if (match) return match;
      throw err;
    }
  },

  /**
   * GET /api/vendor-profiles/verified — Fetch only verified vendor profiles
   */
  async getVerified(): Promise<VendorProfile[]> {
    try {
      return await apiClient.get<VendorProfile[]>("/api/vendor-profiles/verified");
    } catch (err) {
      return MOCK_VENDOR_PROFILES.filter((v) => v.isVerified);
    }
  },

  /**
   * POST /api/vendor-profiles — Create a new vendor profile
   */
  async create(profile: CreateVendorProfileRequest | Partial<VendorProfile>): Promise<VendorProfile> {
    return apiClient.post<VendorProfile>("/api/vendor-profiles", profile);
  },
};
