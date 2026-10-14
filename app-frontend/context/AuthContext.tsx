"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  AuthUser,
  LoginCredentials,
  RegisterRequest,
  HousingSociety,
  User,
} from "@/types/api";
import { CONFIG, API_BASE_URL } from "@/lib/config";
import { apiClient } from "@/lib/api/client";
import { usersApi } from "@/lib/api/services/users";
import { societiesApi } from "@/lib/api/services/societies";
import { rolesApi } from "@/lib/api/services/roles";
import { vendorProfilesApi } from "@/lib/api/services/vendorProfiles";
import { societyMembersApi } from "@/lib/api/services/societyMembers";
import {
  MOCK_USERS,
  MOCK_SOCIETIES,
} from "@/lib/mockData";

export interface DemoProfile {
  id: "ADMIN" | "RESIDENT" | "VENDOR" | "AUDITOR" | "BUILDER";
  name: string;
  email: string;
  roleTitle: string;
  roleName: string;
  societyName: string;
  badgeColor: string;
  avatarText: string;
}

export const DEMO_PROFILES: DemoProfile[] = [
  {
    id: "ADMIN",
    name: "Atharva Kadam",
    email: "admin@ecosociety.ai",
    roleTitle: "Society Admin & Secretary",
    roleName: "ROLE_ADMIN",
    societyName: "GreenWood Heights Co-operative Society",
    badgeColor: "#10B981",
    avatarText: "AK",
  },
  {
    id: "RESIDENT",
    name: "Rohan Shah",
    email: "rohan@ecosociety.ai",
    roleTitle: "Apartment Resident (Flat B-404)",
    roleName: "ROLE_RESIDENT",
    societyName: "GreenWood Heights Co-operative Society",
    badgeColor: "#06B6D4",
    avatarText: "RS",
  },
  {
    id: "BUILDER",
    name: "Rajesh Singhania",
    email: "builder@apexrealty.in",
    roleTitle: "Real Estate Developer / Project Builder",
    roleName: "ROLE_BUILDER",
    societyName: "Apex SkyLine & Horizon Projects",
    badgeColor: "#EC4899",
    avatarText: "RS",
  },
  {
    id: "VENDOR",
    name: "SunPower CleanTech",
    email: "vendor@sunpower.com",
    roleTitle: "Verified Green Contractor",
    roleName: "ROLE_VENDOR",
    societyName: "National Clean Energy Vendor",
    badgeColor: "#F59E0B",
    avatarText: "SP",
  },
  {
    id: "AUDITOR",
    name: "Dr. Neha Sharma",
    email: "auditor@greenveritas.org",
    roleTitle: "Sustainability ESG Auditor",
    roleName: "ROLE_AUDITOR",
    societyName: "GreenVeritas Carbon Bureau",
    badgeColor: "#8B5CF6",
    avatarText: "NS",
  },
];

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isBackendConnected: boolean;
  backendUrl: string;
  activeSociety: HousingSociety | null;
  availableSocieties: HousingSociety[];
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (profileId: "ADMIN" | "RESIDENT" | "VENDOR" | "AUDITOR" | "BUILDER") => void;
  loginAsPartner: (partner: {
    role: "ROLE_VENDOR" | "ROLE_BUILDER";
    name: string;
    email: string;
    companyName: string;
    businessIdentifier?: string;
    partnerVertical?: string;
  }) => void;
  signup: (data: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchSociety: (societyId: number) => void;
  checkBackendConnection: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [activeSociety, setActiveSociety] = useState<HousingSociety | null>(null);
  const [availableSocieties, setAvailableSocieties] = useState<HousingSociety[]>(MOCK_SOCIETIES);

  // Check backend health
  const checkBackendConnection = useCallback(async (): Promise<boolean> => {
    const isOnline = await apiClient.checkHealth();
    setIsBackendConnected(isOnline);
    return isOnline;
  }, []);

  // Fetch societies for active selector
  const loadSocieties = useCallback(async () => {
    try {
      const list = await societiesApi.getAll();
      if (list && list.length > 0) {
        setAvailableSocieties(list);
        return list;
      }
    } catch {
      // Keep mock societies
    }
    return MOCK_SOCIETIES;
  }, []);

  // Initialize session from localStorage
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const online = await checkBackendConnection();
      const societies = await loadSocieties();

      const savedToken = localStorage.getItem(CONFIG.storageKeys.token);
      const savedUserStr = localStorage.getItem(CONFIG.storageKeys.user);
      const savedSocietyIdStr = localStorage.getItem(CONFIG.storageKeys.activeSociety);

      if (savedUserStr) {
        try {
          const parsedUser = JSON.parse(savedUserStr) as AuthUser;
          setUser(parsedUser);
          setToken(savedToken || "demo-token-12345");
        } catch (e) {
          console.error("Failed to parse saved user", e);
        }
      } else {
        // Set default demo admin user so app is immediately usable out-of-the-box
        const defaultAdmin = DEMO_PROFILES[0];
        const defaultAuthUser: AuthUser = {
          userId: 1,
          fullName: defaultAdmin.name,
          email: defaultAdmin.email,
          roleName: defaultAdmin.roleName,
          roleId: 1,
          societyId: 1,
          societyName: defaultAdmin.societyName,
        };
        setUser(defaultAuthUser);
        setToken("demo-token-ecosociety");
        localStorage.setItem(CONFIG.storageKeys.user, JSON.stringify(defaultAuthUser));
        localStorage.setItem(CONFIG.storageKeys.token, "demo-token-ecosociety");
      }

      // Active society
      const initialSocietyId = savedSocietyIdStr ? parseInt(savedSocietyIdStr) : 1;
      const matchingSociety = societies.find((s) => s.societyId === initialSocietyId) || societies[0];
      setActiveSociety(matchingSociety);

      setIsLoading(false);
    }

    init();
  }, [checkBackendConnection, loadSocieties]);

  // Switch Active Society
  const switchSociety = (societyId: number) => {
    const found = availableSocieties.find((s) => s.societyId === societyId);
    if (found) {
      setActiveSociety(found);
      localStorage.setItem(CONFIG.storageKeys.activeSociety, String(societyId));
      if (user) {
        const updated = { ...user, societyId: found.societyId, societyName: found.societyName };
        setUser(updated);
        localStorage.setItem(CONFIG.storageKeys.user, JSON.stringify(updated));
      }
    }
  };

  // Login handler
  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const isOnline = await checkBackendConnection();

      // Check if credentials match any demo profiles directly
      const demoMatch = DEMO_PROFILES.find(
        (p) => p.email.toLowerCase() === credentials.email.toLowerCase()
      );

      if (isOnline) {
        try {
          // Attempt to find user by email from backend /api/users
          const users = await usersApi.getAll();
          const backendUser = users.find(
            (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
          );

          if (backendUser) {
            const authUser: AuthUser = {
              userId: backendUser.userId,
              fullName: backendUser.fullName,
              email: backendUser.email,
              phoneNumber: backendUser.phoneNumber,
              roleName: backendUser.role?.roleName || "ROLE_RESIDENT",
              roleId: backendUser.role?.roleId || 2,
              societyId: activeSociety?.societyId || 1,
              societyName: activeSociety?.societyName || "GreenWood Heights Co-operative Society",
            };

            const authToken = `jwt-token-${backendUser.userId}-${Date.now()}`;
            setUser(authUser);
            setToken(authToken);
            localStorage.setItem(CONFIG.storageKeys.user, JSON.stringify(authUser));
            localStorage.setItem(CONFIG.storageKeys.token, authToken);
            setIsLoading(false);
            return { success: true };
          }
        } catch (backendErr) {
          console.warn("Backend user lookup error, evaluating demo fallback:", backendErr);
        }
      }

      // If matched demo profile or demo fallback
      if (demoMatch) {
        loginAsDemo(demoMatch.id);
        setIsLoading(false);
        return { success: true };
      }

      // Generic login for non-demo email in offline/prototype mode
      const genericUser: AuthUser = {
        userId: Math.floor(Math.random() * 1000) + 10,
        fullName: credentials.email.split("@")[0].replace(/[._-]/g, " "),
        email: credentials.email,
        roleName: "ROLE_RESIDENT",
        roleId: 2,
        societyId: activeSociety?.societyId || 1,
        societyName: activeSociety?.societyName || "GreenWood Heights Co-operative Society",
      };

      const genToken = `session-${Date.now()}`;
      setUser(genericUser);
      setToken(genToken);
      localStorage.setItem(CONFIG.storageKeys.user, JSON.stringify(genericUser));
      localStorage.setItem(CONFIG.storageKeys.token, genToken);
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      return { success: false, error: (err as Error)?.message || "Login failed" };
    }
  };

  // Instant Demo Login
  const loginAsDemo = (profileId: "ADMIN" | "RESIDENT" | "VENDOR" | "AUDITOR" | "BUILDER") => {
    const profile = DEMO_PROFILES.find((p) => p.id === profileId) || DEMO_PROFILES[0];
    const authUser: AuthUser = {
      userId:
        profileId === "ADMIN"
          ? 1
          : profileId === "RESIDENT"
          ? 2
          : profileId === "BUILDER"
          ? 6
          : profileId === "VENDOR"
          ? 4
          : 5,
      fullName: profile.name,
      email: profile.email,
      roleName: profile.roleName,
      roleId:
        profileId === "ADMIN"
          ? 1
          : profileId === "RESIDENT"
          ? 2
          : profileId === "BUILDER"
          ? 5
          : profileId === "VENDOR"
          ? 3
          : 4,
      societyId: 1,
      societyName: profile.societyName,
    };

    const demoToken = `demo-${profileId.toLowerCase()}-${Date.now()}`;
    setUser(authUser);
    setToken(demoToken);
    localStorage.setItem(CONFIG.storageKeys.user, JSON.stringify(authUser));
    localStorage.setItem(CONFIG.storageKeys.token, demoToken);
  };

  // Dedicated Vendor & Builder Partner Login
  const loginAsPartner = useCallback((partner: {
    role: "ROLE_VENDOR" | "ROLE_BUILDER";
    name: string;
    email: string;
    companyName: string;
    businessIdentifier?: string;
    partnerVertical?: string;
  }) => {
    const authUser: AuthUser = {
      userId: partner.role === "ROLE_BUILDER" ? 6 : 4,
      fullName: partner.name,
      email: partner.email,
      roleName: partner.role,
      roleId: partner.role === "ROLE_BUILDER" ? 5 : 3,
      societyId: 1,
      societyName: partner.companyName,
      companyName: partner.companyName,
      businessIdentifier: partner.businessIdentifier,
      partnerVertical: partner.partnerVertical,
    };

    const partnerToken = `partner-${partner.role.toLowerCase()}-${Date.now()}`;
    setUser(authUser);
    setToken(partnerToken);
    localStorage.setItem(CONFIG.storageKeys.user, JSON.stringify(authUser));
    localStorage.setItem(CONFIG.storageKeys.token, partnerToken);
  }, []);

  // Sign Up handler
  const signup = async (data: RegisterRequest): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const isOnline = await checkBackendConnection();

      // Determine role ID
      let roleId = 2; // Default resident
      if (data.roleName === "ROLE_ADMIN") roleId = 1;
      else if (data.roleName === "ROLE_VENDOR") roleId = 3;
      else if (data.roleName === "ROLE_AUDITOR") roleId = 4;

      let createdBackendUser: User | null = null;

      if (isOnline) {
        try {
          // 1. Create User in backend via POST /api/users
          createdBackendUser = await usersApi.create({
            fullName: data.fullName,
            email: data.email,
            passwordHash: data.password || "default-hash-pwd",
            phoneNumber: data.phoneNumber,
            role: { roleId, roleName: data.roleName },
          });

          // 2. If Vendor, create Vendor Profile via POST /api/vendor-profiles
          if (data.roleName === "ROLE_VENDOR" && createdBackendUser?.userId) {
            await vendorProfilesApi.create({
              user: { userId: createdBackendUser.userId },
              companyName: data.companyName || data.fullName,
              gstNumber: data.gstNumber || "GST-PENDING",
              isVerified: false,
            });
          }

          // 3. If Society Member, link via POST /api/society-members
          if (data.societyId && createdBackendUser?.userId) {
            await societyMembersApi.addMember({
              society: { societyId: data.societyId },
              user: { userId: createdBackendUser.userId },
              flatNumber: data.flatNumber || "Unassigned",
            });
          }
        } catch (backendErr) {
          console.warn("Backend user creation warning (continuing with local state):", backendErr);
        }
      }

      const authUser: AuthUser = {
        userId: createdBackendUser?.userId || Math.floor(Math.random() * 1000) + 10,
        fullName: data.fullName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        roleName: data.roleName,
        roleId,
        societyId: data.societyId || 1,
        societyName: data.societyName || "GreenWood Heights Co-operative Society",
        flatNumber: data.flatNumber,
        companyName: data.companyName,
      };

      const authToken = `jwt-new-${authUser.userId}-${Date.now()}`;
      setUser(authUser);
      setToken(authToken);
      localStorage.setItem(CONFIG.storageKeys.user, JSON.stringify(authUser));
      localStorage.setItem(CONFIG.storageKeys.token, authToken);
      setIsLoading(false);
      return { success: true };
    } catch (err: unknown) {
      setIsLoading(false);
      return { success: false, error: (err as Error)?.message || "Registration failed" };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(CONFIG.storageKeys.user);
    localStorage.removeItem(CONFIG.storageKeys.token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        isBackendConnected,
        backendUrl: API_BASE_URL,
        activeSociety,
        availableSocieties,
        login,
        loginAsDemo,
        loginAsPartner,
        signup,
        logout,
        switchSociety,
        checkBackendConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
