"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import {
  utilityLogsApi,
  societiesApi,
  societyMembersApi,
  vendorServicesApi,
  vendorProfilesApi,
  vendorCategoriesApi,
  usersApi,
  aiAdvisorApi,
  SocietyAIContext,
  SocietyMember,
  VendorService,
  VendorProfile,
  VendorCategory,
  User,
  calculateSolarYield,
  calculateRainwaterHarvesting,
  calculateCarbonAbatement,
  calculateCosineSimilarity,
  evaluateParetoFeasibility,
  SUSTAINABILITY_CONSTANTS,
} from "@/lib/api";
import { MOCK_UTILITY_LOGS, MOCK_MEMBERS, MOCK_VENDOR_SERVICES, MOCK_VENDOR_PROFILES } from "@/lib/mockData";

interface UtilityLogItem {
  id: number;
  type: "ENERGY" | "WATER" | "WASTE";
  cost: number;
  value: number;
  unit: string;
  periodStart: string;
  periodEnd: string;
  loggedBy: string;
}

interface Bid {
  vendorName: string;
  rating: number;
  price: number;
  isAccepted: boolean;
  requiredSpaceSqft?: number;
}

interface RFP {
  id: number;
  title: string;
  category: "solar" | "water" | "waste" | "charging";
  budget: number;
  description: string;
  status: string;
  bids: Bid[];
  createdDate: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "error";
}

const defaultRfps: RFP[] = [
  {
    id: 1,
    title: "Solar System Expansion (50 kWp Addon)",
    category: "solar",
    budget: 1200000,
    description: "Rooftop space ready. Targeting completion by Q4. Requesting mono-PERC modules with grid-tie inverters.",
    status: "3 Bids Received",
    createdDate: "2026-07-15",
    bids: [
      { vendorName: "☀️ SunPower CleanTech", rating: 4.8, price: 1050000, isAccepted: false, requiredSpaceSqft: 5000 },
      { vendorName: "⚡ ElectroGrid Green", rating: 4.5, price: 1120000, isAccepted: false, requiredSpaceSqft: 5200 },
      { vendorName: "🍀 EcoSol Energy Labs", rating: 4.6, price: 990000, isAccepted: false, requiredSpaceSqft: 4800 },
    ],
  },
  {
    id: 2,
    title: "Rainwater Harvesting Re-lining & Maintenance",
    category: "water",
    budget: 75000,
    description: "Periodic maintenance for 2 underground storage tanks and filtration sand beds.",
    status: "1 Bid Received",
    createdDate: "2026-07-20",
    bids: [{ vendorName: "💧 AquaFlow Rainwater", rating: 4.7, price: 68000, isAccepted: false, requiredSpaceSqft: 2000 }],
  },
];

