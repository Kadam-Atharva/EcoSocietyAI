import apiClient from "@/lib/api/client";
import { VendorCategory, CreateVendorCategoryRequest } from "@/types/api";
import { MOCK_VENDOR_CATEGORIES } from "@/lib/mockData";

export const vendorCategoriesApi = {
  /**
   * GET /api/vendor-categories — Fetch all categories
   */
  async getAll(): Promise<VendorCategory[]> {
    try {
      return await apiClient.get<VendorCategory[]>("/api/vendor-categories");
    } catch (err) {
      console.warn("[vendorCategoriesApi.getAll] Falling back to mock data:", err);
      return MOCK_VENDOR_CATEGORIES;
    }
  },

  /**
   * GET /api/vendor-categories/{id} — Fetch a specific category by ID
   */
  async getById(id: number): Promise<VendorCategory> {
    try {
      return await apiClient.get<VendorCategory>(`/api/vendor-categories/${id}`);
    } catch (err) {
      const match = MOCK_VENDOR_CATEGORIES.find((c) => c.categoryId === id);
      if (match) return match;
      throw err;
    }
  },

  /**
   * POST /api/vendor-categories — Create a new category
   */
  async create(category: CreateVendorCategoryRequest): Promise<VendorCategory> {
    return apiClient.post<VendorCategory>("/api/vendor-categories", category);
  },
};
