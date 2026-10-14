/**
 * EcoSocietyAI Application Configuration
 * Centralizes environment variables, API endpoints, and global constants.
 */

// Remove trailing slash if present
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export const API_BASE_URL = rawApiUrl.replace(/\/+$/, "");

export const CONFIG = {
  apiBaseUrl: API_BASE_URL,
  appName: "EcoSocietyAI",
  version: "1.0.0",
  storageKeys: {
    token: "ecosociety_auth_token",
    user: "ecosociety_auth_user",
    theme: "theme",
    activeSociety: "ecosociety_active_society",
  },
  defaultSocietyId: 1,
} as const;
