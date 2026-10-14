/**
 * EcoSocietyAI API Client
 * Built on native fetch with automatic URL resolution, auth headers, typed returns, and error handling.
 */

import { API_BASE_URL, CONFIG } from "@/lib/config";
import { ApiError } from "@/types/api";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(CONFIG.storageKeys.token);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${cleanEndpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    };

    const token = this.getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      // Parse response body
      let data: unknown;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }
      }

      if (!response.ok) {
        const error: ApiError = {
          message:
            (data as { message?: string })?.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          details: data,
        };
        throw error;
      }

      return data as T;
    } catch (err: unknown) {
      if ((err as ApiError).status) {
        throw err;
      }

      // Network error or backend offline
      const networkError: ApiError = {
        message: `Failed to connect to backend at ${this.baseUrl}. Please check if the server is running.`,
        status: 0,
        details: err,
      };
      throw networkError;
    }
  }

  public async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    let url = endpoint;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query.append(key, String(value));
        }
      });
      const queryString = query.toString();
      if (queryString) {
        url += (url.includes("?") ? "&" : "?") + queryString;
      }
    }
    return this.request<T>(url, { method: "GET" });
  }

  public async post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  /**
   * Health check to test backend connectivity
   */
  public async checkHealth(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${this.baseUrl}/api/roles`, {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return res.ok || res.status === 401 || res.status === 403;
    } catch {
      return false;
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
