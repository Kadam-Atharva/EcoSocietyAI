"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface UtilityLog {
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
  type: "success" | "info";
}

const defaultLogs: UtilityLog[] = [
  // Current month (July 2026)
  { id: 1, type: "ENERGY", cost: 142800, value: 12450, unit: "kWh", periodStart: "2026-07-01", periodEnd: "2026-07-31", loggedBy: "Atharva Kadam" },
  { id: 2, type: "WATER", cost: 58400, value: 382000, unit: "Litres", periodStart: "2026-07-01", periodEnd: "2026-07-31", loggedBy: "Atharva Kadam" },
  { id: 3, type: "WASTE", cost: 12800, value: 4120, unit: "kg", periodStart: "2026-07-01", periodEnd: "2026-07-31", loggedBy: "Atharva Kadam" },
  // June 2026
  { id: 4, type: "ENERGY", cost: 154000, value: 13500, unit: "kWh", periodStart: "2026-06-01", periodEnd: "2026-06-30", loggedBy: "Atharva Kadam" },
  { id: 5, type: "WATER", cost: 62000, value: 410000, unit: "Litres", periodStart: "2026-06-01", periodEnd: "2026-06-30", loggedBy: "Atharva Kadam" },
  { id: 6, type: "WASTE", cost: 14000, value: 4300, unit: "kg", periodStart: "2026-06-01", periodEnd: "2026-06-30", loggedBy: "Atharva Kadam" },
  // May 2026
  { id: 7, type: "ENERGY", cost: 168000, value: 14800, unit: "kWh", periodStart: "2026-05-01", periodEnd: "2026-05-31", loggedBy: "System" },
  { id: 8, type: "WATER", cost: 68000, value: 450000, unit: "Litres", periodStart: "2026-05-01", periodEnd: "2026-05-31", loggedBy: "System" },
  { id: 9, type: "WASTE", cost: 15500, value: 4500, unit: "kg", periodStart: "2026-05-01", periodEnd: "2026-05-31", loggedBy: "System" },
];

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
      { vendorName: "☀️ SunPower Systems", rating: 4.8, price: 1050000, isAccepted: false },
      { vendorName: "⚡ ElectroGrid Green", rating: 4.5, price: 1120000, isAccepted: false },
      { vendorName: "🍀 EcoSol Energy Labs", rating: 4.6, price: 990000, isAccepted: false }
    ]
  },
  {
    id: 2,
    title: "Rainwater Harvesting Re-lining & Maintenance",
    category: "water",
    budget: 75000,
    description: "Periodic maintenance for 2 underground storage tanks and filtration sand beds.",
    status: "1 Bid Received",
    createdDate: "2026-07-20",
    bids: [
      { vendorName: "💧 AquaFlow Cleantech", rating: 4.7, price: 68000, isAccepted: false }
    ]
  }
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [activeTab, setActiveTab] = useState<"utility" | "space" | "rfps">("utility");
  const [selectedUtility, setSelectedUtility] = useState<"ALL" | "ENERGY" | "WATER" | "WASTE">("ALL");

  // Stateful Data
  const [utilityLogs, setUtilityLogs] = useState<UtilityLog[]>(defaultLogs);
  const [rfps, setRfps] = useState<RFP[]>(defaultRfps);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Space allocation state
  const [solarArea, setSolarArea] = useState(6500);
  const [gardensArea, setGardensArea] = useState(3000);
  const [rainwaterArea, setRainwaterArea] = useState(2400);
  const [compostArea, setCompostArea] = useState(1200);

  // Modals state
  const [logBillModalOpen, setLogBillModalOpen] = useState(false);
  const [createRfpModalOpen, setCreateRfpModalOpen] = useState(false);

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

  // Load state from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) setTheme(savedTheme);

    const savedTab = localStorage.getItem("dash_active_tab");
    if (savedTab) setActiveTab(savedTab as any);

    const savedUtilitySelect = localStorage.getItem("dash_selected_utility");
    if (savedUtilitySelect) setSelectedUtility(savedUtilitySelect as any);

    const savedLogs = localStorage.getItem("dash_utility_logs");
    if (savedLogs) {
      try {
        setUtilityLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse logs from localStorage", e);
      }
    }

    const savedRFPs = localStorage.getItem("dash_rfps");
    if (savedRFPs) {
      try {
        setRfps(JSON.parse(savedRFPs));
      } catch (e) {
        console.error("Failed to parse RFPs from localStorage", e);
      }
    }

    const savedSpace = localStorage.getItem("dash_space_allocation");
    if (savedSpace) {
      try {
        const parsed = JSON.parse(savedSpace);
        if (parsed.solarArea !== undefined) setSolarArea(parsed.solarArea);
        if (parsed.gardensArea !== undefined) setGardensArea(parsed.gardensArea);
        if (parsed.rainwaterArea !== undefined) setRainwaterArea(parsed.rainwaterArea);
        if (parsed.compostArea !== undefined) setCompostArea(parsed.compostArea);
      } catch (e) {
        console.error("Failed to parse space allocation from localStorage", e);
      }
    }
  }, []);

  // Save states to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("dash_active_tab", activeTab);
    }
  }, [activeTab, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("dash_selected_utility", selectedUtility);
    }
  }, [selectedUtility, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("dash_utility_logs", JSON.stringify(utilityLogs));
    }
  }, [utilityLogs, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("dash_rfps", JSON.stringify(rfps));
    }
  }, [rfps, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(
        "dash_space_allocation",
        JSON.stringify({ solarArea, gardensArea, rainwaterArea, compostArea })
      );
    }
  }, [solarArea, gardensArea, rainwaterArea, compostArea, mounted]);

  // Sync theme
  useEffect(() => {
    if (mounted) {
      if (theme === "light") {
        document.body.classList.add("light-theme");
      } else {
        document.body.classList.remove("light-theme");
      }
      localStorage.setItem("theme", theme);
    }
  }, [theme, mounted]);

  // Toast handler
  const addToast = (message: string, type: "success" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Utility computation
  const getLatestLogForType = (type: "ENERGY" | "WATER" | "WASTE") => {
    const filtered = utilityLogs.filter((log) => log.type === type);
    if (filtered.length === 0) {
      return { cost: 0, value: 0, unit: type === "ENERGY" ? "kWh" : type === "WATER" ? "Litres" : "kg" };
    }
    const sorted = [...filtered].sort((a, b) => b.periodEnd.localeCompare(a.periodEnd));
    return sorted[0];
  };

  const getMonthlyCostTotal = (monthKey: string) => {
    return utilityLogs
      .filter((log) => log.periodStart.startsWith(monthKey))
      .reduce((sum, log) => sum + log.cost, 0);
  };

  const getMonthlyUtilityTotal = (type: "ENERGY" | "WATER" | "WASTE", monthKey: string) => {
    return utilityLogs
      .filter((log) => log.type === type && log.periodStart.startsWith(monthKey))
      .reduce((sum, log) => sum + log.value, 0);
  };

  // Combined Chart computations
  const mayTotal = getMonthlyCostTotal("2026-05");
  const junTotal = getMonthlyCostTotal("2026-06");
  const julTotal = getMonthlyCostTotal("2026-07");
  const maxCost = Math.max(mayTotal, junTotal, julTotal, 1);

  const mayHeight = (mayTotal / maxCost) * 100;
  const junHeight = (junTotal / maxCost) * 100;
  const julHeight = (julTotal / maxCost) * 100;

  // Percentage change (Jun vs Jul)
  const reductionPercent =
    junTotal > 0 ? Math.round(((junTotal - julTotal) / junTotal) * 100) : 0;

  // Specific Utility Chart computations (dynamic coordinates)
  const getSpecificChartPoints = (type: "ENERGY" | "WATER" | "WASTE") => {
    const mayVal = getMonthlyUtilityTotal(type, "2026-05") || (type === "ENERGY" ? 14800 : type === "WATER" ? 450000 : 4500);
    const junVal = getMonthlyUtilityTotal(type, "2026-06") || (type === "ENERGY" ? 13500 : type === "WATER" ? 410000 : 4300);
    const julVal = getMonthlyUtilityTotal(type, "2026-07") || (type === "ENERGY" ? 12450 : type === "WATER" ? 382000 : 4120);

    const maxVal = Math.max(mayVal, junVal, julVal, 1);
    
    // Normalize values between Y=30 and Y=130
    const getY = (val: number) => 130 - (val / maxVal) * 90;

    return {
      points: [
        { label: "May", value: mayVal, x: 80, y: getY(mayVal) },
        { label: "June", value: junVal, x: 250, y: getY(junVal) },
        { label: "July", value: julVal, x: 420, y: getY(julVal) }
      ],
      unit: type === "ENERGY" ? "kWh" : type === "WATER" ? "L" : "kg",
      reductionRate: junVal > 0 ? Math.round(((junVal - julVal) / junVal) * 100) : 0
    };
  };

  // Log Bill form submit
  const handleLogBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!billCost || !billValue) {
      addToast("Please fill in all cost and consumption values.", "info");
      return;
    }

    const unit = billType === "ENERGY" ? "kWh" : billType === "WATER" ? "Litres" : "kg";
    const newLog: UtilityLog = {
      id: Date.now(),
      type: billType,
      cost: parseFloat(billCost),
      value: parseFloat(billValue),
      unit,
      periodStart: billStart,
      periodEnd: billEnd,
      loggedBy: "Atharva Kadam",
    };

    setUtilityLogs((prev) => [newLog, ...prev]);
    setLogBillModalOpen(false);
    setBillCost("");
    setBillValue("");
    addToast(`Successfully logged ${billType.toLowerCase()} bill of ₹${parseFloat(billCost).toLocaleString("en-IN")}`);
  };

  // Space allocation logic
  const handleSolarChange = (val: number) => {
    if (val + gardensArea <= 15000) {
      setSolarArea(val);
    } else {
      setSolarArea(val);
      setGardensArea(15000 - val);
    }
  };

  const handleGardensChange = (val: number) => {
    if (val + solarArea <= 15000) {
      setGardensArea(val);
    } else {
      setGardensArea(val);
      setSolarArea(15000 - val);
    }
  };

  const handleRainwaterChange = (val: number) => {
    if (val + compostArea <= 8000) {
      setRainwaterArea(val);
    } else {
      setRainwaterArea(val);
      setCompostArea(8000 - val);
    }
  };

  const handleCompostChange = (val: number) => {
    if (val + rainwaterArea <= 8000) {
      setCompostArea(val);
    } else {
      setCompostArea(val);
      setRainwaterArea(8000 - val);
    }
  };

  // Space stats
  const solarCapacity = Math.round(solarArea / 80);
  const solarCleanGen = solarCapacity * 4;
  const rainwaterLitres = Math.round(rainwaterArea * 66.8);
  const compostCapacity = Math.round(compostArea * 0.4);

  // RFP Form submit
  const handleCreateRfpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
    addToast(`RFP "${rfpTitle}" posted successfully!`);

    // Simulate bids engine after 2 seconds
    setTimeout(() => {
      setRfps((currentRfps) =>
        currentRfps.map((item) => {
          if (item.id === newRfp.id) {
            const vendorA =
              rfpCategory === "solar"
                ? "☀️ SunPower Systems"
                : rfpCategory === "water"
                ? "💧 AquaFlow Cleantech"
                : rfpCategory === "waste"
                ? "🌱 GreenEarth Compost"
                : "⚡ VoltCharge Installers";
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
                { vendorName: vendorA, rating: 4.7, price: bid1Price, isAccepted: false },
                { vendorName: vendorB, rating: 4.5, price: bid2Price, isAccepted: false },
              ],
            };
          }
          return item;
        })
      );
      addToast(`New vendor proposals received for "${newRfp.title}"!`, "info");
    }, 2000);
  };

  // Accept Bid
  const handleAcceptBid = (rfpId: number, vendorName: string) => {
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

  // Count active RFPs pending actions
  const pendingRfpsCount = rfps.filter(
    (r) => r.status.includes("Bid") && !r.bids.some((b) => b.isAccepted)
  ).length;

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
          ></div>
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
          <div key={t.id} className={`toast ${t.type === "success" ? "toast-success" : "toast-info"}`}>
            {t.type === "success" ? (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="header" style={{ position: "sticky", top: 0, zIndex: 100 }}>
        <div className="container header-container">
          <Link href="/" className="logo">
            <svg
              className="logo-icon"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            <span>
              EcoSociety<span className="logo-highlight">AI</span>
            </span>
          </Link>
          <div className="nav-actions">
            <span
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                borderRight: "1px solid var(--card-border)",
                paddingRight: "16px",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  background: "#10B981",
                  borderRadius: "50%",
                  display: "inline-block",
                }}
              ></span>
              Admin Control Center
            </span>
            <button
              className="theme-toggle"
              id="theme-toggle"
              aria-label="Toggle Dark Mode"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "light" ? (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5"></circle>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                </svg>
              )}
            </button>
            <Link href="/" className="btn btn-secondary btn-sm">
              View Website
            </Link>
          </div>
        </div>
      </header>

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
                <span className="sidebar-logo-dot"></span>
                <span>Grand Meadows Society</span>
              </div>
              <span className="sidebar-role">SOCIETY ADMIN</span>
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
                  ></path>
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
                  ></path>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
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
                  ></path>
                </svg>
                Vendor RFPs
                {pendingRfpsCount > 0 && <span className="badge-count">{pendingRfpsCount}</span>}
              </button>
            </div>
            
            {/* Stable profile bottom corner */}
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
                AK
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)" }}>
                  Atharva Kadam
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.5px" }}>
                  SOCIETY ADMIN
                </span>
              </div>
            </div>
          </div>

          {/* Main Panel Content */}
          <div className="dashboard-content">
            {/* TAB 1: UTILITY ANALYTICS */}
            {activeTab === "utility" && (
              <div className="tab-pane active">
                
                {/* 1. OVERVIEW VIEW */}
                {selectedUtility === "ALL" ? (
                  <>
                    <div className="tab-header">
                      <div>
                        <h4>Utility Resource Audit Console</h4>
                        <p className="text-muted">
                          Audit residential resources, log new invoices, and track society carbon foot-reduction targets. Click a card for details.
                        </p>
                      </div>
                      <button className="btn btn-primary btn-sm" onClick={() => setLogBillModalOpen(true)}>
                        + Log Utility Bill
                      </button>
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
                            ></div>
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
                            ></div>
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
                            ></div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: "0.75rem", color: "var(--accent-orange)", marginTop: "12px", fontWeight: 600 }}>
                          View Details &rarr;
                        </div>
                      </div>
                    </div>

                    {/* SVG Trend Chart */}
                    <div className="chart-panel glass-panel" style={{ background: "rgba(255,255,255,0.01)", marginTop: "24px" }}>
                      <div className="chart-header">
                        <h5>Monthly Combined Resource Expenditure (May - July)</h5>
                        <span className={`chart-badge ${reductionPercent > 0 ? "text-green" : "text-orange"}`}>
                          {reductionPercent > 0 ? `-${reductionPercent}% cost vs last month` : `+${Math.abs(reductionPercent)}% cost vs last month`}
                        </span>
                      </div>
                      <div className="mock-chart" style={{ height: "180px", paddingBottom: "24px" }}>
                        <div className="chart-bars" style={{ height: "100%", paddingBottom: 0 }}>
                          {/* May */}
                          <div className="bar-col">
                            <div
                              className="bar-fill"
                              style={{
                                height: `${mayHeight}%`,
                                width: "36px",
                                transition: "height 0.8s ease-out",
                                background: "linear-gradient(to top, rgba(16, 185, 129, 0.4), #10B981)",
                              }}
                            ></div>
                            <span style={{ fontSize: "0.8rem", marginTop: "8px", position: "relative", transform: "none" }}>
                              May (₹{(mayTotal / 1000).toFixed(0)}k)
                            </span>
                          </div>
                          {/* June */}
                          <div className="bar-col">
                            <div
                              className="bar-fill"
                              style={{
                                height: `${junHeight}%`,
                                width: "36px",
                                transition: "height 0.8s ease-out",
                                background: "linear-gradient(to top, rgba(6, 182, 212, 0.4), #06B6D4)",
                              }}
                            ></div>
                            <span style={{ fontSize: "0.8rem", marginTop: "8px", position: "relative", transform: "none" }}>
                              June (₹{(junTotal / 1000).toFixed(0)}k)
                            </span>
                          </div>
                          {/* July */}
                          <div className="bar-col">
                            <div
                              className="bar-fill"
                              style={{
                                height: `${julHeight}%`,
                                width: "36px",
                                transition: "height 0.8s ease-out",
                                background: "linear-gradient(to top, rgba(139, 92, 246, 0.4), #8B5CF6)",
                              }}
                            ></div>
                            <span style={{ fontSize: "0.8rem", marginTop: "8px", position: "relative", transform: "none", fontWeight: "bold", color: "var(--text-primary)" }}>
                              July (₹{(julTotal / 1000).toFixed(0)}k)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Log Audit Trail */}
                    <div style={{ marginTop: "32px" }}>
                      <h5 style={{ marginBottom: "16px", fontSize: "1rem" }}>Logged Resource Invoices</h5>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem", textAlign: "left" }}>
                          <thead>
                            <tr style={{ borderBottom: "1px solid var(--card-border)", color: "var(--text-muted)" }}>
                              <th style={{ padding: "12px 8px" }}>Period</th>
                              <th style={{ padding: "12px 8px" }}>Category</th>
                              <th style={{ padding: "12px 8px" }}>Consumption</th>
                              <th style={{ padding: "12px 8px" }}>Cost (INR)</th>
                              <th style={{ padding: "12px 8px" }}>Logged By</th>
                            </tr>
                          </thead>
                          <tbody>
                            {utilityLogs.map((log) => (
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
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  /* 2. DYNAMIC UTILITY DETAIL VIEW */
                  (() => {
                    const type = selectedUtility;
                    const latest = getLatestLogForType(type);
                    const chartData = getSpecificChartPoints(type);

                    // Utility specific labels/icons/colors
                    const title = type === "ENERGY" ? "Electricity Grid Details" : type === "WATER" ? "Ground Water Details" : "Solid Waste Details";
                    const badgeClass = type === "ENERGY" ? "util-badge-energy" : type === "WATER" ? "util-badge-water" : "util-badge-waste";
                    const strokeColor = type === "ENERGY" ? "#10B981" : type === "WATER" ? "#06B6D4" : "#F59E0B";
                    const fillColor = type === "ENERGY" ? "rgba(16, 185, 129, 0.1)" : type === "WATER" ? "rgba(6, 182, 212, 0.1)" : "rgba(245, 158, 11, 0.1)";

                    return (
                      <div>
                        {/* Header Navigation */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            style={{ padding: "8px 12px", fontSize: "0.85rem" }}
                            onClick={() => setSelectedUtility("ALL")}
                          >
                            &larr; Back to Overview
                          </button>
                          <button className="btn btn-primary btn-sm" onClick={() => setLogBillModalOpen(true)}>
                            + Log {type.toLowerCase()} bill
                          </button>
                        </div>

                        {/* Title Section */}
                        <div style={{ marginBottom: "24px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span className={`util-badge ${badgeClass}`} style={{ fontSize: "0.8rem", padding: "4px 10px" }}>{type}</span>
                            <h3 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{title}</h3>
                          </div>
                          <p className="text-muted" style={{ marginTop: "4px", fontSize: "0.9rem" }}>
                            Detailed analysis of consumption spikes, historical graphical plots, and logs recorded for {type.toLowerCase()} resources.
                          </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="utility-grid" style={{ marginBottom: "28px" }}>
                          <div className="util-data-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                            <span className="output-label" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Current Bill Amount</span>
                            <div className="metric-val" style={{ fontSize: "2rem", marginTop: "8px", fontWeight: 800 }}>
                              ₹{latest.cost.toLocaleString("en-IN")}
                            </div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Billing cycle: Latest</span>
                          </div>

                          <div className="util-data-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                            <span className="output-label" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Quantity Consumed</span>
                            <div className="metric-val" style={{ fontSize: "2rem", marginTop: "8px", fontWeight: 800 }}>
                              {latest.value.toLocaleString("en-IN")}
                              <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-muted)" }}> {latest.unit}</span>
                            </div>
                            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Registered on-meter</span>
                          </div>

                          {/* Utility Specific Sub-metric */}
                          {type === "ENERGY" && (
                            <div className="util-data-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                              <span className="output-label" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Solar Energy Share</span>
                              <div className="metric-val text-green" style={{ fontSize: "2rem", marginTop: "8px", fontWeight: 800 }}>
                                {Math.round((solarCleanGen * 30 / (latest.value || 1)) * 100)}%
                              </div>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Generated {solarCleanGen} kWh/day</span>
                            </div>
                          )}

                          {type === "WATER" && (
                            <div className="util-data-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                              <span className="output-label" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Water Recharged</span>
                              <div className="metric-val text-blue" style={{ fontSize: "2rem", marginTop: "8px", fontWeight: 800 }}>
                                {Math.round(rainwaterLitres / 12).toLocaleString("en-IN")}
                                <span style={{ fontSize: "0.95rem", fontWeight: 500, color: "var(--text-muted)" }}> L/mo</span>
                              </div>
                              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Through {Math.round(rainwaterArea)} sqft pits</span>
                            </div>
                          )}

                          {type === "WASTE" && (
                            <div className="util-data-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                              <span className="output-label" style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>Compost Generated</span>
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
                              {chartData.reductionRate > 0 ? `-${chartData.reductionRate}% consumption vs last month` : `+${Math.abs(chartData.reductionRate)}% consumption vs last month`}
                            </span>
                          </div>

                          <div style={{ position: "relative", width: "100%", height: "180px", marginTop: "16px" }}>
                            <svg
                              width="100%"
                              height="100%"
                              viewBox="0 0 500 160"
                              preserveAspectRatio="none"
                              style={{ overflow: "visible" }}
                            >
                              <defs>
                                <linearGradient id={`grad-${type}`} x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
                                  <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                                </linearGradient>
                              </defs>

                              {/* Grid lines */}
                              <line x1="50" y1="40" x2="450" y2="40" stroke="var(--card-border)" strokeDasharray="4 4" />
                              <line x1="50" y1="85" x2="450" y2="85" stroke="var(--card-border)" strokeDasharray="4 4" />
                              <line x1="50" y1="130" x2="450" y2="130" stroke="var(--card-border)" strokeDasharray="4 4" />

                              {/* Fill area path */}
                              <path
                                d={`M ${chartData.points[0].x} 130 L ${chartData.points[0].x} ${chartData.points[0].y} L ${chartData.points[1].x} ${chartData.points[1].y} L ${chartData.points[2].x} ${chartData.points[2].y} L ${chartData.points[2].x} 130 Z`}
                                fill={`url(#grad-${type})`}
                                style={{ transition: "all 0.5s ease" }}
                              />

                              {/* Connection stroke */}
                              <path
                                d={`M ${chartData.points[0].x} ${chartData.points[0].y} L ${chartData.points[1].x} ${chartData.points[1].y} L ${chartData.points[2].x} ${chartData.points[2].y}`}
                                fill="none"
                                stroke={strokeColor}
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />

                              {/* Data circles and labels */}
                              {chartData.points.map((pt, i) => (
                                <g key={i}>
                                  <circle
                                    cx={pt.x}
                                    cy={pt.y}
                                    r="6"
                                    fill="var(--bg-color)"
                                    stroke={strokeColor}
                                    strokeWidth="3"
                                  />
                                  {/* Value label */}
                                  <text
                                    x={pt.x}
                                    y={pt.y - 12}
                                    textAnchor="middle"
                                    fill="var(--text-primary)"
                                    fontSize="11"
                                    fontWeight="bold"
                                  >
                                    {Math.round(pt.value).toLocaleString("en-IN")} {chartData.unit}
                                  </text>
                                  {/* X axis Label */}
                                  <text
                                    x={pt.x}
                                    y="150"
                                    textAnchor="middle"
                                    fill="var(--text-muted)"
                                    fontSize="12"
                                    fontWeight="600"
                                  >
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
                      Distribute available surface areas of your society structures to simulate energy offsets and green setups.
                    </p>
                  </div>
                </div>

                <div className="space-columns">
                  {/* Rooftop Panel */}
                  <div className="space-info-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                    <h5>Rooftop Allocation (Total: 15,000 sq.ft.)</h5>
                    <div className="space-stats">
                      <div>
                        <span className="label">Solar Space</span>
                        <span className="value text-green">
                          {solarArea.toLocaleString("en-IN")} sq.ft. ({Math.round((solarArea / 15000) * 100)}%)
                        </span>
                      </div>
                      <div>
                        <span className="label">Rooftop Gardens</span>
                        <span className="value" style={{ color: "#8B5CF6" }}>
                          {gardensArea.toLocaleString("en-IN")} sq.ft. ({Math.round((gardensArea / 15000) * 100)}%)
                        </span>
                      </div>
                      <div>
                        <span className="label">Unused</span>
                        <span className="value text-muted">
                          {(15000 - solarArea - gardensArea).toLocaleString("en-IN")} sq.ft. (
                          {Math.round(((15000 - solarArea - gardensArea) / 15000) * 100)}%)
                        </span>
                      </div>
                    </div>

                    {/* Segment chart */}
                    <div className="space-chart-bar">
                      <div className="segment segment-solar" style={{ width: `${(solarArea / 15000) * 100}%` }}>
                        {solarArea > 1500 && "Solar"}
                      </div>
                      <div className="segment segment-greenhouse" style={{ width: `${(gardensArea / 15000) * 100}%` }}>
                        {gardensArea > 1500 && "Gardens"}
                      </div>
                      <div
                        className="segment segment-free"
                        style={{ width: `${((15000 - solarArea - gardensArea) / 15000) * 100}%` }}
                      >
                        {15000 - solarArea - gardensArea > 1500 && "Unused"}
                      </div>
                    </div>

                    {/* Sliders */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Allocate Solar Panel Area (sq. ft.)</label>
                        <div className="slider-wrapper">
                          <input
                            type="range"
                            min="0"
                            max="15000"
                            step="200"
                            value={solarArea}
                            onChange={(e) => handleSolarChange(parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Allocate Green Roof Gardens (sq. ft.)</label>
                        <div className="slider-wrapper">
                          <input
                            type="range"
                            min="0"
                            max="15000"
                            step="200"
                            value={gardensArea}
                            onChange={(e) => handleGardensChange(parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>

                    <ul className="space-list" style={{ marginTop: "24px" }}>
                      <li>
                        <span>Projected Solar Capacity:</span>
                        <strong>{solarCapacity} kWp</strong>
                      </li>
                      <li>
                        <span>Active Clean Generation:</span>
                        <strong>{solarCleanGen.toLocaleString("en-IN")} kWh/day</strong>
                      </li>
                      <li>
                        <span>Yearly Carbon Saved:</span>
                        <strong className="text-green">{Math.round(solarCleanGen * 365 * 0.8 / 1000)} Tons CO2</strong>
                      </li>
                    </ul>
                  </div>

                  {/* Ground Panel */}
                  <div className="space-info-card glass-panel" style={{ background: "rgba(255,255,255,0.01)" }}>
                    <h5>Ground Allocation (Total: 8,000 sq.ft.)</h5>
                    <div className="space-stats">
                      <div>
                        <span className="label">Water Recharge</span>
                        <span className="value text-blue">
                          {rainwaterArea.toLocaleString("en-IN")} sq.ft. ({Math.round((rainwaterArea / 8000) * 100)}%)
                        </span>
                      </div>
                      <div>
                        <span className="label">Waste Compost</span>
                        <span className="value text-orange">
                          {compostArea.toLocaleString("en-IN")} sq.ft. ({Math.round((compostArea / 8000) * 100)}%)
                        </span>
                      </div>
                      <div>
                        <span className="label">Gardens &amp; Open</span>
                        <span className="value text-muted">
                          {(8000 - rainwaterArea - compostArea).toLocaleString("en-IN")} sq.ft. (
                          {Math.round(((8000 - rainwaterArea - compostArea) / 8000) * 100)}%)
                        </span>
                      </div>
                    </div>

                    {/* Segment chart */}
                    <div className="space-chart-bar">
                      <div className="segment segment-rainwater" style={{ width: `${(rainwaterArea / 8000) * 100}%` }}>
                        {rainwaterArea > 1000 && "Water"}
                      </div>
                      <div className="segment segment-compost" style={{ width: `${(compostArea / 8000) * 100}%` }}>
                        {compostArea > 1000 && "Compost"}
                      </div>
                      <div
                        className="segment segment-free"
                        style={{ width: `${((8000 - rainwaterArea - compostArea) / 8000) * 100}%` }}
                      >
                        {8000 - rainwaterArea - compostArea > 1000 && "Open Space"}
                      </div>
                    </div>

                    {/* Sliders */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Allocate Rainwater Pit Area (sq. ft.)</label>
                        <div className="slider-wrapper">
                          <input
                            type="range"
                            min="0"
                            max="8000"
                            step="100"
                            value={rainwaterArea}
                            onChange={(e) => handleRainwaterChange(parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label>Allocate Organic Composting Area (sq. ft.)</label>
                        <div className="slider-wrapper">
                          <input
                            type="range"
                            min="0"
                            max="8000"
                            step="100"
                            value={compostArea}
                            onChange={(e) => handleCompostChange(parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>

                    <ul className="space-list" style={{ marginTop: "24px" }}>
                      <li>
                        <span>Rainwater Harvesting Capacity:</span>
                        <strong>{rainwaterLitres.toLocaleString("en-IN")} Litres/yr</strong>
                      </li>
                      <li>
                        <span>Organic Compost Conversion:</span>
                        <strong>{compostCapacity.toLocaleString("en-IN")} kg/month</strong>
                      </li>
                      <li>
                        <span>Resident Green Footprint:</span>
                        <strong className="text-blue">Borewell Recharged</strong>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: VENDOR SERVICE RFPs */}
            {activeTab === "rfps" && (
              <div className="tab-pane active">
                <div className="tab-header">
                  <div>
                    <h4>Request for Proposals &amp; Vendor Bids</h4>
                    <p className="text-muted">
                      Draft green project specs, solicit competitive quotes from verified contractors, and award tenders.
                    </p>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={() => setCreateRfpModalOpen(true)}>
                    + Create New RFP
                  </button>
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
                            <span
                              style={{
                                marginLeft: "12px",
                                fontSize: "0.75rem",
                                color: "var(--text-muted)",
                              }}
                            >
                              Category: {rfp.category.toUpperCase()} • Budget: ₹{rfp.budget.toLocaleString("en-IN")}
                            </span>
                            <h5 style={{ margin: "12px 0 6px 0", fontSize: "1.1rem", fontWeight: 700 }}>
                              {rfp.title}
                            </h5>
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
                                <svg
                                  width="18"
                                  height="18"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  viewBox="0 0 24 24"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
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
                                    marginBottom: "8px",
                                    letterSpacing: "0.5px",
                                  }}
                                >
                                  Competitive Vendor Offers:
                                </div>
                                {rfp.bids.map((bid, index) => (
                                  <div key={index} className="bid-row">
                                    <span style={{ fontWeight: 600 }}>{bid.vendorName}</span>
                                    <span className="bid-rating">⭐ {bid.rating} (Verified)</span>
                                    <strong className="bid-price" style={{ fontWeight: 700 }}>
                                      ₹{bid.price.toLocaleString("en-IN")}
                                    </strong>
                                    <button
                                      className="btn btn-primary btn-xs"
                                      onClick={() => handleAcceptBid(rfp.id, bid.vendorName)}
                                    >
                                      Accept Bid
                                    </button>
                                  </div>
                                ))}
                              </>
                            )}
                          </div>
                        )}

                        {rfp.bids.length === 0 && rfp.status === "Request Pending" && (
                          <div
                            className="rfp-bids"
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--text-muted)",
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                background: "#EF4444",
                                borderRadius: "50%",
                                animation: "pulse 1s infinite",
                              }}
                            ></span>
                            Waiting for green verified vendors to review specifications and submit bids...
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
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
                  <option value="ENERGY">Electricity Grid (ENERGY)</option>
                  <option value="WATER">Ground Water Supply (WATER)</option>
                  <option value="WASTE">Solid Waste Disposal (WASTE)</option>
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "24px",
                }}
              >
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
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setLogBillModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Log Invoice
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Technology Category</label>
                  <select
                    className="form-input"
                    value={rfpCategory}
                    onChange={(e) => setRfpCategory(e.target.value as any)}
                  >
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
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCreateRfpModalOpen(false)}
                >
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

      {/* Footer */}
      <footer className="footer" style={{ marginTop: "auto" }}>
        <div className="container footer-bottom" style={{ borderTop: "none", paddingTop: 0 }}>
          <p>&copy; 2026 EcoSocietyAI. housing society sustainability admin dashboard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
