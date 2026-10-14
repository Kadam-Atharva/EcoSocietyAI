"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useAuth, DEMO_PROFILES } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import {
  calculateSolarYield,
  calculateRainwaterHarvesting,
  calculateCarbonAbatement,
  SUSTAINABILITY_CONSTANTS,
  aiAdvisorApi,
} from "@/lib/api";

// --- Types & Interfaces for Vendor & Builder Dashboard ---

export interface BuilderProject {
  id: string;
  projectName: string;
  city: string;
  towers: number;
  totalFlats: number;
  plotAreaSqft: number;
  terraceAreaSqft: number;
  handoverYear: string;
  targetRating: "IGBC Gold" | "IGBC Platinum" | "GRIHA 4-Star" | "ECBC Compliant";
  status: "Planning" | "Under Construction" | "Procurement Open" | "Near Handover";
}

export interface BuilderTender {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  category: "solar" | "water" | "ev" | "waste" | "storage";
  capacityRequired: string;
  budgetCeilingINR: number;
  deadline: string;
  status: "Open" | "Evaluating Bids" | "Awarded";
  bidsCount: number;
  lowestBidINR?: number;
}

export interface VendorBidItem {
  id: string;
  tenderId: string;
  vendorName: string;
  quotedAmountINR: number;
  hardwareSpecs: string;
  warrantyYears: number;
  completionDays: number;
  rating: number;
  status: "Submitted" | "Shortlisted" | "Awarded" | "Rejected";
}

export interface VendorServiceListing {
  id: string;
  title: string;
  category: "solar" | "water" | "ev" | "waste" | "storage";
  badge: string;
  priceGuide: string;
  rating: number;
  completedInstallations: number;
  warranty: string;
  trustBadge: string;
  specs: string;
  description: string;
}

export interface VendorLead {
  id: string;
  clientName: string;
  propertyType: "Residential Society" | "Builder Development" | "Commercial TechPark";
  serviceTitle: string;
  scaleSummary: string;
  contactPhone: string;
  city: string;
  estimatedValueINR: number;
  status: "New" | "Site Survey" | "Quotation Sent" | "Contract Won";
  dateReceived: string;
}

export interface ToastNotification {
  id: number;
  message: string;
  type: "success" | "info" | "warning";
}

// Initial Data for Builders
const INITIAL_BUILDER_PROJECTS: BuilderProject[] = [
  {
    id: "proj-1",
    projectName: "Apex SkyLine Greens",
    city: "Pune",
    towers: 4,
    totalFlats: 240,
    plotAreaSqft: 45000,
    terraceAreaSqft: 18000,
    handoverYear: "2027",
    targetRating: "IGBC Gold",
    status: "Procurement Open",
  },
  {
    id: "proj-2",
    projectName: "EcoVistas Urban Towers",
    city: "Mumbai (Thane)",
    towers: 2,
    totalFlats: 160,
    plotAreaSqft: 32000,
    terraceAreaSqft: 12000,
    handoverYear: "2026",
    targetRating: "GRIHA 4-Star",
    status: "Planning",
  },
  {
    id: "proj-3",
    projectName: "Horizon Green TechPark",
    city: "Bengaluru",
    towers: 3,
    totalFlats: 320,
    plotAreaSqft: 75000,
    terraceAreaSqft: 30000,
    handoverYear: "2028",
    targetRating: "IGBC Platinum",
    status: "Under Construction",
  },
];

const INITIAL_BUILDER_TENDERS: BuilderTender[] = [
  {
    id: "tend-1",
    projectId: "proj-1",
    projectName: "Apex SkyLine Greens",
    title: "Centralized Rooftop Solar PV Microgrid (120 kWp)",
    category: "solar",
    capacityRequired: "120 kWp Bifacial Mono-PERC",
    budgetCeilingINR: 5200000,
    deadline: "2026-10-30",
    status: "Evaluating Bids",
    bidsCount: 3,
    lowestBidINR: 4850000,
  },
  {
    id: "tend-2",
    projectId: "proj-1",
    projectName: "Apex SkyLine Greens",
    title: "Dual-Chamber Rainwater Harvesting & Deep Borewell Hydro-Recharge",
    category: "water",
    capacityRequired: "4,50,000 Litres Annual Catchment",
    budgetCeilingINR: 850000,
    deadline: "2026-11-15",
    status: "Open",
    bidsCount: 1,
    lowestBidINR: 780000,
  },
  {
    id: "tend-3",
    projectId: "proj-2",
    projectName: "EcoVistas Urban Towers",
    title: "Residential EV Charging Station Hub (8x 7.4kW Type-2)",
    category: "ev",
    capacityRequired: "8 Charging Points with RFID / UPI Gateway",
    budgetCeilingINR: 450000,
    deadline: "2026-12-01",
    status: "Open",
    bidsCount: 2,
    lowestBidINR: 420000,
  },
];

const INITIAL_VENDOR_SERVICES: VendorServiceListing[] = [
  {
    id: "vs-1",
    title: "High-Efficiency Bifacial Mono-PERC Rooftop Solar PV",
    category: "solar",
    badge: "Solar Microgrid",
    priceGuide: "₹42,000 / kWp installed",
    rating: 4.9,
    completedInstallations: 42,
    warranty: "25-Year Linear Power Warranty",
    trustBadge: "MNRE Empaneled",
    specs: "Tier-1 Dual-Glass Bifacial + Grid-Tie Inverters with Cloud IoT",
    description: "Generates up to 25% additional power from ground albedo reflection. Full net-metering DISCOM liaison included.",
  },
  {
    id: "vs-2",
    title: "Dual-Filtration Rainwater Harvesting & Aquifer Hydro-Recharge",
    category: "water",
    badge: "Water Tech",
    priceGuide: "₹65 / sq.ft catchment area",
    rating: 4.8,
    completedInstallations: 65,
    warranty: "5-Year Desilting & AMC Guarantee",
    trustBadge: "CGWA Hydro-Certified",
    specs: "Multi-layer silica sand chambers + automatic desanding traps",
    description: "Replenishes depleted community borewells during monsoon. Cuts summer commercial tanker purchase by up to 45%.",
  },
  {
    id: "vs-3",
    title: "Society Fast EV Charging Infrastructure (Type-2 AC 7.4-22kW)",
    category: "ev",
    badge: "EV Hub",
    priceGuide: "₹48,000 / charging gun",
    rating: 4.9,
    completedInstallations: 34,
    warranty: "3-Year All-Inclusive AMC",
    trustBadge: "ARAI Approved",
    specs: "OCPP 1.6J Open Protocol + Automated UPI Resident Split Billing",
    description: "Dynamic load management prevents housing transformer trip. Fully compliant with state 20% EV parking mandate.",
  },
  {
    id: "vs-4",
    title: "Zero-Odor Aerobic Organic Waste Converter (OWC)",
    category: "waste",
    badge: "Solid Waste",
    priceGuide: "₹2,80,000 (100 kg/day unit)",
    rating: 4.7,
    completedInstallations: 51,
    warranty: "5-Year SS-304 Chamber Warranty",
    trustBadge: "CPCB Compliant",
    specs: "24-hour bacterial consortium conversion + moisture sensors",
    description: "Converts wet food & kitchen waste into nutrient-dense landscaping manure in 24 hours. Zero landfill municipal compliance.",
  },
  {
    id: "vs-5",
    title: "Modular Battery Energy Storage System (BESS - LFP)",
    category: "storage",
    badge: "Energy Storage",
    priceGuide: "₹18,000 / kWh capacity",
    rating: 4.8,
    completedInstallations: 12,
    warranty: "10-Year (6,000 Cycle Life)",
    trustBadge: "UL 9540A Fire-Safe",
    specs: "LiFePO4 Safe Chemistry + Cloud BMS + Seamless 10ms UPS Transfer",
    description: "Buffers peak daytime solar generation to power residential elevators, common corridor lighting, and water pumps at night.",
  },
];