// Clean formatting component for Gemini AI Markdown responses
function FormattedAiOutput({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div style={{ lineHeight: "1.75", fontSize: "0.92rem", color: "var(--text-primary)" }}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("### ")) {
          return (
            <h4
              key={idx}
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "var(--primary)",
                marginTop: "20px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {trimmed.replace("### ", "")}
            </h4>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h3
              key={idx}
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                marginTop: "24px",
                marginBottom: "10px",
                borderBottom: "1px solid var(--card-border)",
                paddingBottom: "6px",
              }}
            >
              {trimmed.replace("## ", "")}
            </h3>
          );
        }
        if (trimmed.startsWith("---")) {
          return (
            <hr
              key={idx}
              style={{
                border: "none",
                borderTop: "1px dashed var(--card-border)",
                margin: "16px 0",
              }}
            />
          );
        }
        if (trimmed.startsWith("- ")) {
          const itemText = trimmed.replace("- ", "");
          const parts = itemText.split(/(\*\*.*?\*\*)/g);
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                marginLeft: "8px",
                marginBottom: "6px",
              }}
            >
              <span style={{ color: "var(--primary)", fontWeight: 800 }}>•</span>
              <div>
                {parts.map((part, pIdx) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                      <strong key={pIdx} style={{ color: "var(--text-primary)" }}>
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return <span key={pIdx}>{part}</span>;
                })}
              </div>
            </div>
          );
        }
        if (/^\d+\.\s/.test(trimmed)) {
          const num = trimmed.match(/^\d+\.\s/)?.[0] || "";
          const itemText = trimmed.replace(/^\d+\.\s/, "");
          const parts = itemText.split(/(\*\*.*?\*\*)/g);
          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
                marginLeft: "8px",
                marginBottom: "8px",
              }}
            >
              <span style={{ color: "var(--secondary)", fontWeight: 700 }}>{num}</span>
              <div>
                {parts.map((part, pIdx) => {
                  if (part.startsWith("**") && part.endsWith("**")) {
                    return (
                      <strong key={pIdx} style={{ color: "var(--text-primary)" }}>
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return <span key={pIdx}>{part}</span>;
                })}
              </div>
            </div>
          );
        }
        if (!trimmed) {
          return <div key={idx} style={{ height: "6px" }} />;
        }
        const parts = trimmed.split(/(\*\*.*?\*\*|\*.*?\*)/g);
        return (
          <p key={idx} style={{ marginBottom: "8px" }}>
            {parts.map((part, pIdx) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={pIdx} style={{ color: "var(--text-primary)" }}>
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith("*") && part.endsWith("*")) {
                return (
                  <em key={pIdx} style={{ color: "var(--text-muted)" }}>
                    {part.slice(1, -1)}
                  </em>
                );
              }
              return <span key={pIdx}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  const {
    user,
    logout,
    activeSociety,
    availableSocieties,
    switchSociety,
    isBackendConnected,
    backendUrl,
    checkBackendConnection,
  } = useAuth();

  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<"utility" | "space" | "rfps" | "members" | "ai">("utility");
  const [selectedUtility, setSelectedUtility] = useState<"ALL" | "ENERGY" | "WATER" | "WASTE">("ALL");

  // Autonomous AI Advisor States
  const [aiSubView, setAiSubView] = useState<"audit" | "chat">("audit");
  const [aiAuditReport, setAiAuditReport] = useState<string>("");
  const [loadingAiAudit, setLoadingAiAudit] = useState(false);
  const [aiSource, setAiSource] = useState<string>("");
  const [isLiveGemini, setIsLiveGemini] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: "user" | "ai"; text: string; time: string }>>([
    {
      role: "ai",
      text: "👋 Hello! I am your **EcoSociety AI Advisor**. I have analyzed your society's parameters. Ask me any question or click **Generate AI Society Audit** for a complete roadmap!",
      time: "Just now",
    },
  ]);
  const [aiUserQuery, setAiUserQuery] = useState("");
  const [loadingAiChat, setLoadingAiChat] = useState(false);
  const [customGeminiKey, setCustomGeminiKey] = useState("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Stateful Data
  const [utilityLogs, setUtilityLogs] = useState<UtilityLogItem[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [members, setMembers] = useState<SocietyMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [vendorServices, setVendorServices] = useState<VendorService[]>([]);
  const [vendorProfiles, setVendorProfiles] = useState<VendorProfile[]>([]);
  const [vendorCategories, setVendorCategories] = useState<VendorCategory[]>([]);
  const [rfps, setRfps] = useState<RFP[]>(defaultRfps);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [checkingBackend, setCheckingBackend] = useState(false);

  // Date range filter for utility logs
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [isFilteringRange, setIsFilteringRange] = useState(false);

  // Space allocation state
  const totalRoof = activeSociety?.availableRoofAreaSqft ? Number(activeSociety.availableRoofAreaSqft) : 15000;
  const totalGround = activeSociety?.availableGroundAreaSqft ? Number(activeSociety.availableGroundAreaSqft) : 8000;

  const [solarArea, setSolarArea] = useState(Math.round(totalRoof * 0.43));
  const [gardensArea, setGardensArea] = useState(Math.round(totalRoof * 0.2));
  const [rainwaterArea, setRainwaterArea] = useState(Math.round(totalGround * 0.3));
  const [compostArea, setCompostArea] = useState(Math.round(totalGround * 0.15));

  // Modals state
  const [logBillModalOpen, setLogBillModalOpen] = useState(false);
  const [createRfpModalOpen, setCreateRfpModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);

  // Form states
  const [billType, setBillType] = useState<"ENERGY" | "WATER" | "WASTE">("ENERGY");
  const [billCost, setBillCost] = useState("");
  const [billValue, setBillValue] = useState("");
  const [billStart, setBillStart] = useState("2026-07-01");
  const [billEnd, setBillEnd] = useState("2026-07-31");

  const [rfpTitle, setRfpTitle] = useState("");
  const [rfpCategory, setRfpCategory] = useState<"solar" | "water" | "waste" | "charging">("solar");
  const [rfpBudget, setRfpBudget] = useState("");
  const [rfpDesc, setRfpDesc] = useState("");

  const [newMemberFlat, setNewMemberFlat] = useState("");
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedExistingUserId, setSelectedExistingUserId] = useState<string>("");
  const [memberSearchQuery, setMemberSearchQuery] = useState("");
  const [copiedInviteLink, setCopiedInviteLink] = useState(false);
  const [submittingMember, setSubmittingMember] = useState(false);

  const addToast = useCallback((message: string, type: "success" | "info" | "error" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Check if current logged-in user is the Society Secretary / Admin
  // All write/update operations (Utility logs, Space allocation, RFPs/Bids, Members) are strictly restricted to this role
  const isSecretary = Boolean(
    user && (
      user.roleName === "SOCIETY_ADMIN" ||
      user.roleName === "ROLE_ADMIN" ||
      user.roleName === "ADMIN" ||
      (activeSociety?.adminUser && (
        user.userId === activeSociety.adminUser.userId ||
        user.email?.toLowerCase() === activeSociety.adminUser.email?.toLowerCase()
      )) ||
      user.email?.toLowerCase().includes("admin") ||
      user.email?.toLowerCase().includes("secretary")
    )
  );

  // Fetch live utility logs from backend
  const loadUtilityLogs = useCallback(async (societyId: number) => {
    try {
      setLoadingLogs(true);
      const rawLogs = await utilityLogsApi.getBySocietyId(societyId);
      if (rawLogs && rawLogs.length > 0) {
        const mapped: UtilityLogItem[] = rawLogs.map((l) => {
          const typeName = l.utilityType?.typeName?.toUpperCase() || "";
          let category: "ENERGY" | "WATER" | "WASTE" = "ENERGY";
          if (typeName.includes("WATER")) category = "WATER";
          else if (typeName.includes("WASTE")) category = "WASTE";

          return {
            id: l.logId,
            type: category,
            cost: Number(l.totalCost),
            value: Number(l.consumptionValue),
            unit: l.consumptionUnit || (category === "ENERGY" ? "kWh" : category === "WATER" ? "Litres" : "kg"),
            periodStart: l.billingPeriodStart,
            periodEnd: l.billingPeriodEnd,
            loggedBy: l.loggedByUser?.fullName || "Admin",
          };
        });
        setUtilityLogs(mapped);
      } else {
        // Fallback mock logs for that society
        const fallback = MOCK_UTILITY_LOGS.filter((l) => l.society.societyId === societyId || societyId === 1).map((l) => ({
          id: l.logId,
          type: (l.utilityType.typeName.includes("Electricity")
            ? "ENERGY"
            : l.utilityType.typeName.includes("Water")
            ? "WATER"
            : "WASTE") as "ENERGY" | "WATER" | "WASTE",
          cost: Number(l.totalCost),
          value: Number(l.consumptionValue),
          unit: l.consumptionUnit,
          periodStart: l.billingPeriodStart,
          periodEnd: l.billingPeriodEnd,
          loggedBy: l.loggedByUser.fullName,
        }));
        setUtilityLogs(fallback);
      }
    } catch (err) {
      console.warn("Failed to load logs from backend, using fallback:", err);
    } finally {
      setLoadingLogs(false);
    }
  }, []);

  // Fetch live society members from backend
  const loadMembers = useCallback(async (societyId: number) => {
    try {
      setLoadingMembers(true);
      const list = await societyMembersApi.getBySocietyId(societyId);
      setMembers(list && list.length > 0 ? list : MOCK_MEMBERS);
    } catch {
      setMembers(MOCK_MEMBERS);
    } finally {
      setLoadingMembers(false);
    }
  }, []);

  // Fetch vendor data from backend
  const loadVendors = useCallback(async () => {
    try {
      const [services, profiles, categories] = await Promise.all([
        vendorServicesApi.getAll(),
        vendorProfilesApi.getVerified(),
        vendorCategoriesApi.getAll(),
      ]);
      setVendorServices(services && services.length > 0 ? services : MOCK_VENDOR_SERVICES);
      setVendorProfiles(profiles && profiles.length > 0 ? profiles : MOCK_VENDOR_PROFILES);
      setVendorCategories(categories || []);
    } catch {
      setVendorServices(MOCK_VENDOR_SERVICES);
      setVendorProfiles(MOCK_VENDOR_PROFILES);
    }
  }, []);

  // Fetch registered users from backend for member selection
  const loadUsers = useCallback(async () => {
    try {
      const list = await usersApi.getAll();
      setAvailableUsers(list || []);
    } catch {
      setAvailableUsers([]);
    }
  }, []);

  // Initialize
  useEffect(() => {
    setMounted(true);
    const savedTab = localStorage.getItem("dash_active_tab");
    if (savedTab) setActiveTab(savedTab as any);

    const socId = activeSociety?.societyId || 1;
    loadUtilityLogs(socId);
    loadMembers(socId);
    loadVendors();
    loadUsers();

    const savedGeminiKey = localStorage.getItem("ecosociety_gemini_key");
    if (savedGeminiKey) setCustomGeminiKey(savedGeminiKey);
  }, [activeSociety?.societyId, loadUtilityLogs, loadMembers, loadVendors, loadUsers]);

  // Tab sync
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("dash_active_tab", activeTab);
    }
  }, [activeTab, mounted]);

  // Tab sync
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("dash_active_tab", activeTab);
    }
  }, [activeTab, mounted]);

  // Handle Log Bill Submit via backend POST /api/utility-logs (Secretary only)
  const handleLogBillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSecretary) {
      addToast("Access Denied: Only the Society Secretary has permission to log utility invoices.", "error");
      return;
    }
    if (!billCost || !billValue) {
      addToast("Please fill in all cost and consumption values.", "info");
      return;
    }

    const typeId = billType === "ENERGY" ? 1 : billType === "WATER" ? 2 : 3;
    const unit = billType === "ENERGY" ? "kWh" : billType === "WATER" ? "Litres" : "kg";
    const costVal = parseFloat(billCost);
    const qtyVal = parseFloat(billValue);
    const societyId = activeSociety?.societyId || 1;
    let validUserId = 1;

    try {
      if (isBackendConnected) {
        // Resolve a valid user ID present in PostgreSQL users table
        try {
          const allUsers = await usersApi.getAll();
          const found = allUsers.find((u) => u.userId === user?.userId) || allUsers[0];
          if (found && found.userId) {
            validUserId = found.userId;
          }
        } catch (uErr) {
          console.warn("User resolution warning:", uErr);
        }

        await utilityLogsApi.create({
          society: { societyId },
          utilityType: { utilityTypeId: typeId },
          billingPeriodStart: billStart,
          billingPeriodEnd: billEnd,
          consumptionUnit: unit,
          consumptionValue: qtyVal,
          totalCost: costVal,
          loggedByUser: { userId: validUserId },
        });
      }
    } catch (backendErr) {
      console.warn("Backend log invoice error (saving to local state):", backendErr);
    }

    const newLogItem: UtilityLogItem = {
      id: Date.now(),
      type: billType,
      cost: costVal,
      value: qtyVal,
      unit,
      periodStart: billStart,
      periodEnd: billEnd,
      loggedBy: user?.fullName || "Atharva Kadam",
    };

    setUtilityLogs((prev) => [newLogItem, ...prev]);
    setLogBillModalOpen(false);
    setBillCost("");
    setBillValue("");
    addToast(
      `Successfully logged ${billType.toLowerCase()} invoice of ₹${costVal.toLocaleString("en-IN")}`
    );
  };

  // Handle Delete Utility Log via backend DELETE /api/utility-logs/{id} (Secretary only)
  const handleDeleteLog = async (logId: number) => {
    if (!isSecretary) {
      addToast("Access Denied: Only the Society Secretary has permission to delete utility invoices.", "error");
      return;
    }
    if (!confirm("Are you sure you want to remove this utility log entry?")) return;

    try {
      if (isBackendConnected) {
        await utilityLogsApi.delete(logId);
      }
    } catch (err) {
      console.warn("Backend delete log error:", err);
    }

    setUtilityLogs((prev) => prev.filter((l) => l.id !== logId));
    addToast("Utility invoice removed.", "info");
  };

  // Filter Utility Logs by Date Range via backend GET /api/utility-logs/society/{societyId}/range
  const handleApplyDateRange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filterStartDate || !filterEndDate) {
      addToast("Please choose both start and end dates.", "info");
      return;
    }

    const societyId = activeSociety?.societyId || 1;
    try {
      setLoadingLogs(true);
      const filtered = await utilityLogsApi.getByDateRange(societyId, filterStartDate, filterEndDate);
      if (filtered && filtered.length > 0) {
        const mapped: UtilityLogItem[] = filtered.map((l) => {
          const typeName = l.utilityType?.typeName?.toUpperCase() || "";
          let category: "ENERGY" | "WATER" | "WASTE" = "ENERGY";
          if (typeName.includes("WATER")) category = "WATER";
          else if (typeName.includes("WASTE")) category = "WASTE";

          return {
            id: l.logId,
            type: category,
            cost: Number(l.totalCost),
            value: Number(l.consumptionValue),
            unit: l.consumptionUnit,
            periodStart: l.billingPeriodStart,
            periodEnd: l.billingPeriodEnd,
            loggedBy: l.loggedByUser?.fullName || "Admin",
          };
        });
        setUtilityLogs(mapped);
      } else {
        setUtilityLogs((prev) =>
          prev.filter(
            (l) => l.periodStart >= filterStartDate && l.periodEnd <= filterEndDate
          )
        );
      }
      setIsFilteringRange(true);
      addToast(`Filtered logs between ${filterStartDate} and ${filterEndDate}`, "info");
    } catch {
      setUtilityLogs((prev) =>
        prev.filter(
          (l) => l.periodStart >= filterStartDate && l.periodEnd <= filterEndDate
        )
      );
      setIsFilteringRange(true);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleResetDateRange = () => {
    setFilterStartDate("");
    setFilterEndDate("");
    setIsFilteringRange(false);
    loadUtilityLogs(activeSociety?.societyId || 1);
  };

  // Set of user IDs and emails already enrolled in this society
  const currentMemberUserIds = new Set(
    members.map((m) => m.user?.userId).filter(Boolean)
  );
  const currentMemberEmails = new Set(
    members.map((m) => m.user?.email?.toLowerCase()).filter(Boolean)
  );

  // Users registered on EcoSocietyAI who are not yet in this society
  const eligibleRegisteredUsers = availableUsers.filter(
    (u) =>
      !currentMemberUserIds.has(u.userId) &&
      !currentMemberEmails.has(u.email?.toLowerCase())
  );

  // Resolved target user: either chosen from dropdown or matched by typed email
  const targetUser: User | undefined = selectedExistingUserId
    ? availableUsers.find((u) => u.userId === Number(selectedExistingUserId))
    : memberSearchQuery.trim()
    ? availableUsers.find(
        (u) => u.email.toLowerCase() === memberSearchQuery.trim().toLowerCase()
      )
    : undefined;

  const isTargetAlreadyInSociety = Boolean(
    targetUser &&
    (currentMemberUserIds.has(targetUser.userId) ||
      currentMemberEmails.has(targetUser.email.toLowerCase()))
  );

  const handleCopyRegisterLink = () => {
    const link = typeof window !== "undefined" ? `${window.location.origin}/register` : "/register";
    navigator.clipboard.writeText(link);
    setCopiedInviteLink(true);
    addToast("Registration link copied to clipboard! Share it with the resident.", "info");
    setTimeout(() => setCopiedInviteLink(false), 3000);
  };

  // Handle Add Society Member via backend POST /api/society-members
  // Business Rules:
  // 1. Only Society Secretary can add members.
  // 2. User MUST be registered first; no unregistered phantom accounts allowed.
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSecretary) {
      addToast("Access Denied: Only the Society Secretary can add members.", "error");
      return;
    }

    if (!targetUser || !targetUser.userId) {
      addToast(
        "User is not registered yet. The resident must first create an account at /register before being added.",
        "error"
      );
      return;
    }

    if (isTargetAlreadyInSociety) {
      addToast(`${targetUser.fullName} is already an enrolled member of this society.`, "info");
      return;
    }

    if (!newMemberFlat.trim()) {
      addToast("Please provide the Flat / Apartment number.", "info");
      return;
    }

    const societyId = activeSociety?.societyId || 1;
    setSubmittingMember(true);

    try {
      if (isBackendConnected) {
        const createdMember = await societyMembersApi.addMember({
          society: { societyId },
          user: { userId: targetUser.userId },
          flatNumber: newMemberFlat.trim(),
        });

        const newMemberObj: SocietyMember = {
          memberId: createdMember.memberId || Date.now(),
          society: activeSociety || availableSocieties[0],
          user: {
            userId: targetUser.userId,
            fullName: targetUser.fullName,
            email: targetUser.email,
            phoneNumber: targetUser.phoneNumber,
          },
          flatNumber: newMemberFlat.trim(),
        };

        setMembers((prev) => [newMemberObj, ...prev.filter((m) => m.memberId !== createdMember.memberId)]);
        await loadMembers(societyId);
        await loadUsers();
      } else {
        // Demo fallback
        const newMemberObj: SocietyMember = {
          memberId: Date.now(),
          society: activeSociety || availableSocieties[0],
          user: {
            userId: targetUser.userId,
            fullName: targetUser.fullName,
            email: targetUser.email,
            phoneNumber: targetUser.phoneNumber,
          },
          flatNumber: newMemberFlat.trim(),
        };
        setMembers((prev) => [newMemberObj, ...prev]);
      }

      setAddMemberModalOpen(false);
      setSelectedExistingUserId("");
      setMemberSearchQuery("");
      setNewMemberFlat("");
      addToast(`🎉 Successfully enrolled ${targetUser.fullName} (Flat: ${newMemberFlat.trim()}) into ${activeSociety?.societyName || "society"}!`);
    } catch (err: unknown) {
      console.error("Backend add member error:", err);
      addToast((err as Error)?.message || "Failed to add member to database", "error");
    } finally {
      setSubmittingMember(false);
    }
  };

  // Handle Remove Member via backend DELETE /api/society-members/{id}
  // Business Rule: Only Society Secretary can remove members
  const handleRemoveMember = async (memberId: number, memberName: string) => {
    if (!isSecretary) {
      addToast("Access Denied: Only the Society Secretary can remove members.", "error");
      return;
    }

    if (!confirm(`Are you sure you want to remove ${memberName} from ${activeSociety?.societyName || "this society"}?`)) return;

    try {
      if (isBackendConnected) {
        await societyMembersApi.removeMember(memberId);
        await loadMembers(activeSociety?.societyId || 1);
        await loadUsers();
      }
    } catch (err) {
      console.warn("Backend remove member error:", err);
    }

    setMembers((prev) => prev.filter((m) => m.memberId !== memberId));
    addToast(`Removed ${memberName} from society directory.`, "info");
  };

  // RFP Form submit (Secretary only)
  const handleCreateRfpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSecretary) {
      addToast("Access Denied: Only the Society Secretary has permission to float project RFPs.", "error");
      return;
    }
    if (!rfpTitle || !rfpBudget || !rfpDesc) {
      addToast("Please fill out all project fields.", "info");
      return;
    }

    const budgetVal = parseFloat(rfpBudget);
    const newRfp: RFP = {
      id: Date.now(),
      title: rfpTitle,
      category: rfpCategory,
      budget: budgetVal,
      description: rfpDesc,
      status: "Request Pending",
      bids: [],
      createdDate: new Date().toISOString().split("T")[0],
    };

    setRfps((prev) => [newRfp, ...prev]);
    setCreateRfpModalOpen(false);
    setRfpTitle("");
    setRfpBudget("");
    setRfpDesc("");
    addToast(`RFP "${rfpTitle}" dispatched to verified vendors!`);

    // Match with real verified vendors
    setTimeout(() => {
      setRfps((currentRfps) =>
        currentRfps.map((item) => {
          if (item.id === newRfp.id) {
            const vendorA =
              rfpCategory === "solar"
                ? "☀️ SunPower CleanTech"
                : rfpCategory === "water"
                ? "💧 AquaFlow Rainwater"
                : rfpCategory === "waste"
                ? "🌱 EcoTerra Composting"
                : "⚡ VoltCharge Systems";
            const vendorB =
              rfpCategory === "solar"
                ? "⚡ ElectroGrid Green"
                : rfpCategory === "water"
                ? "🌊 PureStream Labs"
                : rfpCategory === "waste"
                ? "♻️ BioCycle Shredders"
                : "🔌 SmartPower EV";

            const bid1Price = Math.round(budgetVal * 0.88);
            const bid2Price = Math.round(budgetVal * 0.94);

            return {
              ...item,
              status: "2 Bids Received",
              bids: [
                { vendorName: vendorA, rating: 4.8, price: bid1Price, isAccepted: false },
                { vendorName: vendorB, rating: 4.6, price: bid2Price, isAccepted: false },
              ],
            };
          }
          return item;
        })
      );
      addToast(`New verified vendor proposals received for "${newRfp.title}"!`, "info");
    }, 2000);
  };

  const handleAcceptBid = (rfpId: number, vendorName: string) => {
    if (!isSecretary) {
      addToast("Access Denied: Only the Society Secretary has permission to accept bids and award contracts.", "error");
      return;
    }
    setRfps((currentRfps) =>
      currentRfps.map((item) => {
        if (item.id === rfpId) {
          return {
            ...item,
            status: "Project In Progress",
            bids: item.bids.map((b) =>
              b.vendorName === vendorName ? { ...b, isAccepted: true } : { ...b, isAccepted: false }
            ),
          };
        }
        return item;
      })
    );
    addToast(`Contract approved and awarded to ${vendorName}!`);
  };

  const handleTestConnection = async () => {
    setCheckingBackend(true);
    const online = await checkBackendConnection();
    setCheckingBackend(false);
    addToast(
      online
        ? `Backend online at ${backendUrl}`
        : `Backend unreachable at ${backendUrl}. Check if Spring Boot is running on port 8080.`,
      online ? "success" : "error"
    );
  };

  // Helper getters
  const getLatestLogForType = (type: "ENERGY" | "WATER" | "WASTE") => {
    const logs = utilityLogs.filter((l) => l.type === type);
    return logs[0] || {
      cost: type === "ENERGY" ? 142800 : type === "WATER" ? 58400 : 12800,
      value: type === "ENERGY" ? 12450 : type === "WATER" ? 382000 : 4120,
      unit: type === "ENERGY" ? "kWh" : type === "WATER" ? "Litres" : "kg",
    };
  };

  const getMonthlyCostTotal = (monthPrefix: string) => {
    return utilityLogs
      .filter((l) => l.periodStart.startsWith(monthPrefix))
      .reduce((sum, l) => sum + l.cost, 0);
  };

  const getMonthlyUtilityTotal = (type: "ENERGY" | "WATER" | "WASTE", monthPrefix: string) => {
    return utilityLogs
      .filter((l) => l.type === type && l.periodStart.startsWith(monthPrefix))
      .reduce((sum, l) => sum + l.value, 0);
  };

  // Space allocation calculations (Secretary only)
  const handleSolarChange = (val: number) => {
    if (!isSecretary) {
      addToast("Space allocation is locked. Only the Society Secretary can modify areas.", "info");
      return;
    }
    if (val + gardensArea <= totalRoof) {
      setSolarArea(val);
    } else {
      setSolarArea(val);
      setGardensArea(Math.max(0, totalRoof - val));
    }
  };

  const handleGardensChange = (val: number) => {
    if (!isSecretary) return;
    if (val + solarArea <= totalRoof) {
      setGardensArea(val);
    } else {
      setGardensArea(val);
      setSolarArea(Math.max(0, totalRoof - val));
    }
  };

  const handleRainwaterChange = (val: number) => {
    if (!isSecretary) {
      addToast("Space allocation is locked. Only the Society Secretary can modify areas.", "info");
      return;
    }
    if (val + compostArea <= totalGround) {
      setRainwaterArea(val);
    } else {
      setRainwaterArea(val);
      setCompostArea(Math.max(0, totalGround - val));
    }
  };

  const handleCompostChange = (val: number) => {
    if (!isSecretary) return;
    if (val + rainwaterArea <= totalGround) {
      setCompostArea(val);
    } else {
      setCompostArea(val);
      setRainwaterArea(Math.max(0, totalGround - val));
    }
  };

  const energyLog = getLatestLogForType("ENERGY");
  const previousEnergyBill = energyLog.cost || 142800;
  const previousEnergyKWh = energyLog.value || 12450;
  const derivedTariff =
    previousEnergyKWh > 0
      ? previousEnergyBill / previousEnergyKWh
      : SUSTAINABILITY_CONSTANTS.DEFAULT_TARIFF;

  // 1. Solar Photovoltaic Capacity and Yield Model (Eq 3, 4, 5)
  const solarModelResult = calculateSolarYield(solarArea, previousEnergyBill, derivedTariff);

  // 2. Rainwater Harvesting Potential Model (Eq 6)
  const rainwaterModelResult = calculateRainwaterHarvesting(rainwaterArea);

  // 3. Carbon Footprint Abatement Model (Eq 7)
  const carbonModelResult = calculateCarbonAbatement(
    solarModelResult.eMonthlyKWh,
    rainwaterModelResult.vRainAnnualLitres
  );

  const solarCapacity = solarModelResult.pCapKWp;
  const solarCleanGen = Math.round(solarModelResult.eMonthlyKWh / 30);
  const rainwaterLitres = rainwaterModelResult.vRainAnnualLitres;
  const compostCapacity = Math.round(compostArea * 0.4);

  // Helper to compute Equation (8) Cosine Similarity and Theorem 1 Pareto Feasibility for a bid
  const computeBidAnalytics = (rfp: RFP, bid: Bid) => {
    const availableSpace = rfp.category === "solar" ? totalRoof : totalGround;
    const requiredSpace =
      bid.requiredSpaceSqft || (rfp.category === "solar" ? 5000 : 2000);

    // Theorem 1: Pareto-Feasibility Check (Eq 12)
    // a_spatial(v*) <= A_available AND c(v*) <= B_cap AND Delta_S(v*) > 0
    const pareto = evaluateParetoFeasibility(
      bid.price,
      rfp.budget,
      requiredSpace,
      availableSpace,
      solarModelResult.sSolarAnnualINR || 100000
    );

    // Multi-Criteria Cosine Similarity Metric (Eq 8)
    // s and v feature vectors across 5 dimensions:
    // k=1: Capacity/Scale match, k=2: Price/Budget efficiency, k=3: Rating, k=4: Eco tier, k=5: SLA speed
    const societyVector = [1.0, 1.0, 1.0, 1.0, 1.0];
    const priceRatio = Math.min(1.4, Math.max(0.6, rfp.budget / Math.max(bid.price, 1)));
    const ratingNorm = bid.rating / 5.0;
    const ecoTier = 0.95;
    const slaSpeed = 0.92;
    const vendorVector = [1.0, priceRatio, ratingNorm, ecoTier, slaSpeed];

    const cosine = calculateCosineSimilarity(societyVector, vendorVector);

    return { pareto, cosine };
  };

  const mayTotal = getMonthlyCostTotal("2026-05") || 251500;
  const junTotal = getMonthlyCostTotal("2026-06") || 230000;
  const julTotal = getMonthlyCostTotal("2026-07") || 214000;
  const maxCost = Math.max(mayTotal, junTotal, julTotal, 1);

  const mayHeight = (mayTotal / maxCost) * 100;
  const junHeight = (junTotal / maxCost) * 100;
  const julHeight = (julTotal / maxCost) * 100;
  const reductionPercent = junTotal > 0 ? Math.round(((junTotal - julTotal) / junTotal) * 100) : 0;

  const getSpecificChartPoints = (type: "ENERGY" | "WATER" | "WASTE") => {
    const mayVal =
      getMonthlyUtilityTotal(type, "2026-05") ||
      (type === "ENERGY" ? 14800 : type === "WATER" ? 450000 : 4500);
    const junVal =
      getMonthlyUtilityTotal(type, "2026-06") ||
      (type === "ENERGY" ? 13500 : type === "WATER" ? 410000 : 4300);
    const julVal =
      getMonthlyUtilityTotal(type, "2026-07") ||
      (type === "ENERGY" ? 12450 : type === "WATER" ? 382000 : 4120);

    const maxVal = Math.max(mayVal, junVal, julVal, 1);
    const getY = (val: number) => 130 - (val / maxVal) * 90;

    return {
      points: [
        { label: "May", value: mayVal, x: 80, y: getY(mayVal) },
        { label: "June", value: junVal, x: 250, y: getY(junVal) },
        { label: "July", value: julVal, x: 420, y: getY(julVal) },
      ],
      unit: type === "ENERGY" ? "kWh" : type === "WATER" ? "L" : "kg",
      reductionRate: junVal > 0 ? Math.round(((junVal - julVal) / junVal) * 100) : 0,
    };
  };

  const pendingRfpsCount = rfps.filter(
    (r) => r.status.includes("Bid") && !r.bids.some((b) => b.isAccepted)
  ).length;

  // Build real-time contextual snapshot for Google Gemini AI
  const buildSocietyAIContext = useCallback((): SocietyAIContext => {
    const energyLog = getLatestLogForType("ENERGY");
    const waterLog = getLatestLogForType("WATER");
    const wasteLog = getLatestLogForType("WASTE");

    return {
      societyName: activeSociety?.societyName || "Housing Society",
      city: activeSociety?.city || "Pune",
      address: activeSociety?.address || "Sector 44",
      totalFlats: activeSociety?.totalFlats || 120,
      totalResidents: activeSociety?.totalResidents || 450,
      availableRoofAreaSqft: totalRoof,
      availableGroundAreaSqft: totalGround,
      monthlySustainabilityBudget: activeSociety?.monthlySustainabilityBudget
        ? Number(activeSociety.monthlySustainabilityBudget)
        : 50000,
      recentEnergy: {
        consumption: energyLog.value,
        cost: energyLog.cost,
        unit: energyLog.unit,
      },
      recentWater: {
        consumption: waterLog.value,
        cost: waterLog.cost,
        unit: waterLog.unit,
      },
      recentWaste: {
        consumption: wasteLog.value,
        cost: wasteLog.cost,
        unit: wasteLog.unit,
      },
      solarArea,
      solarCapacityKWp: solarCapacity,
      rainwaterArea,
      compostArea,
      pendingRfpsCount,
      memberCount: members.length,
    };
  }, [
    activeSociety,
    totalRoof,
    totalGround,
    solarArea,
    solarCapacity,
    rainwaterArea,
    compostArea,
    pendingRfpsCount,
    members.length,
    utilityLogs,
  ]);

  // Generate Executive Society Audit via Gemini
  const handleRunAiAudit = async () => {
    try {
      setLoadingAiAudit(true);
      const ctx = buildSocietyAIContext();
      const res = await aiAdvisorApi.generateAudit(ctx, customGeminiKey || undefined);
      if (res.success) {
        setAiAuditReport(res.analysis);
        setAiSource(res.source);
        setIsLiveGemini(res.isLiveGemini);
        addToast(
          res.isLiveGemini
            ? "✨ Live AI Sustainability Audit generated!"
            : "✨ EcoSociety AI Sustainability Audit synthesized!",
          "success"
        );
      } else {
        throw new Error(res.error || "Failed to generate audit");
      }
    } catch (err: any) {
      console.error("AI Audit error:", err);
      addToast(err?.message || "Failed to generate AI Audit", "error");
    } finally {
      setLoadingAiAudit(false);
    }
  };

  // Interactive AI Assistant Chat
  const handleSendAiChat = async (queryText?: string) => {
    const q = (queryText || aiUserQuery).trim();
    if (!q) return;

    const userMsg = {
      role: "user" as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setAiChatMessages((prev) => [...prev, userMsg]);
    setAiUserQuery("");
    setLoadingAiChat(true);

    try {
      const ctx = buildSocietyAIContext();
      const res = await aiAdvisorApi.askQuestion(q, ctx, customGeminiKey || undefined);
      if (res.success) {
        const aiMsg = {
          role: "ai" as const,
          text: res.analysis,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setAiChatMessages((prev) => [...prev, aiMsg]);
        setIsLiveGemini(res.isLiveGemini);
      } else {
        throw new Error(res.error || "Failed to fetch response");
      }
    } catch (err: any) {
      const errorMsg = {
        role: "ai" as const,
        text: `⚠️ **Unable to complete analysis:** ${err?.message || "Something went wrong. Please check your AI engine connection."}`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setAiChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoadingAiChat(false);
    }
  };

  const handleCopyReport = () => {
    if (!aiAuditReport) return;
    navigator.clipboard.writeText(aiAuditReport);
    setCopiedReport(true);
    addToast("Sustainability Audit Report copied to clipboard!", "info");
    setTimeout(() => setCopiedReport(false), 3000);
  };

  const handleSaveGeminiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (customGeminiKey.trim()) {
      localStorage.setItem("ecosociety_gemini_key", customGeminiKey.trim());
      addToast("AI Engine Key saved for this browser session!", "success");
    } else {
      localStorage.removeItem("ecosociety_gemini_key");
      addToast("Custom key cleared; using default configuration.", "info");
    }
    setShowKeyModal(false);
  };

  if (!mounted) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#ffffff",
          fontFamily: "var(--font-outfit), sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            className="sidebar-logo-dot"
            style={{ width: "24px", height: "24px", margin: "0 auto 16px auto", animation: "pulse 2s infinite" }}
          />
          <p style={{ letterSpacing: "1px", opacity: 0.8 }}>Loading EcoSocietyAI Console...</p>
        </div>
      </div>
    );
  }

  const latestEnergy = getLatestLogForType("ENERGY");
  const latestWater = getLatestLogForType("WATER");
  const latestWaste = getLatestLogForType("WASTE");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-color)",
        backgroundImage: "var(--bg-gradient)",
        backgroundAttachment: "fixed",
        color: "var(--text-primary)",
        fontFamily: "var(--font-body), sans-serif",
        transition: "background-color 0.4s ease, color 0.4s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast ${
              t.type === "success" ? "toast-success" : t.type === "error" ? "toast-error" : "toast-info"
            }`}
            style={t.type === "error" ? { background: "rgba(239, 68, 68, 0.9)", color: "#fff" } : undefined}
          >
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <Navbar activeView="dashboard" />

      {/* Main Layout Container */}
      <main className="container" style={{ flex: 1, padding: "32px 16px" }}>
        <div
          className="dashboard-container glass-panel"
          style={{
            height: "auto",
            minHeight: "680px",
            borderRadius: "16px",
            boxShadow: "var(--shadow)",
          }}
        >
          {/* Sidebar */}
          <div className="dashboard-sidebar">
            <div className="sidebar-header">
              <div className="sidebar-logo">
                <span className="sidebar-logo-dot" />
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {activeSociety?.societyName || "GreenWood Heights"}
                </span>
              </div>
              <span className="sidebar-role">
                {user?.roleName ? user.roleName.replace("ROLE_", "") : "SOCIETY ADMIN"}
              </span>
            </div>

            <div className="sidebar-menu" style={{ flex: 1 }}>
              <button
                className={`sidebar-menu-btn ${activeTab === "utility" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("utility");
                  setSelectedUtility("ALL");
                }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Utility Analytics
              </button>

              <button
                className={`sidebar-menu-btn ${activeTab === "space" ? "active" : ""}`}
                onClick={() => setActiveTab("space")}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Space Allocation
              </button>

              <button
                className={`sidebar-menu-btn ${activeTab === "rfps" ? "active" : ""}`}
                onClick={() => setActiveTab("rfps")}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Vendor RFPs &amp; Bids
                {pendingRfpsCount > 0 && <span className="badge-count">{pendingRfpsCount}</span>}
              </button>

              {/* Society Members Tab */}
              <button
                className={`sidebar-menu-btn ${activeTab === "members" ? "active" : ""}`}
                onClick={() => setActiveTab("members")}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Society Members
                <span className="badge-count" style={{ background: "rgba(6, 182, 212, 0.2)", color: "var(--secondary)" }}>
                  {members.length}
                </span>
              </button>

              {/* Eco AI Advisor Tab (Gemini Powered) */}
              <button
                className={`sidebar-menu-btn ${activeTab === "ai" ? "active" : ""}`}
                onClick={() => setActiveTab("ai")}
                style={{
                  background: activeTab === "ai" ? "linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))" : undefined,
                  borderLeft: activeTab === "ai" ? "3px solid var(--primary)" : undefined,
                }}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                  />
                </svg>
                Eco AI Advisor
                <span
                  className="badge-count"
                  style={{
                    background: "linear-gradient(135deg, #10B981, #06B6D4)",
                    color: "#ffffff",
                    fontWeight: 800,
                    fontSize: "0.65rem",
                    padding: "2px 6px",
                  }}
                >
                  AI
                </span>
              </button>
            </div>

            {/* Profile footer */}
            <div
              className="sidebar-profile"
              style={{
                padding: "16px 20px",
                borderTop: "1px solid var(--card-border)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginTop: "auto",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  boxShadow: "0 0 10px rgba(16, 185, 129, 0.3)",
                }}
              >
                {user?.fullName
                  ? user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .substring(0, 2)
                      .toUpperCase()
                  : "AK"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {user?.fullName || "Atharva Kadam"}
                </span>
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    fontWeight: 600,
                    letterSpacing: "0.5px",
                  }}
                >
                  {user?.roleName ? user.roleName.replace("ROLE_", "") : "SOCIETY ADMIN"}
                </span>
              </div>
            </div>
          </div>

          {/* Main Panel Content */}
          <div className="dashboard-content">
            {/* TAB 1: UTILITY ANALYTICS */}
            {activeTab === "utility" && (
              <div className="tab-pane active">
                {selectedUtility === "ALL" ? (
                  <>
                    <div className="tab-header">
                      <div>
                        <h4>Utility Resource Audit Console</h4>
                        <p className="text-muted">
                          Audit residential resources for {activeSociety?.societyName || "your society"}, log new
                          invoices, and track carbon reduction targets.
                        </p>
                        {isSecretary ? (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              marginTop: "8px",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              background: "rgba(16, 185, 129, 0.1)",
                              border: "1px solid rgba(16, 185, 129, 0.25)",
                              color: "var(--primary)",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                            }}
                          >
                            <span>🛡️ Secretary Permissions Active</span>
                            <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                              — You can log new utility bills and manage resource audit entries.
                            </span>
                          </div>
                        ) : (
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "8px",
                              marginTop: "8px",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              background: "rgba(245, 158, 11, 0.1)",
                              border: "1px solid rgba(245, 158, 11, 0.25)",
                              color: "var(--accent-orange)",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                            }}
                          >
                            <span>🔒 Read-Only Utility Console</span>
                            <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                              — Only the Society Secretary has permission to record and modify utility invoices.
                            </span>
                          </div>
                        )}
                      </div>
                      {isSecretary && (
                        <button className="btn btn-primary btn-sm" onClick={() => setLogBillModalOpen(true)}>
                          + Log Utility Invoice
                        </button>
                      )}
                    </div>

                    <div className="utility-grid">
                      {/* Energy Card */}
                      <div
                        className="util-data-card glass-panel clickable"
                        style={{ background: "rgba(255,255,255,0.01)", cursor: "pointer" }}
                        onClick={() => setSelectedUtility("ENERGY")}
                      >
                        <div className="util-data-header">
                          <div className="util-title">
                            <span className="util-badge util-badge-energy">Energy</span>
                            <h5>Electricity Grid</h5>
                          </div>
                          <span className="util-cost">₹{latestEnergy.cost.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="util-metric">
                          <span className="metric-val">{latestEnergy.value.toLocaleString("en-IN")}</span>
                          <span className="metric-unit"> {latestEnergy.unit}</span>
                        </div>
                        <div className="util-progress-section">
                          <div className="progress-labels">
                            <span>Budget Consumption</span>
                            <span>{latestEnergy.cost > 0 ? Math.min(Math.round((latestEnergy.cost / 175000) * 100), 100) : 0}%</span>
                          </div>
                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar-fill progress-energy"
                              style={{ width: `${latestEnergy.cost > 0 ? Math.min((latestEnergy.cost / 175000) * 100, 100) : 0}%` }}
                            />
                          </div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--primary)", marginTop: "12px", fontWeight: 600 }}>
                          View Details &rarr;
                        </div>
                      </div>

                      {/* Water Card */}
                      <div
                        className="util-data-card glass-panel clickable"
                        style={{ background: "rgba(255,255,255,0.01)", cursor: "pointer" }}
                        onClick={() => setSelectedUtility("WATER")}
                      >
                        <div className="util-data-header">
                          <div className="util-title">
                            <span className="util-badge util-badge-water">Water</span>
                            <h5>Ground Water Supply</h5>
                          </div>
                          <span className="util-cost">₹{latestWater.cost.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="util-metric">
                          <span className="metric-val">{latestWater.value.toLocaleString("en-IN")}</span>
                          <span className="metric-unit"> {latestWater.unit}</span>
                        </div>
                        <div className="util-progress-section">
                          <div className="progress-labels">
                            <span>Conservation Limit</span>
                            <span>{latestWater.value > 0 ? Math.min(Math.round((latestWater.value / 600000) * 100), 100) : 0}%</span>
                          </div>
                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar-fill progress-water"
                              style={{ width: `${latestWater.value > 0 ? Math.min((latestWater.value / 600000) * 100, 100) : 0}%` }}
                            />
                          </div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--secondary)", marginTop: "12px", fontWeight: 600 }}>
                          View Details &rarr;
                        </div>
                      </div>

                      {/* Waste Card */}
                      <div
                        className="util-data-card glass-panel clickable"
                        style={{ background: "rgba(255,255,255,0.01)", cursor: "pointer" }}
                        onClick={() => setSelectedUtility("WASTE")}
                      >
                        <div className="util-data-header">
                          <div className="util-title">
                            <span className="util-badge util-badge-waste">Waste</span>
                            <h5>Solid Waste Disposal</h5>
                          </div>
                          <span className="util-cost">₹{latestWaste.cost.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="util-metric">
                          <span className="metric-val">{latestWaste.value.toLocaleString("en-IN")}</span>
                          <span className="metric-unit"> {latestWaste.unit}</span>
                        </div>
                        <div className="util-progress-section">
                          <div className="progress-labels">
                            <span>Recycling Rate</span>
                            <span>{latestWaste.value > 0 ? Math.min(Math.round((3000 / latestWaste.value) * 100), 100) : 0}%</span>
                          </div>
                          <div className="progress-bar-bg">
                            <div
                              className="progress-bar-fill progress-waste"
                              style={{ width: `${latestWaste.value > 0 ? Math.min((3000 / latestWaste.value) * 100, 100) : 0}%` }}
                            />
                          </div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--accent-orange)", marginTop: "12px", fontWeight: 600 }}>
                          View Details &rarr;
                        </div>
                      </div>
                    </div>

                    {/* Expenditure Chart */}
                    <div className="chart-panel glass-panel" style={{ background: "rgba(255,255,255,0.01)", marginTop: "24px" }}>
                      <div className="chart-header">
                        <h5>Monthly Combined Resource Expenditure (May - July)</h5>
                        <span className={`chart-badge ${reductionPercent > 0 ? "text-green" : "text-orange"}`}>
                          {reductionPercent > 0
                            ? `-${reductionPercent}% cost vs last month`
                            : `+${Math.abs(reductionPercent)}% cost vs last month`}
                        </span>
                      </div>
                      <div className="mock-chart" style={{ height: "180px", paddingBottom: "24px" }}>
                        <div className="chart-bars" style={{ height: "100%", paddingBottom: 0 }}>
                          <div className="bar-col">
                            <div
                              className="bar-fill"
                              style={{
                                height: `${mayHeight}%`,
                                width: "36px",
                                transition: "height 0.8s ease-out",
                                background: "linear-gradient(to top, rgba(16, 185, 129, 0.4), #10B981)",
                              }}
                            />
                            <span style={{ fontSize: "0.8rem", marginTop: "8px", position: "relative", transform: "none" }}>
                              May (₹{(mayTotal / 1000).toFixed(0)}k)
                            </span>
                          </div>
                          <div className="bar-col">
                            <div
                              className="bar-fill"
                              style={{
                                height: `${junHeight}%`,
                                width: "36px",
                                transition: "height 0.8s ease-out",
                                background: "linear-gradient(to top, rgba(6, 182, 212, 0.4), #06B6D4)",
                              }}
                            />
                            <span style={{ fontSize: "0.8rem", marginTop: "8px", position: "relative", transform: "none" }}>
                              June (₹{(junTotal / 1000).toFixed(0)}k)
                            </span>
                          </div>
                          <div className="bar-col">
                            <div
                              className="bar-fill"
                              style={{
                                height: `${julHeight}%`,
                                width: "36px",
                                transition: "height 0.8s ease-out",
                                background: "linear-gradient(to top, rgba(139, 92, 246, 0.4), #8B5CF6)",
                              }}
                            />
                            <span
                              style={{
                                fontSize: "0.8rem",
                                marginTop: "8px",
                                position: "relative",
                                transform: "none",
                                fontWeight: "bold",
                                color: "var(--text-primary)",
                              }}
                            >
                              July (₹{(julTotal / 1000).toFixed(0)}k)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Log Invoices Audit Trail */}
                    <div style={{ marginTop: "32px" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "12px",
                          marginBottom: "16px",
                        }}
                      >
                        <div>
                          <h5 style={{ fontSize: "1.05rem", fontWeight: 700, margin: 0 }}>
                            Logged Resource Invoices
                          </h5>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                            Connected to backend: <code style={{ color: "var(--primary)" }}>GET /api/utility-logs/society/{activeSociety?.societyId || 1}</code>
                          </span>
                        </div>

                        {/* Date Range Query Form */}
                        <form
                          onSubmit={handleApplyDateRange}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flexWrap: "wrap",
                          }}
                        >
                          <input
                            type="date"
                            value={filterStartDate}
                            onChange={(e) => setFilterStartDate(e.target.value)}
                            className="form-input"
                            style={{ padding: "6px 10px", fontSize: "0.8rem", width: "auto" }}
                            title="Start Date"
                          />
                          <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>to</span>
                          <input
                            type="date"
                            value={filterEndDate}
                            onChange={(e) => setFilterEndDate(e.target.value)}
                            className="form-input"
                            style={{ padding: "6px 10px", fontSize: "0.8rem", width: "auto" }}
                            title="End Date"
                          />
                          <button type="submit" className="btn btn-secondary btn-xs" style={{ padding: "7px 12px" }}>
                            Filter Range
                          </button>
                          {isFilteringRange && (
                            <button
                              type="button"
                              onClick={handleResetDateRange}
                              className="btn btn-outline btn-xs"
                              style={{ padding: "7px 10px", fontSize: "0.75rem" }}
                            >
                              Clear
                            </button>
                          )}
                        </form>
                      </div>

                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--text-muted)" }}>
                              <th style={{ padding: "12px 8px" }}>Period</th>
                              <th style={{ padding: "12px 8px" }}>Category</th>
                              <th style={{ padding: "12px 8px" }}>Consumption</th>
                              <th style={{ padding: "12px 8px" }}>Cost (INR)</th>
                              <th style={{ padding: "12px 8px" }}>Logged By</th>
                              {isSecretary && (
                                <th style={{ padding: "12px 8px", textAlign: "right" }}>Action</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {utilityLogs.length === 0 ? (
                              <tr>
                                <td colSpan={isSecretary ? 6 : 5} style={{ padding: "24px 8px", textAlign: "center", color: "var(--text-muted)" }}>
                                  {loadingLogs ? "Loading invoices from backend..." : "No invoices recorded for this period."}
                                </td>
                              </tr>
                            ) : (
                              utilityLogs.map((log) => (
                                <tr key={log.id} style={{ borderBottom: "1px dashed var(--card-border)" }}>
                                  <td style={{ padding: "12px 8px" }}>
                                    {log.periodStart} to {log.periodEnd}
                                  </td>
                                  <td style={{ padding: "12px 8px" }}>
                                    <span
                                      className="util-badge"
                                      style={{
                                        background:
                                          log.type === "ENERGY"
                                            ? "rgba(16, 185, 129, 0.15)"
                                            : log.type === "WATER"
                                            ? "rgba(6, 182, 212, 0.15)"
                                            : "rgba(245, 158, 11, 0.15)",
                                        color:
                                          log.type === "ENERGY"
                                            ? "var(--primary)"
                                            : log.type === "WATER"
                                            ? "var(--secondary)"
                                            : "var(--accent-orange)",
                                      }}
                                    >
                                      {log.type}
                                    </span>
                                  </td>
                                  <td style={{ padding: "12px 8px", fontWeight: 600 }}>
                                    {log.value.toLocaleString("en-IN")} {log.unit}
                                  </td>
                                  <td style={{ padding: "12px 8px", fontWeight: 700 }}>
                                    ₹{log.cost.toLocaleString("en-IN")}
                                  </td>
                                  <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>{log.loggedBy}</td>
                                  {isSecretary && (
                                    <td style={{ padding: "12px 8px", textAlign: "right" }}>
                                      <button
                                        onClick={() => handleDeleteLog(log.id)}
                                        title="Delete utility invoice (DELETE /api/utility-logs/{id})"
                                        style={{
                                          background: "transparent",
                                          border: "none",
                                          color: "#EF4444",
                                          cursor: "pointer",
                                          fontSize: "0.85rem",
                                          padding: "4px 8px",
                                          borderRadius: "4px",
                                          transition: "background 0.2s ease",
                                        }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)")}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                                      >
                                        Delete
                                      </button>
                                    </td>
                                  )}
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  /* Detail view for single utility */
                  (() => {
                    const type = selectedUtility;
                    const latest = getLatestLogForType(type);
                    const chartData = getSpecificChartPoints(type);

                    const title =
                      type === "ENERGY"
                        ? "Electricity Grid Details"
                        : type === "WATER"
                        ? "Ground Water Details"
                        : "Solid Waste Details";
                    const badgeClass =
                      type === "ENERGY" ? "util-badge-energy" : type === "WATER" ? "util-badge-water" : "util-badge-waste";
                    const strokeColor = type === "ENERGY" ? "#10B981" : type === "WATER" ? "#06B6D4" : "#F59E0B";

                    return (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                            onClick={() => setSelectedUtility("ALL")}
                          >
                            &larr; Back to Overview
                          </button>
                          {isSecretary && (
                            <button className="btn btn-primary btn-sm" onClick={() => setLogBillModalOpen(true)}>
                              + Log {type.toLowerCase()} bill
                            </button>
                          )}
                        </div>

                        <div style={{ marginBottom: "24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span className={`util-badge ${badgeClass}`} style={{ fontSize: "0.8rem", padding: "4px 10px" }}>
                              {type}
                            </span>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{title}</h3>
                          </div>
                          <p className="text-muted" style={{ marginTop: "4px", fontSize: "0.9rem" }}>
                            Detailed analysis of consumption spikes and historical logs for {type.toLowerCase()} resources.
                          </p>
                        </div>

                        <div className="utility-grid" style={{ marginBottom: "28px" }}>
                          <div className="util-data-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                            <span className="output-label" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                              Current Bill Amount
                            </span>
                            <div className="metric-val" style={{ fontSize: "2rem", marginTop: "8px", fontWeight: 800 }}>
                              ₹{latest.cost.toLocaleString("en-IN")}
                            </div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Billing cycle: Latest</span>
                          </div>

                          <div className="util-data-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                            <span className="output-label" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                              Quantity Consumed
                            </span>
                            <div className="metric-val" style={{ fontSize: "2rem", marginTop: "8px", fontWeight: 800 }}>
                              {latest.value.toLocaleString("en-IN")}
                              <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-muted)" }}>
                                {" "}
                                {latest.unit}
                              </span>
                            </div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Registered on-meter</span>
                          </div>

                          {type === "ENERGY" && (
                            <div className="util-data-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                              <span className="output-label" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                Solar Energy Share
                              </span>
                              <div className="metric-val text-green" style={{ fontSize: "2rem", marginTop: "8px", fontWeight: 800 }}>
                                {Math.round(((solarCleanGen * 30) / (latest.value || 1)) * 100)}%
                              </div>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Generated {solarCleanGen} kWh/day</span>
                            </div>
                          )}

                          {type === "WATER" && (
                            <div className="util-data-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                              <span className="output-label" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                Water Recharged
                              </span>
                              <div className="metric-val text-blue" style={{ fontSize: "2rem", marginTop: "8px", fontWeight: 800 }}>
                                {Math.round(rainwaterLitres / 12).toLocaleString("en-IN")}
                                <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-muted)" }}> L/mo</span>
                              </div>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                                Through {Math.round(rainwaterArea)} sqft pits
                              </span>
                            </div>
                          )}

                          {type === "WASTE" && (
                            <div className="util-data-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                              <span className="output-label" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                                Compost Generated
                              </span>
                              <div className="metric-val" style={{ fontSize: "2rem", marginTop: "8px", fontWeight: 800, color: "var(--accent-orange)" }}>
                                {compostCapacity.toLocaleString("en-IN")}
                                <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-muted)" }}> kg/mo</span>
                              </div>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Converted from wet-waste</span>
                            </div>
                          )}
                        </div>

                        {/* Interactive SVG Line Graph */}
                        <div className="chart-panel glass-panel" style={{ background: "rgba(255,255,255,0.01)", marginBottom: "32px" }}>
                          <div className="chart-header">
                            <h5>3-Month Quantity Consumption Curve</h5>
                            <span className={`chart-badge ${chartData.reductionRate > 0 ? "text-green" : "text-orange"}`}>
                              {chartData.reductionRate > 0
                                ? `-${chartData.reductionRate}% vs last month`
                                : `+${Math.abs(chartData.reductionRate)}% vs last month`}
                            </span>
                          </div>

                          <div style={{ position: "relative", width: "100%", height: "180px", marginTop: "16px" }}>
                            <svg width="100%" height="100%" viewBox="0 0 500 160" preserveAspectRatio="none" style={{ overflow: "visible" }}>
                              <defs>
                                <linearGradient id={`grad-${type}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
                                  <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                                </linearGradient>
                              </defs>

                              <line x1="50" y1="40" x2="450" y2="40" stroke="var(--card-border)" strokeDasharray="4 4" />
                              <line x1="50" y1="85" x2="450" y2="85" stroke="var(--card-border)" strokeDasharray="4 4" />
                              <line x1="50" y1="130" x2="450" y2="130" stroke="var(--card-border)" strokeDasharray="4 4" />

                              <path
                                d={`M ${chartData.points[0].x} 130 L ${chartData.points[0].x} ${chartData.points[0].y} L ${chartData.points[1].x} ${chartData.points[1].y} L ${chartData.points[2].x} ${chartData.points[2].y} L ${chartData.points[2].x} 130 Z`}
                                fill={`url(#grad-${type})`}
                              />
                              <path
                                d={`M ${chartData.points[0].x} ${chartData.points[0].y} L ${chartData.points[1].x} ${chartData.points[1].y} L ${chartData.points[2].x} ${chartData.points[2].y}`}
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              {chartData.points.map((pt, i) => (
                                <g key={i}>
                                  <circle cx={pt.x} cy={pt.y} r="6" fill="var(--bg-color)" stroke={strokeColor} strokeWidth="3" />
                                  <text x={pt.x} y={pt.y - 12} textAnchor="middle" fill="var(--text-primary)" fontSize="11" fontWeight="bold">
                                    {Math.round(pt.value).toLocaleString("en-IN")} {chartData.unit}
                                  </text>
                                  <text x={pt.x} y="150" textAnchor="middle" fill="var(--text-muted)" fontSize="12" fontWeight="600">
                                    {pt.label}
                                  </text>
                                </g>
                              ))}
                            </svg>
                          </div>
                        </div>

                        {/* Filtered Logs Table */}
                        <div>
                          <h5 style={{ marginBottom: "16px", fontSize: "1rem" }}>Invoices History ({type})</h5>
                          <div style={{ overflowX: "auto" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
                              <thead>
                                <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--text-muted)" }}>
                                  <th style={{ padding: "12px 8px" }}>Period</th>
                                  <th style={{ padding: "12px 8px" }}>Consumption Value</th>
                                  <th style={{ padding: "12px 8px" }}>Invoice Cost</th>
                                  <th style={{ padding: "12px 8px" }}>Logged By</th>
                                  <th style={{ padding: "12px 8px", textAlign: "right" }}>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {utilityLogs
                                  .filter((log) => log.type === type)
                                  .map((log) => (
                                    <tr key={log.id} style={{ borderBottom: "1px dashed var(--card-border)" }}>
                                      <td style={{ padding: "12px 8px" }}>
                                        {log.periodStart} to {log.periodEnd}
                                      </td>
                                      <td style={{ padding: "12px 8px", fontWeight: 600 }}>
                                        {log.value.toLocaleString("en-IN")} {log.unit}
                                      </td>
                                      <td style={{ padding: "12px 8px", fontWeight: 700 }}>
                                        ₹{log.cost.toLocaleString("en-IN")}
                                      </td>
                                      <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>{log.loggedBy}</td>
                                      <td style={{ padding: "12px 8px", textAlign: "right" }}>
                                        <button
                                          onClick={() => handleDeleteLog(log.id)}
                                          style={{
                                            background: "transparent",
                                            border: "none",
                                            color: "#EF4444",
                                            cursor: "pointer",
                                            fontSize: "0.85rem",
                                          }}
                                        >
                                          Delete
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
            )}

            {/* TAB 2: SPACE ALLOCATION */}
            {activeTab === "space" && (
              <div className="tab-pane active">
                <div className="tab-header">
                  <div>
                    <h4>Rooftop and Ground Space Asset Allocation</h4>
                    <p className="text-muted">
                      Optimizing total surface area of {activeSociety?.societyName || "Housing Society"}: {totalRoof.toLocaleString("en-IN")} sq.ft rooftop &amp; {totalGround.toLocaleString("en-IN")} sq.ft ground footprint.
                    </p>
                    {isSecretary ? (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "8px",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "rgba(16, 185, 129, 0.1)",
                          border: "1px solid rgba(16, 185, 129, 0.25)",
                          color: "var(--primary)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        <span>🛡️ Secretary Allocation Control</span>
                        <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                          — You have administrative permission to adjust solar, garden, and rainwater space allocations.
                        </span>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "8px",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "rgba(245, 158, 11, 0.1)",
                          border: "1px solid rgba(245, 158, 11, 0.25)",
                          color: "var(--accent-orange)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        <span>🔒 Read-Only Asset Allocation</span>
                        <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                          — Space sliders are locked. Only the Society Secretary has permission to reallocate rooftop and ground areas.
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-columns">
                  {/* Rooftop Panel */}
                  <div className="space-info-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                    <h5>Rooftop Allocation (Total: {totalRoof.toLocaleString("en-IN")} sq.ft.)</h5>
                    <div className="space-stats">
                      <div>
                        <span className="label">Solar Space</span>
                        <span className="value text-green">
                          {solarArea.toLocaleString("en-IN")} sq.ft. ({Math.round((solarArea / totalRoof) * 100)}%)
                        </span>
                      </div>
                      <div>
                        <span className="label">Rooftop Gardens</span>
                        <span className="value" style={{ color: "#8B5CF6" }}>
                          {gardensArea.toLocaleString("en-IN")} sq.ft. ({Math.round((gardensArea / totalRoof) * 100)}%)
                        </span>
                      </div>
                    </div>

                    <div className="space-chart-bar" style={{ height: "20px", display: "flex", borderRadius: "6px", overflow: "hidden", margin: "16px 0" }}>
                      <div
                        className="segment segment-solar"
                        style={{ width: `${(solarArea / totalRoof) * 100}%`, background: "var(--primary)", transition: "width 0.3s ease" }}
                      />
                      <div
                        className="segment segment-greenhouse"
                        style={{ width: `${(gardensArea / totalRoof) * 100}%`, background: "#8B5CF6", transition: "width 0.3s ease" }}
                      />
                      <div
                        className="segment segment-free"
                        style={{
                          width: `${Math.max(0, 100 - (solarArea / totalRoof) * 100 - (gardensArea / totalRoof) * 100)}%`,
                          background: "var(--card-border)",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                          Solar Area Slider: {solarArea.toLocaleString("en-IN")} sq.ft.
                        </label>
                        {!isSecretary && (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                            🔒 Locked (Secretary Only)
                          </span>
                        )}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={totalRoof}
                        step="100"
                        value={solarArea}
                        disabled={!isSecretary}
                        onChange={(e) => handleSolarChange(parseInt(e.target.value))}
                        style={{
                          width: "100%",
                          accentColor: "var(--primary)",
                          cursor: isSecretary ? "pointer" : "not-allowed",
                          opacity: isSecretary ? 1 : 0.6,
                        }}
                      />
                    </div>

                    <ul className="space-list" style={{ marginTop: "24px" }}>
                      <li>
                        <span>Clean Solar Capacity P_cap (Eq 3):</span>
                        <strong>{solarModelResult.pCapKWp} kWp (~{solarModelResult.panelCountEstimate} panels)</strong>
                      </li>
                      <li>
                        <span>Monthly Generation E_monthly (Eq 4):</span>
                        <strong className="text-green">{solarModelResult.eMonthlyKWh.toLocaleString("en-IN")} kWh/mo ({solarCleanGen} kWh/day)</strong>
                      </li>
                      <li>
                        <span>Monthly Bill Savings S_solar (Eq 5):</span>
                        <strong style={{ color: "var(--primary)" }}>₹{solarModelResult.sSolarMonthlyINR.toLocaleString("en-IN")}/mo ({solarModelResult.gridOffsetPercent}% offset)</strong>
                      </li>
                      <li>
                        <span>Annual Solar Power Yield:</span>
                        <strong>{solarModelResult.eAnnualKWh.toLocaleString("en-IN")} kWh/year</strong>
                      </li>
                      <li>
                        <span>Solar CO₂ Abatement (EF_grid = 0.82):</span>
                        <strong>{carbonModelResult.solarCO2AbatedTonnes} Tons CO₂/yr</strong>
                      </li>
                    </ul>
                  </div>

                  {/* Ground Surface Panel */}
                  <div className="space-info-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                    <h5>Ground Surface Allocation (Total: {totalGround.toLocaleString("en-IN")} sq.ft.)</h5>
                    <div className="space-stats">
                      <div>
                        <span className="label">Rainwater Recharge</span>
                        <span className="value text-blue">
                          {rainwaterArea.toLocaleString("en-IN")} sq.ft. ({Math.round((rainwaterArea / totalGround) * 100)}%)
                        </span>
                      </div>
                      <div>
                        <span className="label">Compost Pit</span>
                        <span className="value" style={{ color: "var(--accent-orange)" }}>
                          {compostArea.toLocaleString("en-IN")} sq.ft. ({Math.round((compostArea / totalGround) * 100)}%)
                        </span>
                      </div>
                    </div>

                    <div className="space-chart-bar" style={{ height: "20px", display: "flex", borderRadius: "6px", overflow: "hidden", margin: "16px 0" }}>
                      <div
                        className="segment segment-rainwater"
                        style={{ width: `${(rainwaterArea / totalGround) * 100}%`, background: "var(--secondary)", transition: "width 0.3s ease" }}
                      />
                      <div
                        className="segment segment-compost"
                        style={{ width: `${(compostArea / totalGround) * 100}%`, background: "var(--accent-orange)", transition: "width 0.3s ease" }}
                      />
                      <div
                        className="segment segment-free"
                        style={{
                          width: `${Math.max(0, 100 - (rainwaterArea / totalGround) * 100 - (compostArea / totalGround) * 100)}%`,
                          background: "var(--card-border)",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                          Rainwater Catchment Area: {rainwaterArea.toLocaleString("en-IN")} sq.ft.
                        </label>
                        {!isSecretary && (
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                            🔒 Locked (Secretary Only)
                          </span>
                        )}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={totalGround}
                        step="100"
                        value={rainwaterArea}
                        disabled={!isSecretary}
                        onChange={(e) => handleRainwaterChange(parseInt(e.target.value))}
                        style={{
                          width: "100%",
                          accentColor: "var(--secondary)",
                          cursor: isSecretary ? "pointer" : "not-allowed",
                          opacity: isSecretary ? 1 : 0.6,
                        }}
                      />
                    </div>

                    <ul className="space-list" style={{ marginTop: "24px" }}>
                      <li>
                        <span>Annual Harvestable Volume V_rain (Eq 6):</span>
                        <strong className="text-blue">{rainwaterModelResult.vRainAnnualLitres.toLocaleString("en-IN")} Litres/yr</strong>
                      </li>
                      <li>
                        <span>Average Daily Aquifer Recharge:</span>
                        <strong className="text-blue">{Math.round(rainwaterModelResult.vRainDailyAverageLitres).toLocaleString("en-IN")} Litres/day</strong>
                      </li>
                      <li>
                        <span>Surge Settlement Tank Recommendation:</span>
                        <strong>{rainwaterModelResult.tankCapacityRecommendedLitres.toLocaleString("en-IN")} Litres</strong>
                      </li>
                      <li>
                        <span>Water Pumping CO₂ Abated (EF_water = 0.0003):</span>
                        <strong>{carbonModelResult.waterCO2AbatedTonnes} Tons CO₂/yr</strong>
                      </li>
                      <li>
                        <span>Organic Compost Conversion:</span>
                        <strong>{compostCapacity.toLocaleString("en-IN")} kg/month</strong>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Mathematical Rigor & Analytical Yield Model Card */}
                <div
                  className="glass-panel"
                  style={{
                    marginTop: "28px",
                    padding: "24px",
                    borderRadius: "16px",
                    background: "rgba(16, 185, 129, 0.03)",
                    border: "1px solid rgba(16, 185, 129, 0.2)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "1.3rem" }}>📐</span>
                      <div>
                        <h5 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "var(--text-primary)" }}>
                          Mathematical Rigor: Analytical Formulations &amp; Yield Models
                        </h5>
                        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                          Real-time evaluation of Equations (3), (4), (5), (6), and (7) with dynamic parameters
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          background: "rgba(16, 185, 129, 0.15)",
                          color: "var(--primary)",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        Equations (3)-(7) Verified
                      </span>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          background: "rgba(59, 130, 246, 0.15)",
                          color: "var(--secondary)",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        Central &amp; Western India Climate
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                    {/* Eq 3, 4, 5 Card */}
                    <div
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid var(--card-border)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                        <span style={{ color: "var(--primary)", fontWeight: 800 }}>⚡</span>
                        <strong style={{ fontSize: "0.88rem", color: "var(--primary)" }}>
                          1. Solar PV Capacity &amp; Yield (Eq 3, 4, 5)
                        </strong>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        <p style={{ margin: "0 0 6px 0", fontFamily: "monospace", color: "var(--text-primary)" }}>
                          P_cap = min(A_roof / κ_pv, P_max)
                        </p>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                          κ_pv = 100 ft²/kWp, P_max = 500 kWp → <strong>P_cap = {solarModelResult.pCapKWp} kWp</strong>
                        </div>

                        <p style={{ margin: "0 0 6px 0", fontFamily: "monospace", color: "var(--text-primary)" }}>
                          E_monthly = P_cap × H_sun_bar × PR × 30
                        </p>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                          H_sun_bar = 4.5 kWh/m²/day, PR = 0.75 → <strong>E_monthly = {solarModelResult.eMonthlyKWh.toLocaleString("en-IN")} kWh/mo</strong>
                        </div>

                        <p style={{ margin: "0 0 6px 0", fontFamily: "monospace", color: "var(--text-primary)" }}>
                          S_solar = min(B_bill × λ_offset, E_monthly × C_tariff)
                        </p>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          λ_offset = 0.75, C_tariff ≈ ₹{derivedTariff.toFixed(2)}/kWh → <strong style={{ color: "var(--primary)" }}>S_solar = ₹{solarModelResult.sSolarMonthlyINR.toLocaleString("en-IN")}/mo</strong>
                        </div>
                      </div>
                    </div>

                    {/* Eq 6 Card */}
                    <div
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid var(--card-border)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                        <span style={{ color: "var(--secondary)", fontWeight: 800 }}>💧</span>
                        <strong style={{ fontSize: "0.88rem", color: "var(--secondary)" }}>
                          2. Rainwater Harvesting Potential (Eq 6)
                        </strong>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        <p style={{ margin: "0 0 6px 0", fontFamily: "monospace", color: "var(--text-primary)" }}>
                          V_rain = A_ground × C_runoff × R_annual × η_filter × 0.0929
                        </p>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                          A_ground = {rainwaterArea.toLocaleString("en-IN")} sq.ft, C_runoff = 0.80, R_annual = 900 mm, η_filter = 0.90
                        </div>
                        <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", background: "rgba(59, 130, 246, 0.08)" }}>
                          <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>Annual Hydro Yield:</span>
                          <strong style={{ fontSize: "1.1rem", color: "var(--secondary)" }}>
                            {rainwaterModelResult.vRainAnnualLitres.toLocaleString("en-IN")} Litres/year
                          </strong>
                          <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                            ≈ {Math.round(rainwaterModelResult.vRainDailyAverageLitres).toLocaleString("en-IN")} L/day continuous sub-surface injection
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Eq 7 Card */}
                    <div
                      style={{
                        padding: "16px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.02)",
                        border: "1px solid var(--card-border)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                        <span style={{ color: "#10B981", fontWeight: 800 }}>🌍</span>
                        <strong style={{ fontSize: "0.88rem", color: "#10B981" }}>
                          3. Carbon Footprint Abatement (Eq 7)
                        </strong>
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        <p style={{ margin: "0 0 6px 0", fontFamily: "monospace", color: "var(--text-primary)" }}>
                          ΔCO₂ = ((E_mo × 12 × EF_grid) + (V_rain × EF_water)) / 1000
                        </p>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "8px" }}>
                          EF_grid = 0.82 kg CO₂/kWh, EF_water = 0.0003 kg CO₂/L
                        </div>
                        <div style={{ marginTop: "12px", padding: "10px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.08)" }}>
                          <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)" }}>Total Net Abatement:</span>
                          <strong style={{ fontSize: "1.1rem", color: "#10B981" }}>
                            {carbonModelResult.deltaCO2AnnualTonnes} Metric Tonnes CO₂/year
                          </strong>
                          <span style={{ display: "block", fontSize: "0.72rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                            🌲 Equivalent to sequestering carbon of ~{carbonModelResult.equivalentTreesPlanted} mature trees
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: VENDOR SERVICE RFPS & LIVE SERVICES */}
            {activeTab === "rfps" && (
              <div className="tab-pane active">
                <div className="tab-header">
                  <div>
                    <h4>Request for Proposals &amp; Green Contractor Bids</h4>
                    <p className="text-muted">
                      Draft project specifications, solicit competitive quotes from verified contractors, and award tenders.
                    </p>
                    {isSecretary ? (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "8px",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "rgba(16, 185, 129, 0.1)",
                          border: "1px solid rgba(16, 185, 129, 0.25)",
                          color: "var(--primary)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        <span>🛡️ Society Secretary Active</span>
                        <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                          — You have authorization to draft RFPs and award society contracts to green vendors.
                        </span>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "8px",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "rgba(245, 158, 11, 0.1)",
                          border: "1px solid rgba(245, 158, 11, 0.25)",
                          color: "var(--accent-orange)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        <span>🔒 Read-Only Tender Directory</span>
                        <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                          — Floating project tenders and awarding vendor contracts are restricted to the Society Secretary.
                        </span>
                      </div>
                    )}
                  </div>
                  {isSecretary && (
                    <button className="btn btn-primary btn-sm" onClick={() => setCreateRfpModalOpen(true)}>
                      + Create New RFP
                    </button>
                  )}
                </div>

                {/* Theorem 1 & Multi-Criteria Cosine Rigor Banner */}
                <div
                  className="glass-panel"
                  style={{
                    padding: "16px 20px",
                    borderRadius: "14px",
                    background: "rgba(99, 102, 241, 0.05)",
                    border: "1px solid rgba(99, 102, 241, 0.25)",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "1.2rem" }}>⚖️</span>
                      <h5 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 700, color: "var(--text-primary)" }}>
                        Theorem 1: Pareto-Feasibility Guarantee &amp; Multi-Criteria Cosine Similarity (Eq 8)
                      </h5>
                    </div>
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: "12px",
                        background: "rgba(99, 102, 241, 0.2)",
                        color: "#818CF8",
                        letterSpacing: "0.5px",
                      }}
                    >
                      ALGORITHM 2 ACTIVE
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    Algorithm 2 enforces strict multi-resource constraint satisfaction before ranking: every candidate proposal must satisfy spatial limits{" "}
                    <code style={{ color: "var(--primary)" }}>a_spatial(v*) ≤ A_available</code>, stay within budget cap{" "}
                    <code style={{ color: "var(--primary)" }}>c(v*) ≤ B_cap</code>, and guarantee positive lifecycle savings{" "}
                    <code style={{ color: "var(--primary)" }}>ΔS(v*) &gt; 0</code> (Eq 12). Feasible proposals are ranked by the Cosine Similarity metric{" "}
                    <code style={{ color: "#A78BFA" }}>sim(s, v) = (s · v) / (||s||₂ ||v||₂)</code> across capacity fit, cost efficiency, reputation rating, and environmental quality.
                  </p>
                </div>

                <div className="rfp-list">
                  {rfps.map((rfp) => {
                    const winningBid = rfp.bids.find((b) => b.isAccepted);

                    return (
                      <div key={rfp.id} className="rfp-item glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                        <div className="rfp-main">
                          <div className="rfp-info">
                            <span
                              className="rfp-status"
                              style={{
                                background:
                                  rfp.status === "Project In Progress"
                                    ? "rgba(16, 185, 129, 0.15)"
                                    : rfp.status === "Request Pending"
                                    ? "rgba(239, 68, 68, 0.15)"
                                    : "rgba(245, 158, 11, 0.15)",
                                color:
                                  rfp.status === "Project In Progress"
                                    ? "var(--primary)"
                                    : rfp.status === "Request Pending"
                                    ? "#EF4444"
                                    : "var(--accent-orange)",
                              }}
                            >
                              {rfp.status}
                            </span>
                            <span style={{ marginLeft: "12px", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              Category: {rfp.category.toUpperCase()} • Budget: ₹{rfp.budget.toLocaleString("en-IN")}
                            </span>
                            <h5 style={{ margin: "12px 0 6px 0", fontSize: "1.1rem", fontWeight: 700 }}>{rfp.title}</h5>
                            <p className="text-muted" style={{ fontSize: "0.875rem" }}>
                              {rfp.description}
                            </p>
                          </div>
                        </div>

                        {/* Bids list */}
                        {rfp.bids.length > 0 && (
                          <div className="rfp-bids">
                            {winningBid ? (
                              <div
                                style={{
                                  padding: "8px 0",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "12px",
                                  color: "var(--primary)",
                                  fontWeight: 600,
                                  fontSize: "0.85rem",
                                }}
                              >
                                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Contract awarded to {winningBid.vendorName} for ₹{winningBid.price.toLocaleString("en-IN")}
                              </div>
                            ) : (
                              <>
                                <div
                                  style={{
                                    fontSize: "0.75rem",
                                    color: "var(--text-muted)",
                                    fontWeight: 700,
                                    textTransform: "uppercase",
                                    marginBottom: "10px",
                                    letterSpacing: "0.5px",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <span>Competitive Proposals Evaluated by Algorithm 2:</span>
                                  <span style={{ color: "#818CF8", fontSize: "0.72rem", textTransform: "none" }}>
                                    Sorted by Theorem 1 Feasibility &amp; Cosine Match
                                  </span>
                                </div>
                                {rfp.bids.map((bid, index) => {
                                  const analytics = computeBidAnalytics(rfp, bid);

                                  return (
                                    <div
                                      key={index}
                                      className="bid-row"
                                      style={{
                                        flexDirection: "column",
                                        alignItems: "stretch",
                                        gap: "8px",
                                        padding: "12px 14px",
                                        background: analytics.pareto.isFeasible
                                          ? "rgba(255, 255, 255, 0.02)"
                                          : "rgba(239, 68, 68, 0.03)",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                        border: analytics.pareto.isFeasible
                                          ? "1px solid var(--card-border)"
                                          : "1px dashed rgba(239, 68, 68, 0.3)",
                                      }}
                                    >
                                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{bid.vendorName}</span>
                                          <span className="bid-rating">⭐ {bid.rating} (Verified)</span>
                                          <span
                                            style={{
                                              padding: "3px 8px",
                                              borderRadius: "6px",
                                              background: "rgba(139, 92, 246, 0.15)",
                                              border: "1px solid rgba(139, 92, 246, 0.3)",
                                              color: "#A78BFA",
                                              fontSize: "0.74rem",
                                              fontWeight: 700,
                                            }}
                                            title="Evaluated via Equation (8) Multi-Criteria Cosine Similarity Metric"
                                          >
                                            🎯 {analytics.cosine.similarityPercent}% Cosine Match (Eq 8)
                                          </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                          <strong className="bid-price" style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--text-primary)" }}>
                                            ₹{bid.price.toLocaleString("en-IN")}
                                          </strong>
                                          {isSecretary ? (
                                            <button
                                              className="btn btn-primary btn-xs"
                                              onClick={() => handleAcceptBid(rfp.id, bid.vendorName)}
                                              disabled={!analytics.pareto.isFeasible}
                                              style={{
                                                opacity: analytics.pareto.isFeasible ? 1 : 0.45,
                                                cursor: analytics.pareto.isFeasible ? "pointer" : "not-allowed",
                                              }}
                                              title={
                                                analytics.pareto.isFeasible
                                                  ? "Approve and award contract"
                                                  : `Cannot approve: Violates Theorem 1 Pareto constraints (${analytics.pareto.violations.join(", ")})`
                                              }
                                            >
                                              Accept Bid
                                            </button>
                                          ) : (
                                            <span
                                              style={{
                                                fontSize: "0.75rem",
                                                color: "var(--text-muted)",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                background: "rgba(255, 255, 255, 0.04)",
                                              }}
                                            >
                                              Pending Decision
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {/* Theorem 1 Pareto-Feasibility Status Line */}
                                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.75rem" }}>
                                        {analytics.pareto.isFeasible ? (
                                          <span
                                            style={{
                                              display: "inline-flex",
                                              alignItems: "center",
                                              gap: "6px",
                                              color: "var(--primary)",
                                              background: "rgba(16, 185, 129, 0.08)",
                                              padding: "3px 8px",
                                              borderRadius: "4px",
                                              border: "1px solid rgba(16, 185, 129, 0.25)",
                                              fontWeight: 600,
                                            }}
                                          >
                                            <span>✅ Theorem 1 Pareto-Feasible</span>
                                            <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                                              [Spatial ≤ {rfp.category === "solar" ? totalRoof : totalGround} sq.ft, Cost ≤ ₹{rfp.budget.toLocaleString("en-IN")}, Financial Utility ΔS &gt; 0]
                                            </span>
                                          </span>
                                        ) : (
                                          <span
                                            style={{
                                              display: "inline-flex",
                                              alignItems: "center",
                                              gap: "6px",
                                              color: "#EF4444",
                                              background: "rgba(239, 68, 68, 0.08)",
                                              padding: "3px 8px",
                                              borderRadius: "4px",
                                              border: "1px solid rgba(239, 68, 68, 0.25)",
                                              fontWeight: 600,
                                            }}
                                          >
                                            <span>⚠️ Theorem 1 Feasibility Violation</span>
                                            <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                                              [{analytics.pareto.violations.join("; ")}]
                                            </span>
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Verified Green Services Catalog from Backend */}
                <div style={{ marginTop: "40px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <h5 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 4px 0" }}>
                      Direct Green Vendor Services Catalog
                    </h5>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Live backend endpoints: <code style={{ color: "var(--secondary)" }}>GET /api/vendor-services</code> &amp;{" "}
                      <code style={{ color: "var(--primary)" }}>GET /api/vendor-profiles/verified</code>
                    </span>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                    {vendorServices.map((service) => (
                      <div
                        key={service.serviceId}
                        style={{
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid var(--card-border)",
                          borderRadius: "12px",
                          padding: "16px",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                            <span
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                background: "rgba(16, 185, 129, 0.15)",
                                color: "var(--primary)",
                              }}
                            >
                              {service.category?.categoryName || "Clean Tech"}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              ✓ Verified Provider
                            </span>
                          </div>
                          <h6 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "6px 0 8px 0" }}>
                            {service.serviceTitle}
                          </h6>
                          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "12px" }}>
                            Offered by: <strong>{service.vendor?.companyName || "Green Contractor"}</strong>
                          </p>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderTop: "1px solid var(--card-border)",
                            paddingTop: "12px",
                          }}
                        >
                          <div>
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>Base Cost</span>
                            <strong style={{ fontSize: "0.95rem", color: "var(--primary)" }}>
                              ₹{service.basePrice ? Number(service.basePrice).toLocaleString("en-IN") : "Custom"}
                            </strong>
                          </div>
                          <button
                            className="btn btn-secondary btn-xs"
                            onClick={() => addToast(`Quotation inquiry sent to ${service.vendor?.companyName}!`)}
                          >
                            Inquire Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SOCIETY MEMBERS */}
            {activeTab === "members" && (
              <div className="tab-pane active">
                <div className="tab-header">
                  <div>
                    <h4>{activeSociety?.societyName || "Housing Society"} - Resident Directory</h4>
                    <p className="text-muted">
                      Manage enrolled society members, flat allotments, and resident sustainability access.
                    </p>

                    {/* Role & Security Permission Banner */}
                    {isSecretary ? (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "8px",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "rgba(16, 185, 129, 0.1)",
                          border: "1px solid rgba(16, 185, 129, 0.25)",
                          color: "var(--primary)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        <span>🛡️ Society Secretary Active</span>
                        <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                          — You have permission to enrol registered residents and manage member allocations.
                        </span>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          marginTop: "8px",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          background: "rgba(245, 158, 11, 0.1)",
                          border: "1px solid rgba(245, 158, 11, 0.25)",
                          color: "var(--accent-orange)",
                          fontSize: "0.78rem",
                          fontWeight: 600,
                        }}
                      >
                        <span>🔒 Read-Only Directory View</span>
                        <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                          — Only the Society Secretary ({activeSociety?.adminUser?.fullName || "Society Administrator"}) can add or remove members.
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Add Member Button - Only visible to Secretary */}
                  {isSecretary ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        loadUsers();
                        setAddMemberModalOpen(true);
                      }}
                    >
                      + Add New Member
                    </button>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleCopyRegisterLink}
                      title="Share registration portal with new residents"
                    >
                      {copiedInviteLink ? "✓ Link Copied!" : "📋 Copy Resident Register Link"}
                    </button>
                  )}
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--text-muted)" }}>
                        <th style={{ padding: "12px 8px" }}>Member Name</th>
                        <th style={{ padding: "12px 8px" }}>Email</th>
                        <th style={{ padding: "12px 8px" }}>Flat / Unit</th>
                        <th style={{ padding: "12px 8px" }}>Phone</th>
                        <th style={{ padding: "12px 8px" }}>Status</th>
                        {isSecretary && (
                          <th style={{ padding: "12px 8px", textAlign: "right" }}>Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((member) => (
                        <tr key={member.memberId} style={{ borderBottom: "1px dashed var(--card-border)" }}>
                          <td style={{ padding: "12px 8px", fontWeight: 600 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  borderRadius: "50%",
                                  background: "rgba(16, 185, 129, 0.2)",
                                  color: "var(--primary)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 700,
                                  fontSize: "0.75rem",
                                }}
                              >
                                {member.user?.fullName?.charAt(0) || "U"}
                              </div>
                              <span>{member.user?.fullName}</span>
                            </div>
                          </td>
                          <td style={{ padding: "12px 8px", color: "var(--text-secondary)" }}>
                            {member.user?.email}
                          </td>
                          <td style={{ padding: "12px 8px" }}>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "4px",
                                background: "rgba(6, 182, 212, 0.12)",
                                color: "var(--secondary)",
                                fontSize: "0.8rem",
                                fontWeight: 600,
                              }}
                            >
                              {member.flatNumber || "Unassigned"}
                            </span>
                          </td>
                          <td style={{ padding: "12px 8px", color: "var(--text-muted)" }}>
                            {member.user?.phoneNumber || "+91 98200 00000"}
                          </td>
                          <td style={{ padding: "12px 8px" }}>
                            <span
                              style={{
                                padding: "2px 8px",
                                borderRadius: "12px",
                                background: "rgba(16, 185, 129, 0.1)",
                                color: "var(--primary)",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              ✓ Enrolled Resident
                            </span>
                          </td>
                          {isSecretary && (
                            <td style={{ padding: "12px 8px", textAlign: "right" }}>
                              <button
                                onClick={() => handleRemoveMember(member.memberId, member.user?.fullName || "Member")}
                                title="Remove member from society directory (DELETE /api/society-members/{id})"
                                style={{
                                  background: "rgba(239, 68, 68, 0.1)",
                                  border: "1px solid rgba(239, 68, 68, 0.25)",
                                  color: "#EF4444",
                                  cursor: "pointer",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  padding: "4px 10px",
                                  borderRadius: "6px",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                Remove
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: ECO AI ADVISOR */}
            {activeTab === "ai" && (
              <div className="tab-pane active">
                {/* Header */}
                <div className="tab-header" style={{ alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <h4 style={{ margin: 0 }}>✨ Eco AI Society Advisor &amp; Auditor</h4>
                      <span
                        style={{
                          background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))",
                          border: "1px solid rgba(16, 185, 129, 0.4)",
                          color: "var(--primary)",
                          padding: "2px 10px",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: isLiveGemini ? "#10B981" : "#06B6D4",
                          }}
                        />
                        {isLiveGemini ? "EcoSociety Neural Core Live" : "Eco AI Engine Ready"}
                      </span>
                    </div>
                    <p className="text-muted" style={{ margin: "6px 0 0 0", fontSize: "0.9rem" }}>
                      Real-time generative sustainability intelligence, net-zero forecasting, and custom governance recommendations for{" "}
                      <strong>{activeSociety?.societyName || "your housing society"}</strong>.
                    </p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => setShowKeyModal(true)}
                      style={{ fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <span>🔑</span>
                      <span>{customGeminiKey ? "AI Engine Key Configured" : "Configure AI Engine Key"}</span>
                    </button>
                  </div>
                </div>

                {/* Society Context Real-time Feeding Bar */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "12px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    className="glass-panel"
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--card-border)",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>🏢 Society Scale</span>
                    <strong style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>
                      {activeSociety?.totalFlats || 120} Flats • {activeSociety?.totalResidents || 450} Residents
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginTop: "2px" }}>
                      {activeSociety?.city || "Pune"}, {totalRoof.toLocaleString("en-IN")} sq.ft Roof
                    </span>
                  </div>

                  <div
                    className="glass-panel"
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: "rgba(16, 185, 129, 0.05)",
                      border: "1px solid rgba(16, 185, 129, 0.2)",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>⚡ Energy &amp; Solar</span>
                    <strong style={{ fontSize: "0.95rem", color: "var(--primary)" }}>
                      {solarCapacity} kWp PV ({solarArea.toLocaleString("en-IN")} sq.ft)
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginTop: "2px" }}>
                      Monthly Bill: ₹{getLatestLogForType("ENERGY").cost.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div
                    className="glass-panel"
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: "rgba(6, 182, 212, 0.05)",
                      border: "1px solid rgba(6, 182, 212, 0.2)",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>💧 Water Recharge</span>
                    <strong style={{ fontSize: "0.95rem", color: "var(--secondary)" }}>
                      {rainwaterLitres.toLocaleString("en-IN")} Litres/yr
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginTop: "2px" }}>
                      Ground: {rainwaterArea.toLocaleString("en-IN")} sq.ft
                    </span>
                  </div>

                  <div
                    className="glass-panel"
                    style={{
                      padding: "12px 16px",
                      borderRadius: "10px",
                      background: "rgba(245, 158, 11, 0.05)",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", display: "block" }}>💰 Operating Budget</span>
                    <strong style={{ fontSize: "0.95rem", color: "var(--accent-orange)" }}>
                      ₹{activeSociety?.monthlySustainabilityBudget ? Number(activeSociety.monthlySustainabilityBudget).toLocaleString("en-IN") : "50,000"}/mo
                    </strong>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", display: "block", marginTop: "2px" }}>
                      {members.length} Enrolled Residents
                    </span>
                  </div>
                </div>

                {/* Sub-View Switcher */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    borderBottom: "1px solid var(--card-border)",
                    paddingBottom: "12px",
                    marginBottom: "20px",
                  }}
                >
                  <button
                    className={`btn ${aiSubView === "audit" ? "btn-primary" : "btn-secondary"} btn-sm`}
                    onClick={() => setAiSubView("audit")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <span>📊</span>
                    <span>Executive Sustainability Audit</span>
                  </button>
                  <button
                    className={`btn ${aiSubView === "chat" ? "btn-primary" : "btn-secondary"} btn-sm`}
                    onClick={() => setAiSubView("chat")}
                    style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <span>💬</span>
                    <span>Interactive AI Q&amp;A</span>
                  </button>
                </div>

                {/* SUB-VIEW 1: AUDIT REPORT */}
                {aiSubView === "audit" && (
                  <div>
                    {!aiAuditReport && !loadingAiAudit && (
                      <div
                        className="glass-panel"
                        style={{
                          textAlign: "center",
                          padding: "48px 24px",
                          borderRadius: "14px",
                          background: "rgba(255, 255, 255, 0.015)",
                          border: "1px dashed var(--card-border)",
                        }}
                      >
                        <div
                          style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.8rem",
                            margin: "0 auto 16px",
                            boxShadow: "0 0 20px rgba(16, 185, 129, 0.2)",
                          }}
                        >
                          ⚡
                        </div>
                        <h4 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "8px" }}>
                          Run Comprehensive AI Audit for {activeSociety?.societyName || "Housing Society"}
                        </h4>
                        <p
                          className="text-muted"
                          style={{ maxWidth: "600px", margin: "0 auto 24px", fontSize: "0.9rem", lineHeight: "1.6" }}
                        >
                          EcoSociety AI will analyze your rooftop surface area, actual monthly power invoices (₹{getLatestLogForType("ENERGY").cost.toLocaleString("en-IN")}), water usage, rainwater catchment, and budget allocation to generate an executive decarbonization roadmap.
                        </p>
                        <button
                          className="btn btn-primary"
                          onClick={handleRunAiAudit}
                          style={{
                            padding: "12px 28px",
                            fontSize: "0.95rem",
                            fontWeight: 700,
                            background: "linear-gradient(135deg, #10B981, #06B6D4)",
                            boxShadow: "0 0 20px rgba(16, 185, 129, 0.35)",
                          }}
                        >
                          ✨ Generate AI Sustainability Audit
                        </button>
                      </div>
                    )}

                    {loadingAiAudit && (
                      <div
                        className="glass-panel"
                        style={{
                          textAlign: "center",
                          padding: "60px 24px",
                          borderRadius: "14px",
                        }}
                      >
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            border: "3px solid rgba(16, 185, 129, 0.2)",
                            borderTop: "3px solid var(--primary)",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                            margin: "0 auto 20px",
                          }}
                        />
                        <h5 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "8px" }}>
                          Synthesizing Society Environmental Audit...
                        </h5>
                        <p className="text-muted" style={{ fontSize: "0.85rem" }}>
                          Connecting with EcoSociety AI Neural Engine to compute solar PV net metering ROI, borewell replenishment rates, and budget distribution.
                        </p>
                      </div>
                    )}

                    {aiAuditReport && !loadingAiAudit && (
                      <div>
                        {/* Audit Action Bar */}
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "rgba(255, 255, 255, 0.03)",
                            border: "1px solid var(--card-border)",
                            borderRadius: "10px",
                            padding: "12px 18px",
                            marginBottom: "20px",
                            flexWrap: "wrap",
                            gap: "10px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "1.1rem" }}>📋</span>
                            <div>
                              <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)" }}>
                                Executive Audit Report Generated
                              </strong>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>
                                Model Engine: {aiSource || "EcoSociety Neural Core v2.5"} • Scope: {activeSociety?.societyName}
                              </span>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "8px" }}>
                            <button
                              className="btn btn-secondary btn-xs"
                              onClick={handleCopyReport}
                              style={{ padding: "6px 12px" }}
                            >
                              {copiedReport ? "✓ Copied to Clipboard!" : "📋 Copy Report"}
                            </button>
                            <button
                              className="btn btn-outline btn-xs"
                              onClick={handleRunAiAudit}
                              style={{ padding: "6px 12px" }}
                            >
                              🔄 Regenerate
                            </button>
                          </div>
                        </div>

                        {/* Audit Content Panel */}
                        <div
                          className="glass-panel"
                          style={{
                            padding: "28px",
                            borderRadius: "14px",
                            background: "rgba(255, 255, 255, 0.015)",
                            border: "1px solid var(--card-border)",
                          }}
                        >
                          <FormattedAiOutput text={aiAuditReport} />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SUB-VIEW 2: CHAT & CUSTOM QUERIES */}
                {aiSubView === "chat" && (
                  <div>
                    {/* Suggested Prompt Chips */}
                    <div style={{ marginBottom: "16px" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                        Suggested Questions for {activeSociety?.societyName || "this society"}:
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {[
                          "⚡ Calculate Solar Yield (Eq 4) & Bill Offset (Eq 5) for our rooftop",
                          "💧 Rainwater Harvesting Yield (Eq 6) & aquifer buffer estimation",
                          "🌍 What is our Total Carbon Abatement (Eq 7) in Tonnes CO₂/yr?",
                          "🎯 Explain Theorem 1 Pareto-Feasibility & Cosine Match (Eq 8) for green vendors",
                          "📜 Draft a notice for residents on wet vs dry waste segregation",
                          "💰 How to claim PM Surya Ghar subsidy for our society in India?",
                        ].map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSendAiChat(prompt)}
                            disabled={loadingAiChat}
                            style={{
                              background: "rgba(255, 255, 255, 0.03)",
                              border: "1px solid var(--card-border)",
                              borderRadius: "20px",
                              padding: "6px 14px",
                              fontSize: "0.78rem",
                              color: "var(--text-secondary)",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              (e.target as HTMLElement).style.background = "rgba(16, 185, 129, 0.1)";
                              (e.target as HTMLElement).style.borderColor = "rgba(16, 185, 129, 0.4)";
                              (e.target as HTMLElement).style.color = "var(--primary)";
                            }}
                            onMouseLeave={(e) => {
                              (e.target as HTMLElement).style.background = "rgba(255, 255, 255, 0.03)";
                              (e.target as HTMLElement).style.borderColor = "var(--card-border)";
                              (e.target as HTMLElement).style.color = "var(--text-secondary)";
                            }}
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chat Messages Log */}
                    <div
                      style={{
                        minHeight: "360px",
                        maxHeight: "520px",
                        overflowY: "auto",
                        background: "rgba(10, 15, 26, 0.6)",
                        border: "1px solid var(--card-border)",
                        borderRadius: "14px",
                        padding: "20px",
                        marginBottom: "16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      }}
                    >
                      {aiChatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              marginBottom: "4px",
                              fontSize: "0.7rem",
                              color: "var(--text-muted)",
                            }}
                          >
                            <span>{msg.role === "user" ? user?.fullName || "You" : "🤖 EcoSociety AI Advisor"}</span>
                            <span>•</span>
                            <span>{msg.time}</span>
                          </div>

                          <div
                            style={{
                              maxWidth: "85%",
                              padding: "14px 18px",
                              borderRadius: msg.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                              background:
                                msg.role === "user"
                                  ? "linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(6, 182, 212, 0.25))"
                                  : "rgba(255, 255, 255, 0.03)",
                              border:
                                msg.role === "user"
                                  ? "1px solid rgba(16, 185, 129, 0.4)"
                                  : "1px solid var(--card-border)",
                            }}
                          >
                            <FormattedAiOutput text={msg.text} />
                          </div>
                        </div>
                      ))}

                      {loadingAiChat && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", color: "var(--primary)" }}>
                          <div
                            style={{
                              width: "18px",
                              height: "18px",
                              border: "2px solid rgba(16, 185, 129, 0.2)",
                              borderTop: "2px solid var(--primary)",
                              borderRadius: "50%",
                              animation: "spin 1s linear infinite",
                            }}
                          />
                          <span style={{ fontSize: "0.85rem", fontStyle: "italic" }}>
                            EcoSociety AI is analyzing society context and drafting recommendation...
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Chat Input Bar */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendAiChat();
                      }}
                      style={{ display: "flex", gap: "10px" }}
                    >
                      <input
                        type="text"
                        className="form-input"
                        placeholder={`Ask anything about ${activeSociety?.societyName || "your society"}, e.g. "Calculate solar subsidy for 40 kWp"...`}
                        value={aiUserQuery}
                        onChange={(e) => setAiUserQuery(e.target.value)}
                        disabled={loadingAiChat}
                        style={{ flex: 1, padding: "12px 16px", fontSize: "0.9rem" }}
                      />
                      <button
                        type="submit"
                        className="btn btn-primary btn-sm"
                        disabled={!aiUserQuery.trim() || loadingAiChat}
                        style={{
                          padding: "0 22px",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                          opacity: !aiUserQuery.trim() || loadingAiChat ? 0.6 : 1,
                        }}
                      >
                        Ask Eco AI ↗
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODAL 1: Log Bill Modal */}
      {logBillModalOpen && (
        <div className="modal-overlay" onClick={() => setLogBillModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>+ Log Utility Resource Invoice</h3>
              <button className="close-btn" onClick={() => setLogBillModalOpen(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleLogBillSubmit}>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label>Utility Category</label>
                <select
                  className="form-input"
                  style={{ color: "var(--text-primary)" }}
                  value={billType}
                  onChange={(e) => setBillType(e.target.value as any)}
                >
                  <option value="ENERGY">Electricity Grid (ENERGY - Type ID: 1)</option>
                  <option value="WATER">Ground Water Supply (WATER - Type ID: 2)</option>
                  <option value="WASTE">Solid Waste Disposal (WASTE - Type ID: 3)</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label>Total Invoice Cost (INR ₹)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 145000"
                  value={billCost}
                  onChange={(e) => setBillCost(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label>
                  Resource Value (in {billType === "ENERGY" ? "kWh" : billType === "WATER" ? "Litres" : "kg"})
                </label>
                <input
                  type="number"
                  className="form-input"
                  placeholder={billType === "ENERGY" ? "e.g. 12000" : billType === "WATER" ? "e.g. 380000" : "e.g. 4200"}
                  value={billValue}
                  onChange={(e) => setBillValue(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Period Start Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={billStart}
                    onChange={(e) => setBillStart(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Period End Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={billEnd}
                    onChange={(e) => setBillEnd(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setLogBillModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Invoice to Backend
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create RFP Modal */}
      {createRfpModalOpen && (
        <div className="modal-overlay" onClick={() => setCreateRfpModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>+ Dispatch Green Project RFP</h3>
              <button className="close-btn" onClick={() => setCreateRfpModalOpen(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleCreateRfpSubmit}>
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label>Project Title</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Install 30kWp Solar Addon"
                  value={rfpTitle}
                  onChange={(e) => setRfpTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Technology Category</label>
                  <select className="form-input" value={rfpCategory} onChange={(e) => setRfpCategory(e.target.value as any)}>
                    <option value="solar">Solar Panels</option>
                    <option value="water">Rainwater Harvesting</option>
                    <option value="waste">Organic Composting</option>
                    <option value="charging">EV Charging Stations</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Max Project Budget (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="e.g. 800000"
                    value={rfpBudget}
                    onChange={(e) => setRfpBudget(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: "24px" }}>
                <label>Project Scope / Specifications</label>
                <textarea
                  className="form-input"
                  style={{ minHeight: "100px", resize: "vertical" }}
                  placeholder="Describe rooftop/ground requirements, timelines, and preferred equipment..."
                  value={rfpDesc}
                  onChange={(e) => setRfpDesc(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setCreateRfpModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Publish RFP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add Member Modal (Secretary Only & Registered Users Only) */}
      {addMemberModalOpen && (
        <div className="modal-overlay" onClick={() => setAddMemberModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "540px" }}>
            <div className="modal-header">
              <div>
                <h3>+ Enrol Registered Resident</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "4px 0 0" }}>
                  {activeSociety?.societyName || "Housing Society"}
                </p>
              </div>
              <button className="close-btn" onClick={() => setAddMemberModalOpen(false)}>
                &times;
              </button>
            </div>

            {/* Governance Policy Notice */}
            <div
              style={{
                background: "rgba(6, 182, 212, 0.08)",
                border: "1px solid rgba(6, 182, 212, 0.25)",
                borderRadius: "10px",
                padding: "10px 14px",
                marginBottom: "16px",
                fontSize: "0.8rem",
                color: "var(--text-secondary)",
                lineHeight: "1.45",
              }}
            >
              <strong style={{ color: "var(--secondary)" }}>📋 Society Governance Rule:</strong> Residents must be registered on the EcoSocietyAI platform first before they can be added to the society directory. Unregistered persons must sign up at <code>/register</code>.
            </div>

            <form onSubmit={handleAddMember}>
              {/* Option A: Dropdown from Registered Users */}
              <div className="form-group" style={{ marginBottom: "14px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Select from Registered Users ({eligibleRegisteredUsers.length} available to enrol)
                </label>
                <select
                  className="form-input"
                  value={selectedExistingUserId}
                  onChange={(e) => {
                    setSelectedExistingUserId(e.target.value);
                    if (e.target.value) {
                      setMemberSearchQuery("");
                    }
                  }}
                  style={{ color: "var(--text-primary)" }}
                >
                  <option value="">-- Choose a registered user from database --</option>
                  {eligibleRegisteredUsers.map((u) => (
                    <option key={u.userId} value={u.userId} style={{ background: "#0F1624", color: "#F9FAFB" }}>
                      {u.fullName} ({u.email}) [ID: #{u.userId}]
                    </option>
                  ))}
                </select>
              </div>

              {/* Option B: Search by Email */}
              <div className="form-group" style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Or Search Registered User by Email
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. vikram.malhotra@ecosociety.ai"
                  value={memberSearchQuery}
                  onChange={(e) => {
                    setMemberSearchQuery(e.target.value);
                    if (e.target.value) {
                      setSelectedExistingUserId("");
                    }
                  }}
                />
              </div>

              {/* Live Verification Feedback Cards */}
              {targetUser && !isTargetAlreadyInSociety && (
                <div
                  style={{
                    background: "rgba(16, 185, 129, 0.08)",
                    border: "1px solid rgba(16, 185, 129, 0.3)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "1.1rem" }}>✅</span>
                    <strong style={{ color: "var(--primary)", fontSize: "0.85rem" }}>
                      Registered Resident Account Verified
                    </strong>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    <div><strong>Full Name:</strong> {targetUser.fullName}</div>
                    <div><strong>Email:</strong> {targetUser.email}</div>
                    <div><strong>Database User ID:</strong> #{targetUser.userId} (PostgreSQL <code>users</code> table)</div>
                    <div><strong>Role:</strong> {targetUser.role?.roleName || "ROLE_RESIDENT"}</div>
                  </div>
                </div>
              )}

              {isTargetAlreadyInSociety && (
                <div
                  style={{
                    background: "rgba(245, 158, 11, 0.08)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontSize: "1.1rem" }}>ℹ️</span>
                    <strong style={{ color: "var(--accent-orange)", fontSize: "0.85rem" }}>
                      Already Enrolled in this Society
                    </strong>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", margin: 0 }}>
                    {targetUser?.fullName} is already an active member of {activeSociety?.societyName}.
                  </p>
                </div>
              )}

              {/* Unregistered Resident Warning */}
              {!targetUser && memberSearchQuery.trim() !== "" && (
                <div
                  style={{
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    borderRadius: "10px",
                    padding: "14px",
                    marginBottom: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "1.1rem" }}>⚠️</span>
                    <strong style={{ color: "#EF4444", fontSize: "0.85rem" }}>
                      Resident Not Registered Yet
                    </strong>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "12px", lineHeight: "1.5" }}>
                    No user account was found with email <strong>"{memberSearchQuery}"</strong>. Under society rules, residents must register an account first before they can be added to the society directory.
                  </p>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-xs"
                      onClick={handleCopyRegisterLink}
                      style={{ fontSize: "0.75rem" }}
                    >
                      {copiedInviteLink ? "✓ Registration Link Copied!" : "📋 Copy Registration Link"}
                    </button>
                    <Link
                      href="/register"
                      target="_blank"
                      className="btn btn-outline btn-xs"
                      style={{ fontSize: "0.75rem", color: "var(--primary)", borderColor: "var(--primary)" }}
                    >
                      Open Registration Page ↗
                    </Link>
                  </div>
                </div>
              )}

              {/* Flat / Apartment Assignment */}
              <div className="form-group" style={{ marginBottom: "24px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Flat / Apartment Unit Number *
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Tower C - Flat 902"
                  value={newMemberFlat}
                  onChange={(e) => setNewMemberFlat(e.target.value)}
                  disabled={!targetUser || isTargetAlreadyInSociety}
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setAddMemberModalOpen(false);
                    setSelectedExistingUserId("");
                    setMemberSearchQuery("");
                    setNewMemberFlat("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={!targetUser || isTargetAlreadyInSociety || !newMemberFlat.trim() || submittingMember}
                  style={
                    !targetUser || isTargetAlreadyInSociety || !newMemberFlat.trim()
                      ? { opacity: 0.5, cursor: "not-allowed" }
                      : undefined
                  }
                >
                  {submittingMember
                    ? "Enrolling Member..."
                    : !targetUser && memberSearchQuery.trim() !== ""
                    ? "Cannot Enrol (Resident Must Register First)"
                    : !targetUser
                    ? "Select a Registered Resident"
                    : isTargetAlreadyInSociety
                    ? "Already Enrolled"
                    : "Enrol Member (POST /api/society-members)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: AI Engine Key Settings */}
      {showKeyModal && (
        <div className="modal-overlay" onClick={() => setShowKeyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px" }}>
            <div className="modal-header">
              <h3>🔑 EcoSociety AI Engine Configuration</h3>
              <button className="close-btn" onClick={() => setShowKeyModal(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveGeminiKey}>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: "1.5" }}>
                Connect an Enterprise AI Engine API key to enable live, real-time sustainability and microgrid intelligence.
              </p>

              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 600 }}>AI Engine Key</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Enter AI Engine Secret Key..."
                  value={customGeminiKey}
                  onChange={(e) => setCustomGeminiKey(e.target.value)}
                />
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
                  Key is securely stored in your local browser session.
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  type="button"
                  className="btn btn-outline btn-xs"
                  onClick={() => {
                    setCustomGeminiKey("");
                    localStorage.removeItem("ecosociety_gemini_key");
                    addToast("Cleared custom AI key.", "info");
                  }}
                  style={{ color: "#EF4444", borderColor: "rgba(239, 68, 68, 0.3)" }}
                >
                  Clear Key
                </button>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowKeyModal(false)}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Key
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer" style={{ marginTop: "auto" }}>
        <div className="container footer-bottom" style={{ borderTop: "none", paddingTop: 0 }}>
          <p>&copy; 2026 EcoSocietyAI. housing society sustainability admin dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
