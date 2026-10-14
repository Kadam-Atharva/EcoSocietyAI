/**
 * EcoSocietyAI API Service Layer Index
 * Exports all endpoints and API client for clean imports across components.
 */

export { apiClient } from "./client";
export { rolesApi } from "./services/roles";
export { usersApi } from "./services/users";
export { vendorCategoriesApi } from "./services/vendorCategories";
export { vendorProfilesApi } from "./services/vendorProfiles";
export { vendorServicesApi } from "./services/vendorServices";
export { societiesApi } from "./services/societies";
export { societyMembersApi } from "./services/societyMembers";
export { utilityTypesApi } from "./services/utilityTypes";
export { utilityLogsApi } from "./services/utilityLogs";
export { aiAdvisorApi } from "./services/aiAdvisor";
export type { SocietyAIContext, AIAdvisorResponse } from "./services/aiAdvisor";

export * from "@/types/api";
export * from "../sustainabilityModels";