const INITIAL_VENDOR_LEADS: VendorLead[] = [
  {
    id: "lead-1",
    clientName: "GreenMeadows Housing Society",
    propertyType: "Residential Society",
    serviceTitle: "Solar Panel Installation - 25kWp",
    scaleSummary: "140 flats, 8,500 sq.ft terrace area",
    contactPhone: "+91 98220 12345",
    city: "Pune",
    estimatedValueINR: 1050000,
    status: "Quotation Sent",
    dateReceived: "2026-09-24",
  },
  {
    id: "lead-2",
    clientName: "Apex SkyLine Greens (Builder Project)",
    propertyType: "Builder Development",
    serviceTitle: "Centralized Rooftop Solar PV Microgrid (120 kWp)",
    scaleSummary: "240 units, 4 towers, 18,000 sq.ft terrace",
    contactPhone: "+91 98811 76543",
    city: "Pune",
    estimatedValueINR: 4850000,
    status: "Site Survey",
    dateReceived: "2026-09-25",
  },
  {
    id: "lead-3",
    clientName: "Sunrise Eco Heights CHS",
    propertyType: "Residential Society",
    serviceTitle: "Borewell Recharge & Rainwater Harvester",
    scaleSummary: "85 flats, 4,000 sq.ft ground catchment",
    contactPhone: "+91 94220 98765",
    city: "Mumbai",
    estimatedValueINR: 180000,
    status: "New",
    dateReceived: "2026-09-26",
  },
];

