/**
 * TypeScript Data Models & DTOs for EcoSocietyAI
 * Exactly maps to the Spring Boot backend entities and controllers.
 */

// ==========================================
// 1. Roles (/api/roles)
// ==========================================
export interface Role {
  roleId: number;
  roleName: string; // e.g. "ROLE_ADMIN", "ROLE_RESIDENT", "ROLE_VENDOR", "ROLE_AUDITOR"
}

export type CreateRoleRequest = Omit<Role, "roleId">;

// ==========================================
// 2. Users (/api/users)
// ==========================================
export interface User {
  userId: number;
  fullName: string;
  email: string;
  passwordHash?: string;
  phoneNumber?: string;
  role?: Role | null;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  passwordHash?: string;
  phoneNumber?: string;
  role?: Role | { roleId: number; roleName?: string };
}

// ==========================================
// 3. Housing Societies (/api/societies)
// ==========================================
export interface HousingSociety {
  societyId: number;
  societyName: string;
  registrationNumber?: string;
  address?: string;
  city?: string;
  pincode?: string;
  totalFlats?: number;
  totalResidents?: number;
  availableRoofAreaSqft?: number;
  availableGroundAreaSqft?: number;
  monthlySustainabilityBudget?: number;
  adminUser?: User | null;
}

export type CreateSocietyRequest = Partial<HousingSociety>;

// ==========================================
// 4. Society Members (/api/society-members)
// ==========================================
export interface SocietyMember {
  memberId: number;
  society: HousingSociety;
  user: User;
  flatNumber?: string;
}

export interface CreateSocietyMemberRequest {
  society: { societyId: number };
  user: { userId: number };
  flatNumber?: string;
}

// ==========================================
// 5. Utility Types (/api/utility-types)
// ==========================================
export interface UtilityType {
  utilityTypeId: number;
  typeName: string; // e.g. "Electricity", "Water", "Waste", "Solar Generation"
}

export type CreateUtilityTypeRequest = Omit<UtilityType, "utilityTypeId">;

// ==========================================
// 6. Utility Logs (/api/utility-logs)
// ==========================================
export interface UtilityLog {
  logId: number;
  society: HousingSociety;
  utilityType: UtilityType;
  billingPeriodStart: string; // "YYYY-MM-DD"
  billingPeriodEnd: string;   // "YYYY-MM-DD"
  consumptionUnit: string;    // "kWh", "Litres", "kg"
  consumptionValue: number;
  totalCost: number;
  loggedByUser: User;
}

export interface CreateUtilityLogRequest {
  society: { societyId: number };
  utilityType: { utilityTypeId: number };
  billingPeriodStart: string;
  billingPeriodEnd: string;
  consumptionUnit: string;
  consumptionValue: number;
  totalCost: number;
  loggedByUser: { userId: number };
}

// ==========================================
// 7. Vendor Categories (/api/vendor-categories)
// ==========================================
export interface VendorCategory {
  categoryId: number;
  categoryName: string; // e.g. "Solar", "Water Harvesting", "Composting", "EV Charging"
}

export type CreateVendorCategoryRequest = Omit<VendorCategory, "categoryId">;

// ==========================================
// 8. Vendor Profiles (/api/vendor-profiles)
// ==========================================
export interface VendorProfile {
  vendorId: number;
  user: User;
  companyName: string;
  gstNumber?: string;
  isVerified: boolean;
}

export interface CreateVendorProfileRequest {
  user: { userId: number };
  companyName: string;
  gstNumber?: string;
  isVerified?: boolean;
}

// ==========================================
// 9. Vendor Services (/api/vendor-services)
// ==========================================
export interface VendorService {
  serviceId: number;
  vendor: VendorProfile;
  category: VendorCategory;
  serviceTitle: string;
  basePrice?: number;
}

export interface CreateVendorServiceRequest {
  vendor: { vendorId: number };
  category: { categoryId: number };
  serviceTitle: string;
  basePrice?: number;
}

// ==========================================
// Authentication & Session Types
// ==========================================
export interface AuthUser {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber?: string;
  roleName: "ROLE_ADMIN" | "ROLE_RESIDENT" | "ROLE_VENDOR" | "ROLE_AUDITOR" | string;
  roleId?: number;
  societyId?: number;
  societyName?: string;
  flatNumber?: string;
  vendorProfileId?: number;
  companyName?: string;
  businessIdentifier?: string;
  partnerVertical?: string;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  roleName: "ROLE_ADMIN" | "ROLE_RESIDENT" | "ROLE_VENDOR" | "ROLE_AUDITOR";
  societyName?: string;
  societyId?: number;
  flatNumber?: string;
  companyName?: string;
  gstNumber?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  details?: unknown;
}
