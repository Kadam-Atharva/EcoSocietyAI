import apiClient from "@/lib/api/client";
import { VendorService, CreateVendorServiceRequest } from "@/types/api";
import { MOCK_VENDOR_SERVICES } from "@/lib/mockData";

export const vendorServicesApi = {
  /**
   * GET /api/vendor-services — Fetch all services
   */
  async getAll(): Promise<VendorService[]> {
    try {
      return await apiClient.get<VendorService[]>("/api/vendor-services");
    } catch (err) {
      console.warn("[vendorServicesApi.getAll] Falling back to mock data:", err);
      return MOCK_VENDOR_SERVICES;
    }
  },

  /**
   * GET /api/vendor-services/{id} — Fetch a specific service by ID
   */
  async getById(id: number): Promise<VendorService> {
    try {
      return await apiClient.get<VendorService>(`/api/vendor-services/${id}`);
    } catch (err) {
      const match = MOCK_VENDOR_SERVICES.find((s) => s.serviceId === id);
      if (match) return match;
      throw err;
    }
  },

  /**
   * GET /api/vendor-services/vendor/{vendorId} — Fetch all services offered by a specific vendor
   */
  async getByVendorId(vendorId: number): Promise<VendorService[]> {
    try {
      return await apiClient.get<VendorService[]>(`/api/vendor-services/vendor/${vendorId}`);
    } catch (err) {
      return MOCK_VENDOR_SERVICES.filter((s) => s.vendor.vendorId === vendorId);
    }
  },

  /**
   * POST /api/vendor-services — Create a new service
   */
  async create(service: CreateVendorServiceRequest | Partial<VendorService>): Promise<VendorService> {
    return apiClient.post<VendorService>("/api/vendor-services", service);
  },

  /**
   * DELETE /api/vendor-services/{id} — Delete a service by ID
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete<void>(`/api/vendor-services/${id}`);
  },
};