export default function VendorBuilderDashboardPage() {
  const { user, isAuthenticated, loginAsDemo, loginAsPartner, logout } = useAuth();
  const { isDark } = useTheme();

  // Check partner authorization: must be authenticated as VENDOR, BUILDER, or ADMIN
  const isVendorOrBuilder =
    isAuthenticated &&
    (user?.roleName?.includes("VENDOR") ||
      user?.roleName?.includes("BUILDER") ||
      user?.roleName?.includes("ADMIN"));

  // Primary Workspace Mode: Builder Development Suite vs Vendor & EPC Hub vs Marketplace vs Financial Engine
  const [workspaceMode, setWorkspaceMode] = useState<"builder" | "vendor" | "marketplace" | "financial">("builder");

  // Automatically switch mode based on logged-in role if available
  useEffect(() => {
    if (user?.roleName?.includes("VENDOR")) {
      setWorkspaceMode("vendor");
    } else if (user?.roleName?.includes("BUILDER")) {
      setWorkspaceMode("builder");
    }
  }, [user]);

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const showToast = (message: string, type: "success" | "info" | "warning" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // --- Builder Workspace States ---
  const [projects, setProjects] = useState<BuilderProject[]>(INITIAL_BUILDER_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("proj-1");
  const [tenders, setTenders] = useState<BuilderTender[]>(INITIAL_BUILDER_TENDERS);

  // New Builder Project Modal State
  const [newProjectModalOpen, setNewProjectModalOpen] = useState(false);
  const [newProjName, setNewProjName] = useState("");
  const [newProjCity, setNewProjCity] = useState("Pune");
  const [newProjTowers, setNewProjTowers] = useState<number>(3);
  const [newProjFlats, setNewProjFlats] = useState<number>(180);
  const [newProjPlotArea, setNewProjPlotArea] = useState<number>(35000);
  const [newProjTerraceArea, setNewProjTerraceArea] = useState<number>(14000);
  const [newProjYear, setNewProjYear] = useState("2027");
  const [newProjRating, setNewProjRating] = useState<"IGBC Gold" | "IGBC Platinum" | "GRIHA 4-Star">("IGBC Gold");

  // New Tender Dispatch Modal State
  const [newTenderModalOpen, setNewTenderModalOpen] = useState(false);
  const [tenderTitle, setTenderTitle] = useState("");
  const [tenderCategory, setTenderCategory] = useState<"solar" | "water" | "ev" | "waste" | "storage">("solar");
  const [tenderCapacity, setTenderCapacity] = useState("");
  const [tenderBudget, setTenderBudget] = useState<number>(1500000);
  const [tenderDeadline, setTenderDeadline] = useState("2026-11-30");

  // --- Vendor Workspace States ---
  const [vendorServices, setVendorServices] = useState<VendorServiceListing[]>(INITIAL_VENDOR_SERVICES);
  const [vendorLeads, setVendorLeads] = useState<VendorLead[]>(INITIAL_VENDOR_LEADS);
  const [marketplaceFilter, setMarketplaceFilter] = useState<string>("all");
  const [marketplaceSearch, setMarketplaceSearch] = useState("");

  // New Service Modal
  const [newServiceModalOpen, setNewServiceModalOpen] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceCategory, setNewServiceCategory] = useState<"solar" | "water" | "ev" | "waste" | "storage">("solar");
  const [newServicePrice, setNewServicePrice] = useState("");
  const [newServiceSpecs, setNewServiceSpecs] = useState("");
  const [newServiceWarranty, setNewServiceWarranty] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");

  // Vendor Submit Bid Modal
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [selectedTenderForBid, setSelectedTenderForBid] = useState<BuilderTender | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [bidSpecs, setBidSpecs] = useState("");
  const [bidWarrantyYears, setBidWarrantyYears] = useState<number>(5);
  const [bidDays, setBidDays] = useState<number>(45);

  // Active Selected Project for Calculations
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectId) || projects[0];
  }, [projects, selectedProjectId]);

  // Real-Time Green Mandate Sizing Calculations for Builder's Project
  const mandateCalculations = useMemo(() => {
    if (!activeProject) return null;

    // 1. Rooftop Solar Mandate: Minimum 50% usable terrace or connected common load
    const recommendedSolarKWp = Math.round(Math.min((activeProject.terraceAreaSqft * 0.5) / 100, 500));
    const annualSolarGenKWh = Math.round(recommendedSolarKWp * 4.5 * 0.75 * 30 * 12);
    const annualSolarSavingsINR = Math.round(annualSolarGenKWh * 9.25);

    // 2. Rainwater Harvesting Mandate (CGWA & Municipal Norms)
    // Formula: V = Area * Runoff_Coeff * Rainfall * Filter_Eff * 0.0929
    const annualRainwaterL = Math.round(activeProject.plotAreaSqft * 0.25 * 0.8 * 900 * 0.9 * 0.0929);
    const rwhPitsRequired = Math.max(2, Math.round(activeProject.plotAreaSqft / 15000));

    // 3. EV Charging Mandate: 20% of parking bays EV-ready
    const evSlots = Math.round(activeProject.totalFlats * 0.2);

    // 4. Solid Waste Management Mandate: 100g wet waste per person per day (~4 persons/flat)
    const dailyWetWasteKg = Math.round(activeProject.totalFlats * 4 * 0.12); // ~115 kg/day for 240 flats
    const owcSizeModel = dailyWetWasteKg > 200 ? "OWC-300 (300kg/day)" : "OWC-150 (150kg/day)";

    // 5. Financial & Sales Advantage
    const monthlyMaintenanceDropPerFlat = Math.round((annualSolarSavingsINR / (activeProject.totalFlats * 12)));
    const totalCapexEstimate = recommendedSolarKWp * 42000 + (rwhPitsRequired * 140000) + (evSlots * 35000);
    const annualFinancialSaving = annualSolarSavingsINR + Math.round((annualRainwaterL * 0.08));
    const paybackYears = Math.round((totalCapexEstimate / annualFinancialSaving) * 10) / 10;
    const carbonAvertedTonnes = Math.round(((annualSolarGenKWh * 0.82) + (annualRainwaterL * 0.0003)) / 1000);

    // 6. Municipal Incentives (PMC/BMC/GHMC Green Building Norms)
    const propertyTaxRebate = "Up to 10% lifetime rebate on common property tax";
    const greenFsiBonus = "Additional 3% - 5% green FSI/FAR allowance";

    return {
      recommendedSolarKWp,
      annualSolarGenKWh,
      annualSolarSavingsINR,
      annualRainwaterL,
      rwhPitsRequired,
      evSlots,
      dailyWetWasteKg,
      owcSizeModel,
      monthlyMaintenanceDropPerFlat,
      totalCapexEstimate,
      annualFinancialSaving,
      paybackYears,
      carbonAvertedTonnes,
      propertyTaxRebate,
      greenFsiBonus,
    };
  }, [activeProject]);

  // Handler: Add Builder Project
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const newProj: BuilderProject = {
      id: "proj-" + (projects.length + 1),
      projectName: newProjName,
      city: newProjCity,
      towers: Number(newProjTowers),
      totalFlats: Number(newProjFlats),
      plotAreaSqft: Number(newProjPlotArea),
      terraceAreaSqft: Number(newProjTerraceArea),
      handoverYear: newProjYear,
      targetRating: newProjRating,
      status: "Procurement Open",
    };

    setProjects((prev) => [newProj, ...prev]);
    setSelectedProjectId(newProj.id);
    setNewProjectModalOpen(false);
    setNewProjName("");
    showToast(`Project "${newProj.projectName}" created successfully!`, "success");
  };

  // Handler: Dispatch Tender / RFQ
  const handleDispatchTender = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenderTitle.trim() || !activeProject) return;

    const newTender: BuilderTender = {
      id: "tend-" + (tenders.length + 1),
      projectId: activeProject.id,
      projectName: activeProject.projectName,
      title: tenderTitle,
      category: tenderCategory,
      capacityRequired: tenderCapacity || "Standard Commercial Grade",
      budgetCeilingINR: Number(tenderBudget),
      deadline: tenderDeadline,
      status: "Open",
      bidsCount: 0,
    };

    setTenders((prev) => [newTender, ...prev]);
    setNewTenderModalOpen(false);
    setTenderTitle("");
    setTenderCapacity("");
    showToast(`Tender "${newTender.title}" published to verified green vendors!`, "success");
  };

  // Handler: Add Vendor Service
  const handleAddVendorService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceTitle.trim()) return;

    const newService: VendorServiceListing = {
      id: "vs-" + (vendorServices.length + 1),
      title: newServiceTitle,
      category: newServiceCategory,
      badge: newServiceCategory.toUpperCase(),
      priceGuide: newServicePrice || "₹45,000 onwards",
      rating: 5.0,
      completedInstallations: 1,
      warranty: newServiceWarranty || "5-Year Standard Warranty",
      trustBadge: "Verified Partner",
      specs: newServiceSpecs || "High-Efficiency Commercial Equipment",
      description: newServiceDesc || "Turnkey procurement, civil installation, net-metering liaison, and warranty support.",
    };

    setVendorServices((prev) => [newService, ...prev]);
    setNewServiceModalOpen(false);
    setNewServiceTitle("");
    setNewServicePrice("");
    setNewServiceSpecs("");
    setNewServiceDesc("");
    showToast(`Service "${newService.title}" listed on the Clean Tech Marketplace!`, "success");
  };

  // Handler: Submit Bid for Tender
  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenderForBid) return;

    // Update tender bid count
    setTenders((prev) =>
      prev.map((t) =>
        t.id === selectedTenderForBid.id
          ? {
              ...t,
              bidsCount: t.bidsCount + 1,
              lowestBidINR: t.lowestBidINR ? Math.min(t.lowestBidINR, bidAmount) : bidAmount,
            }
          : t
      )
    );

    setBidModalOpen(false);
    showToast(`Technical & Commercial Bid of ₹${bidAmount.toLocaleString("en-IN")} submitted for ${selectedTenderForBid.title}!`, "success");
  };

  // Handler: Update Lead Status
  const handleUpdateLeadStatus = (leadId: string, nextStatus: VendorLead["status"]) => {
    setVendorLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: nextStatus } : l))
    );
    showToast(`Lead status updated to "${nextStatus}"!`, "info");
  };

  return (
    <>
      <Navbar activeView="portal" />

      {/* Floating Toast Alerts */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1100, display: "flex", flexDirection: "column", gap: "8px" }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: "12px 20px",
              borderRadius: "10px",
              background: t.type === "success" ? "#10B981" : t.type === "warning" ? "#F59E0B" : "#06B6D4",
              color: "#FFFFFF",
              fontSize: "0.88rem",
              fontWeight: 600,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.25)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>✓</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      <main className="dashboard-wrapper" style={{ padding: "28px 24px 80px 24px", minHeight: "100vh" }}>
        {!isVendorOrBuilder ? (
          <div style={{ maxWidth: "680px", margin: "40px auto 0 auto" }}>
            <div
              className="glass-panel"
              style={{
                padding: "40px 36px",
                borderRadius: "24px",
                background: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                boxShadow: "0 20px 45px rgba(0, 0, 0, 0.15)",
                textAlign: "center",
              }}
            >
              {/* Header Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 14px",
                  borderRadius: "20px",
                  background: "rgba(6, 182, 212, 0.15)",
                  border: "1px solid rgba(6, 182, 212, 0.35)",
                  color: "#06B6D4",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: "16px",
                }}
              >
                <span>🔒</span>
                <span>Restricted Partner Portal</span>
              </div>

              <h2 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 8px 0", color: "var(--text-primary)" }}>
                {isAuthenticated && user?.roleName?.includes("RESIDENT")
                  ? "Society Resident Account Detected"
                  : "Vendor & Builder Authentication Required"}
              </h2>

              <p
                style={{
                  fontSize: "0.92rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  maxWidth: "520px",
                  margin: "0 auto 28px auto",
                }}
              >
                {isAuthenticated && user?.roleName?.includes("RESIDENT")
                  ? `You are currently logged in as a housing society resident (${user?.fullName}). This console is strictly reserved for Clean Tech EPC Contractors and Real Estate Project Developers.`
                  : "This workspace contains commercial tender bidding desks, builder statutory green mandates, and B2B pricing catalogs. Please sign in with your verified Partner Account to access."}
              </p>

              {/* Instant 1-Click Partner Access Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px", textAlign: "left" }}>
                <button
                  type="button"
                  onClick={() => {
                    loginAsPartner({
                      role: "ROLE_BUILDER",
                      name: "Rajesh Singhania (VP Projects)",
                      email: "builder@apexrealty.in",
                      companyName: "Apex Infra & Realty Group",
                      businessIdentifier: "PRM/KA/RERA/1251",
                      partnerVertical: "Residential Townships",
                    });
                    showToast("Signed in as Apex Infra Developers (Builder)!", "success");
                  }}
                  className="glass-panel"
                  style={{
                    padding: "16px",
                    borderRadius: "14px",
                    border: "1px solid rgba(236, 72, 153, 0.3)",
                    background: "rgba(236, 72, 153, 0.05)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#EC4899";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(236, 72, 153, 0.3)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "1.4rem" }}>🏢</span>
                    <div>
                      <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)", display: "block" }}>Apex Infra Developers</strong>
                      <span style={{ fontSize: "0.72rem", color: "#EC4899", fontWeight: 700 }}>Real Estate Builder</span>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    RERA: PRM/KA/1251 • 2 Projects
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    loginAsPartner({
                      role: "ROLE_VENDOR",
                      name: "Arjun Deshmukh (Head EPC)",
                      email: "vendor@sunpower.com",
                      companyName: "SunPower CleanTech Pvt Ltd",
                      businessIdentifier: "27AABCS1429B1Z2",
                      partnerVertical: "Solar PV & Microgrids",
                    });
                    showToast("Signed in as SunPower CleanTech (Vendor)!", "success");
                  }}
                  className="glass-panel"
                  style={{
                    padding: "16px",
                    borderRadius: "14px",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    background: "rgba(245, 158, 11, 0.05)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#F59E0B";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.3)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "1.4rem" }}>⚡</span>
                    <div>
                      <strong style={{ fontSize: "0.9rem", color: "var(--text-primary)", display: "block" }}>SunPower CleanTech</strong>
                      <span style={{ fontSize: "0.72rem", color: "#F59E0B", fontWeight: 700 }}>Clean Tech EPC</span>
                    </div>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    MNRE Empaneled • 42+ Sites
                  </div>
                </button>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {isAuthenticated && user?.roleName?.includes("RESIDENT") ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="btn btn-primary"
                      style={{
                        padding: "12px 24px",
                        fontSize: "0.95rem",
                        fontWeight: 700,
                        borderRadius: "10px",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                      }}
                    >
                      <span>Go to Housing Society Dashboard</span>
                      <span>→</span>
                    </Link>

                    <Link
                      href="/portal/login"
                      className="btn btn-outline"
                      style={{
                        padding: "10px 20px",
                        fontSize: "0.85rem",
                        borderRadius: "10px",
                        textDecoration: "none",
                      }}
                    >
                      Switch to Vendor / Builder Partner Login →
                    </Link>

                    <Link
                      href="/"
                      className="btn btn-outline"
                      style={{
                        padding: "10px 20px",
                        fontSize: "0.85rem",
                        borderRadius: "10px",
                        textDecoration: "none",
                      }}
                    >
                      ← Return to Landing Page
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/portal/login"
                      className="btn btn-primary"
                      style={{
                        padding: "12px 24px",
                        fontSize: "0.92rem",
                        fontWeight: 700,
                        borderRadius: "10px",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      <span>Enter via Dedicated B2B Partner Login Form</span>
                      <span>→</span>
                    </Link>

                    <Link
                      href="/"
                      className="btn btn-outline"
                      style={{
                        padding: "10px 20px",
                        fontSize: "0.85rem",
                        borderRadius: "10px",
                        textDecoration: "none",
                      }}
                    >
                      ← Return to Landing Page
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

          {/* Quick Evaluator / Role Identification Bar */}
          <div
            className="glass-panel"
            style={{
              padding: "16px 24px",
              borderRadius: "14px",
              marginBottom: "24px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              border: "1px solid var(--card-border)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  background: workspaceMode === "builder" ? "rgba(236, 72, 153, 0.15)" : "rgba(245, 158, 11, 0.15)",
                  color: workspaceMode === "builder" ? "#EC4899" : "#F59E0B",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: "1.1rem",
                }}
              >
                {workspaceMode === "builder" ? "🏢" : "⚡"}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                    {workspaceMode === "builder" ? "Real Estate Builder & Project Developer Suite" : "Green Technology Vendor & EPC Contractor Hub"}
                  </h2>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontWeight: 800,
                      background: workspaceMode === "builder" ? "rgba(236, 72, 153, 0.15)" : "rgba(245, 158, 11, 0.15)",
                      color: workspaceMode === "builder" ? "#EC4899" : "#F59E0B",
                      border: `1px solid ${workspaceMode === "builder" ? "rgba(236, 72, 153, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                    }}
                  >
                    B2B DEDICATED
                  </span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                  {workspaceMode === "builder"
                    ? "Manage residential/commercial projects, calculate statutory green building mandates, and float tenders to verified contractors."
                    : "Manage published clean tech hardware, reply to project tenders, and convert inquiries from societies and builders."}
                </p>
              </div>
            </div>

            {/* Quick Mode Toggle & Demo Profile Switcher */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              {/* Partner Session Badge & Switch Link */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
                  border: "1px solid var(--card-border)",
                  fontSize: "0.78rem",
                }}
              >
                <span style={{ color: "var(--text-muted)", fontSize: "0.68rem", textTransform: "uppercase" }}>Partner:</span>
                <strong style={{ color: "var(--text-primary)" }}>
                  {user?.companyName || (user?.roleName?.includes("BUILDER") ? "Apex Infra Group" : "SunPower CleanTech")}
                </strong>
                <Link
                  href="/portal/login"
                  className="btn btn-outline btn-xs"
                  style={{ fontSize: "0.68rem", padding: "2px 6px" }}
                  title="Switch commercial partner account"
                >
                  Switch
                </Link>
              </div>

              <button
                onClick={() => setWorkspaceMode("builder")}
                className={`btn btn-sm ${workspaceMode === "builder" ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "0.82rem" }}
              >
                🏢 Builder View
              </button>
              <button
                onClick={() => setWorkspaceMode("vendor")}
                className={`btn btn-sm ${workspaceMode === "vendor" ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "0.82rem" }}
              >
                ⚡ Vendor View
              </button>
              <button
                onClick={() => setWorkspaceMode("marketplace")}
                className={`btn btn-sm ${workspaceMode === "marketplace" ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "0.82rem" }}
              >
                🛒 All Marketplace
              </button>
              <button
                onClick={() => setWorkspaceMode("financial")}
                className={`btn btn-sm ${workspaceMode === "financial" ? "btn-primary" : "btn-secondary"}`}
                style={{ fontSize: "0.82rem" }}
              >
                📊 ROI &amp; ESG Engine
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* WORKSPACE 1: REAL ESTATE BUILDER & PROJECT DEVELOPER SUITE */}
          {/* ========================================================================= */}
          {workspaceMode === "builder" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Project Selection & Header Actions */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text-secondary)" }}>
                    Active Builder Project:
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "8px",
                      border: "1px solid var(--card-border)",
                      background: "var(--card-bg)",
                      color: "var(--text-primary)",
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      cursor: "pointer",
                    }}
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.projectName} — {p.city} ({p.totalFlats} Units)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => setNewTenderModalOpen(true)}
                    className="btn btn-primary btn-sm"
                  >
                    + Float Tender / RFQ
                  </button>
                  <button
                    onClick={() => setNewProjectModalOpen(true)}
                    className="btn btn-secondary btn-sm"
                  >
                    + Add New Project
                  </button>
                </div>
              </div>

              {/* Project Snapshot Card */}
              {activeProject && mandateCalculations && (
                <div
                  className="glass-panel"
                  style={{
                    padding: "24px",
                    borderRadius: "16px",
                    border: "1px solid var(--card-border)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", marginBottom: "20px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                        <h3 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                          {activeProject.projectName}
                        </h3>
                        <span style={{ fontSize: "0.75rem", padding: "2px 10px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", fontWeight: 700 }}>
                          {activeProject.status}
                        </span>
                        <span style={{ fontSize: "0.75rem", padding: "2px 10px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", fontWeight: 700 }}>
                          Target: {activeProject.targetRating}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
                        {activeProject.city} • {activeProject.towers} Residential Towers • {activeProject.totalFlats} Flats • Handover: {activeProject.handoverYear}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: "16px", textAlign: "right" }}>
                      <div>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>Total Plot Area</span>
                        <strong style={{ fontSize: "1.1rem", color: "var(--text-primary)" }}>{activeProject.plotAreaSqft.toLocaleString("en-IN")} sq.ft</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", display: "block" }}>Rooftop Terrace Area</span>
                        <strong style={{ fontSize: "1.1rem", color: "#10B981" }}>{activeProject.terraceAreaSqft.toLocaleString("en-IN")} sq.ft</strong>
                      </div>
                    </div>
                  </div>

                  {/* Statutory Green Mandates Calculated Summary */}
                  <h4 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 14px 0", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "8px" }}>
                    <span>⚖️ Statutory Green Mandates Compliance &amp; Sizing Engine</span>
                    <span style={{ fontSize: "0.7rem", color: "#06B6D4", background: "rgba(6, 182, 212, 0.1)", padding: "1px 8px", borderRadius: "4px" }}>
                      AUTO-CALCULATED
                    </span>
                  </h4>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                    {/* Mandate 1: Solar */}
                    <div style={{ padding: "16px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.75rem", color: "#F59E0B", fontWeight: 700 }}>SOLAR MANDATE</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>50% Terrace Rule</span>
                      </div>
                      <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                        {mandateCalculations.recommendedSolarKWp} kWp
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                        Annual Generation: <strong>{mandateCalculations.annualSolarGenKWh.toLocaleString("en-IN")} kWh</strong>. Power common lifts &amp; pumps.
                      </div>
                    </div>

                    {/* Mandate 2: Rainwater Harvesting */}
                    <div style={{ padding: "16px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.75rem", color: "#06B6D4", fontWeight: 700 }}>RWH RECHARGE PIT</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>CGWA Hydro Norm</span>
                      </div>
                      <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                        {mandateCalculations.annualRainwaterL.toLocaleString("en-IN")} L
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                        Requires <strong>{mandateCalculations.rwhPitsRequired} multi-chamber recharge shafts</strong> to prevent summer tanker dependence.
                      </div>
                    </div>

                    {/* Mandate 3: EV Infrastructure */}
                    <div style={{ padding: "16px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.75rem", color: "#10B981", fontWeight: 700 }}>EV PARKING MANDATE</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>20% Parking Bays</span>
                      </div>
                      <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                        {mandateCalculations.evSlots} EV Bays
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                        Type-2 AC chargers with automated resident UPI billing &amp; smart load shedding.
                      </div>
                    </div>

                    {/* Mandate 4: Solid Waste Management */}
                    <div style={{ padding: "16px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.75rem", color: "#8B5CF6", fontWeight: 700 }}>IN-SITU WASTE CONVERTER</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>SWM 2016 Rules</span>
                      </div>
                      <div style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                        {mandateCalculations.owcSizeModel}
                      </div>
                      <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                        Processes <strong>{mandateCalculations.dailyWetWasteKg} kg/day</strong> kitchen waste to compost in 24 hours.
                      </div>
                    </div>
                  </div>

                  {/* Commercial Feasibility & Buyer USP for Developer */}
                  <div
                    style={{
                      padding: "16px 20px",
                      borderRadius: "12px",
                      background: "rgba(16, 185, 129, 0.08)",
                      border: "1px solid rgba(16, 185, 129, 0.25)",
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10B981", marginBottom: "2px" }}>
                        🔥 Builder Sales Value Proposition (Higher Flat Sales Velocity):
                      </div>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>
                        Lowers buyer maintenance fees by <strong>₹{mandateCalculations.monthlyMaintenanceDropPerFlat} / flat / month</strong> for life.
                        Enables <strong>{mandateCalculations.propertyTaxRebate}</strong> and <strong>{mandateCalculations.greenFsiBonus}</strong>.
                      </p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Annual Utility Savings</span>
                        <strong style={{ fontSize: "1.1rem", color: "#10B981" }}>₹{mandateCalculations.annualFinancialSaving.toLocaleString("en-IN")}/yr</strong>
                      </div>
                      <button
                        onClick={() => setNewTenderModalOpen(true)}
                        className="btn btn-primary btn-sm"
                      >
                        Float Green RFQ Now →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Builder Project Tenders List */}
              <div
                className="glass-panel"
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid var(--card-border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <h4 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                      Project Tenders &amp; Competitive Vendor Bids
                    </h4>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                      Review incoming quotations submitted by verified green vendors for {activeProject?.projectName}.
                    </p>
                  </div>
                  <button onClick={() => setNewTenderModalOpen(true)} className="btn btn-primary btn-sm">
                    + Float New Tender
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {tenders
                    .filter((t) => t.projectId === selectedProjectId || tenders.length <= 3)
                    .map((t) => (
                      <div
                        key={t.id}
                        style={{
                          padding: "16px 20px",
                          borderRadius: "12px",
                          background: "var(--card-bg)",
                          border: "1px solid var(--card-border)",
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "16px",
                        }}
                      >
                        <div style={{ maxWidth: "580px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <span
                              style={{
                                fontSize: "0.7rem",
                                padding: "2px 8px",
                                borderRadius: "4px",
                                fontWeight: 800,
                                textTransform: "uppercase",
                                background: t.category === "solar" ? "rgba(245, 158, 11, 0.15)" : t.category === "water" ? "rgba(6, 182, 212, 0.15)" : "rgba(16, 185, 129, 0.15)",
                                color: t.category === "solar" ? "#F59E0B" : t.category === "water" ? "#06B6D4" : "#10B981",
                              }}
                            >
                              {t.category}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              Deadline: {t.deadline}
                            </span>
                            <span style={{ fontSize: "0.75rem", padding: "1px 6px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", fontWeight: 700 }}>
                              {t.status}
                            </span>
                          </div>
                          <h5 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                            {t.title}
                          </h5>
                          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                            Requirement: <strong>{t.capacityRequired}</strong> • Project: {t.projectName}
                          </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                          <div>
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Budget Ceiling</span>
                            <strong style={{ fontSize: "1rem", color: "var(--text-primary)" }}>₹{t.budgetCeilingINR.toLocaleString("en-IN")}</strong>
                          </div>
                          <div>
                            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Bids Received</span>
                            <strong style={{ fontSize: "1rem", color: "#10B981" }}>
                              {t.bidsCount} Bids {t.lowestBidINR ? `(Lowest ₹${t.lowestBidINR.toLocaleString("en-IN")})` : ""}
                            </strong>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedTenderForBid(t);
                              setBidAmount(t.lowestBidINR ? t.lowestBidINR - 50000 : t.budgetCeilingINR - 100000);
                              setBidModalOpen(true);
                            }}
                            className="btn btn-secondary btn-sm"
                          >
                            Submit Vendor Bid
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* WORKSPACE 2: GREEN TECHNOLOGY VENDOR & EPC CONTRACTOR HUB */}
          {/* ========================================================================= */}
          {workspaceMode === "vendor" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

              {/* Vendor Stats Bar */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div className="glass-panel" style={{ padding: "20px", borderRadius: "14px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Active Pipeline Value</span>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#10B981", margin: "4px 0" }}>
                    ₹74.5 Lakhs
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Across 8 open proposals</span>
                </div>

                <div className="glass-panel" style={{ padding: "20px", borderRadius: "14px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Completed Deployments</span>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--text-primary)", margin: "4px 0" }}>
                    42 Sites
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "#10B981", fontWeight: 700 }}>100% Commissioned on Time</span>
                </div>

                <div className="glass-panel" style={{ padding: "20px", borderRadius: "14px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Average Client Rating</span>
                  <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#F59E0B", margin: "4px 0" }}>
                    ⭐ 4.9 / 5.0
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Based on 38 verified reviews</span>
                </div>

                <div className="glass-panel" style={{ padding: "20px", borderRadius: "14px" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Verification Status</span>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981", margin: "8px 0" }}>
                    ✓ MNRE &amp; CGWA Verified
                  </div>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>GSTIN &amp; ISO 9001 Active</span>
                </div>
              </div>

              {/* Vendor Section 1: Inquiries & CRM Pipeline */}
              <div
                className="glass-panel"
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid var(--card-border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h4 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                      Incoming Leads &amp; Quotation Requests Pipeline
                    </h4>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                      Direct RFQs and quote requests from residential housing societies and builder developers.
                    </p>
                  </div>
                  <span style={{ fontSize: "0.78rem", padding: "4px 10px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", fontWeight: 700 }}>
                    {vendorLeads.length} Active Leads
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {vendorLeads.map((lead) => (
                    <div
                      key={lead.id}
                      style={{
                        padding: "16px 20px",
                        borderRadius: "12px",
                        background: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
                      }}
                    >
                      <div style={{ maxWidth: "560px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "4px", background: "rgba(6, 182, 212, 0.15)", color: "#06B6D4", fontWeight: 700 }}>
                            {lead.propertyType}
                          </span>
                          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                            Received: {lead.dateReceived} • {lead.city}
                          </span>
                          <span
                            style={{
                              fontSize: "0.72rem",
                              padding: "2px 8px",
                              borderRadius: "10px",
                              fontWeight: 700,
                              background:
                                lead.status === "Contract Won"
                                  ? "rgba(16, 185, 129, 0.2)"
                                  : lead.status === "Quotation Sent"
                                  ? "rgba(59, 130, 246, 0.2)"
                                  : "rgba(245, 158, 11, 0.2)",
                              color:
                                lead.status === "Contract Won"
                                  ? "#10B981"
                                  : lead.status === "Quotation Sent"
                                  ? "#3B82F6"
                                  : "#F59E0B",
                            }}
                          >
                            {lead.status}
                          </span>
                        </div>
                        <h5 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                          {lead.clientName}
                        </h5>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                          Service: <strong>{lead.serviceTitle}</strong> ({lead.scaleSummary}) • Phone: {lead.contactPhone}
                        </p>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                        <div>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Est. Project Value</span>
                          <strong style={{ fontSize: "1.1rem", color: "#10B981" }}>₹{lead.estimatedValueINR.toLocaleString("en-IN")}</strong>
                        </div>

                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as VendorLead["status"])}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          <option value="New">Status: New</option>
                          <option value="Site Survey">Status: Site Survey</option>
                          <option value="Quotation Sent">Status: Quotation Sent</option>
                          <option value="Contract Won">Status: Contract Won</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vendor Section 2: Catalog Management */}
              <div
                className="glass-panel"
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid var(--card-border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <h4 style={{ fontSize: "1.15rem", fontWeight: 800, margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                      My Published Clean Tech Products &amp; Services
                    </h4>
                    <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: 0 }}>
                      Listed across the EcoSocietyAI marketplace and accessible to 140+ registered housing societies and builders.
                    </p>
                  </div>
                  <button onClick={() => setNewServiceModalOpen(true)} className="btn btn-primary btn-sm">
                    + Add New Service Listing
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
                  {vendorServices.map((s) => (
                    <div
                      key={s.id}
                      style={{
                        padding: "18px",
                        borderRadius: "12px",
                        background: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "12px",
                      }}
                    >
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "12px", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", fontWeight: 700 }}>
                            {s.badge}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "#F59E0B", fontWeight: 700 }}>
                            ⭐ {s.rating} ({s.completedInstallations} projects)
                          </span>
                        </div>
                        <h5 style={{ fontSize: "1.02rem", fontWeight: 700, margin: "0 0 6px 0", color: "var(--text-primary)" }}>
                          {s.title}
                        </h5>
                        <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "0 0 8px 0", lineHeight: 1.4 }}>
                          {s.description}
                        </p>
                        <div style={{ fontSize: "0.76rem", color: "var(--primary)", fontWeight: 600 }}>
                          Specs: {s.specs}
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: "1px solid var(--card-border)" }}>
                        <div>
                          <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block" }}>Price Guide</span>
                          <strong style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>{s.priceGuide}</strong>
                        </div>
                        <span style={{ fontSize: "0.72rem", padding: "2px 8px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.12)", color: "#10B981", fontWeight: 700 }}>
                          {s.trustBadge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* WORKSPACE 3: ALL MARKETPLACE & CLEAN TECH DIRECTORY */}
          {/* ========================================================================= */}
          {workspaceMode === "marketplace" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div
                className="glass-panel"
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid var(--card-border)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                  <div>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 4px 0", color: "var(--text-primary)" }}>
                      Clean Tech B2B Marketplace Directory
                    </h3>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: 0 }}>
                      Browse verified equipment and turnkey installation services for residential communities and real estate infrastructure.
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
                      <Link
                        href="/marketplace"
                        className="btn btn-outline btn-sm"
                        style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "0.8rem", padding: "4px 12px" }}
                      >
                        <span>Open In-Depth Technical Directory</span>
                        <span>↗</span>
                      </Link>
                    </div>
                  </div>

                  {/* Filter Pills */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {["all", "solar", "water", "ev", "waste", "storage"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setMarketplaceFilter(cat)}
                        className={`filter-btn ${marketplaceFilter === cat ? "active" : ""}`}
                        style={{ padding: "6px 14px", fontSize: "0.8rem", borderRadius: "20px" }}
                      >
                        {cat === "all" ? "All Solutions" : cat.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search Bar */}
                <input
                  type="text"
                  placeholder="Search solutions, vendors, specifications..."
                  value={marketplaceSearch}
                  onChange={(e) => setMarketplaceSearch(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 18px",
                    borderRadius: "10px",
                    border: "1px solid var(--card-border)",
                    marginBottom: "20px",
                    fontSize: "0.9rem",
                  }}
                />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
                  {vendorServices
                    .filter((s) => {
                      const matchesCat = marketplaceFilter === "all" || s.category === marketplaceFilter;
                      const matchesSearch =
                        marketplaceSearch.trim() === "" ||
                        s.title.toLowerCase().includes(marketplaceSearch.toLowerCase()) ||
                        s.specs.toLowerCase().includes(marketplaceSearch.toLowerCase()) ||
                        s.description.toLowerCase().includes(marketplaceSearch.toLowerCase());
                      return matchesCat && matchesSearch;
                    })
                    .map((s) => (
                      <div
                        key={s.id}
                        className="market-card"
                        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
                      >
                        <div>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                            <span className="market-badge">{s.badge}</span>
                            <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "8px", background: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", fontWeight: 700 }}>
                              ⭐ {s.rating} ({s.completedInstallations}+ Sites)
                            </span>
                          </div>
                          <h4 style={{ fontSize: "1.1rem", marginBottom: "8px" }}>{s.title}</h4>
                          <p className="text-muted" style={{ fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "12px" }}>
                            {s.description}
                          </p>
                          <div style={{ fontSize: "0.78rem", color: "var(--primary)", fontWeight: 600, marginBottom: "16px" }}>
                            ✓ {s.specs} • {s.warranty}
                          </div>
                        </div>

                        <div className="market-footer">
                          <div className="price-info">
                            <span className="price-label">Price Guide</span>
                            <span className="price-value">{s.priceGuide}</span>
                          </div>
                          <button
                            onClick={() => {
                              showToast(`Quote request initialized for ${s.title}! Check CRM tab.`, "info");
                            }}
                            className="btn btn-primary btn-sm btn-market"
                          >
                            Request B2B Quote
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* WORKSPACE 4: FINANCIAL FEASIBILITY & ESG ENGINE */}
          {/* ========================================================================= */}
          {workspaceMode === "financial" && mandateCalculations && (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div
                className="glass-panel"
                style={{
                  padding: "28px",
                  borderRadius: "16px",
                  border: "1px solid var(--card-border)",
                }}
              >
                <div style={{ marginBottom: "24px" }}>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: 800, margin: "0 0 6px 0", color: "var(--text-primary)" }}>
                    Green Real Estate ROI &amp; ESG Feasibility Modeling
                  </h3>
                  <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: 0 }}>
                    Analytical financial models for {activeProject?.projectName} ({activeProject?.totalFlats} Units, {activeProject?.city}).
                  </p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "28px" }}>
                  <div style={{ padding: "20px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Estimated Total CAPEX</span>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)", margin: "4px 0" }}>
                      ₹{(mandateCalculations.totalCapexEstimate / 100000).toFixed(1)} Lakhs
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Includes Solar + RWH + EV Stations</span>
                  </div>

                  <div style={{ padding: "20px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Annual Financial Savings</span>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#10B981", margin: "4px 0" }}>
                      ₹{(mandateCalculations.annualFinancialSaving / 100000).toFixed(1)} Lakhs / yr
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "#10B981", fontWeight: 700 }}>Recurring utility cost reduction</span>
                  </div>

                  <div style={{ padding: "20px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Simple Payback Period</span>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#F59E0B", margin: "4px 0" }}>
                      {mandateCalculations.paybackYears} Years
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Free clean energy for 20+ subsequent years</span>
                  </div>

                  <div style={{ padding: "20px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Carbon Abated (Tonnes/yr)</span>
                    <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#06B6D4", margin: "4px 0" }}>
                      {mandateCalculations.carbonAvertedTonnes} Tonnes CO₂
                    </div>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Directly contributes to IGBC/GRIHA Credits</span>
                  </div>
                </div>

                {/* Copy Report Action */}
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button
                    onClick={() => {
                      const text = `EcoSocietyAI Builder Sustainability Feasibility Report:\n- Project: ${activeProject?.projectName} (${activeProject?.city})\n- Scale: ${activeProject?.totalFlats} Flats, ${activeProject?.towers} Towers\n- Solar Capacity: ${mandateCalculations.recommendedSolarKWp} kWp\n- Rainwater Catchment: ${mandateCalculations.annualRainwaterL.toLocaleString("en-IN")} Litres/year\n- EV Charging: ${mandateCalculations.evSlots} bays\n- Annual Financial Savings: ₹${mandateCalculations.annualFinancialSaving.toLocaleString("en-IN")}/year\n- Maintenance Reduction: ₹${mandateCalculations.monthlyMaintenanceDropPerFlat} / flat / month\n- Payback Period: ${mandateCalculations.paybackYears} Years\n- Carbon Offset: ${mandateCalculations.carbonAvertedTonnes} Tonnes CO2/year`;
                      navigator.clipboard.writeText(text);
                      showToast("Sustainability Feasibility Summary copied to clipboard!", "success");
                    }}
                    className="btn btn-primary btn-md"
                  >
                    Copy Feasibility Summary to Clipboard
                  </button>
                </div>
              </div>
            </div>
          )}

          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW BUILDER PROJECT */}
      {/* ========================================================================= */}
      {newProjectModalOpen && (
        <div className="modal-backdrop" onClick={() => setNewProjectModalOpen(false)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "560px", width: "100%", padding: "32px", borderRadius: "16px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                Add New Real Estate Development Project
              </h3>
              <button onClick={() => setNewProjectModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--text-muted)" }}>✕</button>
            </div>

            <form onSubmit={handleAddProject}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Project Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex Horizon Towers"
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune, Mumbai, Bengaluru"
                      value={newProjCity}
                      onChange={(e) => setNewProjCity(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Target Handover Year</label>
                    <input
                      type="text"
                      placeholder="2027"
                      value={newProjYear}
                      onChange={(e) => setNewProjYear(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Number of Towers</label>
                    <input
                      type="number"
                      min={1}
                      value={newProjTowers}
                      onChange={(e) => setNewProjTowers(Number(e.target.value))}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Total Residential Units</label>
                    <input
                      type="number"
                      min={10}
                      value={newProjFlats}
                      onChange={(e) => setNewProjFlats(Number(e.target.value))}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Total Plot Area (sq.ft)</label>
                    <input
                      type="number"
                      min={1000}
                      value={newProjPlotArea}
                      onChange={(e) => setNewProjPlotArea(Number(e.target.value))}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Usable Terrace Area (sq.ft)</label>
                    <input
                      type="number"
                      min={500}
                      value={newProjTerraceArea}
                      onChange={(e) => setNewProjTerraceArea(Number(e.target.value))}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Target Green Certification</label>
                  <select
                    value={newProjRating}
                    onChange={(e) => setNewProjRating(e.target.value as any)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                  >
                    <option value="IGBC Gold">IGBC Gold Rating (Indian Green Building Council)</option>
                    <option value="IGBC Platinum">IGBC Platinum Rating (Pinnacle Benchmark)</option>
                    <option value="GRIHA 4-Star">GRIHA 4-Star (National Rating System)</option>
                  </select>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                  <button type="button" onClick={() => setNewProjectModalOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Create Project →</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DISPATCH NEW PROJECT TENDER / RFQ */}
      {/* ========================================================================= */}
      {newTenderModalOpen && activeProject && (
        <div className="modal-backdrop" onClick={() => setNewTenderModalOpen(false)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "540px", width: "100%", padding: "32px", borderRadius: "16px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 2px 0", color: "var(--text-primary)" }}>
                  Float Project Tender / RFQ
                </h3>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Project: {activeProject.projectName}</span>
              </div>
              <button onClick={() => setNewTenderModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--text-muted)" }}>✕</button>
            </div>

            <form onSubmit={handleDispatchTender}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Tender Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 50kWp Rooftop Solar PV Installation"
                    value={tenderTitle}
                    onChange={(e) => setTenderTitle(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Category *</label>
                    <select
                      value={tenderCategory}
                      onChange={(e) => setTenderCategory(e.target.value as any)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    >
                      <option value="solar">☀️ Solar PV Microgrid</option>
                      <option value="water">💧 Rainwater Harvesting</option>
                      <option value="ev">⚡ EV Charging Hub</option>
                      <option value="waste">♻️ Waste &amp; Biogas</option>
                      <option value="storage">🔋 Battery Storage (BESS)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Capacity Required</label>
                    <input
                      type="text"
                      placeholder="e.g. 50 kWp or 3,00,000 Litres"
                      value={tenderCapacity}
                      onChange={(e) => setTenderCapacity(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Budget Ceiling (INR)</label>
                    <input
                      type="number"
                      step={50000}
                      value={tenderBudget}
                      onChange={(e) => setTenderBudget(Number(e.target.value))}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Bid Submission Deadline</label>
                    <input
                      type="date"
                      value={tenderDeadline}
                      onChange={(e) => setTenderDeadline(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                  <button type="button" onClick={() => setNewTenderModalOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Publish Tender →</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: SUBMIT VENDOR BID ON TENDER */}
      {/* ========================================================================= */}
      {bidModalOpen && selectedTenderForBid && (
        <div className="modal-backdrop" onClick={() => setBidModalOpen(false)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "540px", width: "100%", padding: "32px", borderRadius: "16px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "#10B981", fontWeight: 800, textTransform: "uppercase" }}>Vendor Proposal Submission</span>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "2px 0 0 0", color: "var(--text-primary)" }}>
                  {selectedTenderForBid.title}
                </h3>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Target Project: {selectedTenderForBid.projectName}</span>
              </div>
              <button onClick={() => setBidModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--text-muted)" }}>✕</button>
            </div>

            <form onSubmit={handleSubmitBid}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Quoted Contract Amount (INR) *</label>
                  <input
                    type="number"
                    required
                    step={10000}
                    value={bidAmount}
                    onChange={(e) => setBidAmount(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                  />
                  <span style={{ fontSize: "0.74rem", color: "var(--text-muted)" }}>
                    Budget Ceiling: ₹{selectedTenderForBid.budgetCeilingINR.toLocaleString("en-IN")}
                  </span>
                </div>

                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Hardware Specifications &amp; Tier</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Tier-1 Mono-PERC Bifacial Modules (550W), Sungrow/Growatt Inverter with 10-year warranty"
                    value={bidSpecs}
                    onChange={(e) => setBidSpecs(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", resize: "none" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Warranty (Years)</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={bidWarrantyYears}
                      onChange={(e) => setBidWarrantyYears(Number(e.target.value))}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Completion Timeline (Days)</label>
                    <input
                      type="number"
                      min={15}
                      value={bidDays}
                      onChange={(e) => setBidDays(Number(e.target.value))}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                  <button type="button" onClick={() => setBidModalOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Submit Quotation →</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW VENDOR SERVICE LISTING */}
      {/* ========================================================================= */}
      {newServiceModalOpen && (
        <div className="modal-backdrop" onClick={() => setNewServiceModalOpen(false)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: "540px", width: "100%", padding: "32px", borderRadius: "16px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: 0, color: "var(--text-primary)" }}>
                Add New Clean Tech Service / Hardware Listing
              </h3>
              <button onClick={() => setNewServiceModalOpen(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "var(--text-muted)" }}>✕</button>
            </div>

            <form onSubmit={handleAddVendorService}>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Service / Solution Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Commercial Biogas Plant (10m³)"
                    value={newServiceTitle}
                    onChange={(e) => setNewServiceTitle(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Category</label>
                    <select
                      value={newServiceCategory}
                      onChange={(e) => setNewServiceCategory(e.target.value as any)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    >
                      <option value="solar">Solar PV</option>
                      <option value="water">Rainwater Harvesting</option>
                      <option value="ev">EV Charging</option>
                      <option value="waste">Waste &amp; Biogas</option>
                      <option value="storage">Energy Storage (BESS)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Price Guide</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹3,50,000 unit"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Warranty &amp; Compliance</label>
                  <input
                    type="text"
                    placeholder="e.g. 5-Year Comprehensive Warranty, CPCB Compliant"
                    value={newServiceWarranty}
                    onChange={(e) => setNewServiceWarranty(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>Description</label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of deployment, turnkey assistance, and technology features."
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", resize: "none" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                  <button type="button" onClick={() => setNewServiceModalOpen(false)} className="btn btn-secondary btn-sm">Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Publish Service →</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
