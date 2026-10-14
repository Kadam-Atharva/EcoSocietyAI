"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function PortalLoginPage() {
  const router = useRouter();
  const { loginAsPartner, isBackendConnected } = useAuth();

  // Mode: "vendor" (EPC Contractor) vs "builder" (Real Estate Developer)
  const [partnerType, setPartnerType] = useState<"vendor" | "builder">("builder");

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessId, setBusinessId] = useState(""); // GSTIN or RERA
  const [domainOrCity, setDomainOrCity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fast 1-Click B2B Partner Presets
  const PARTNER_PRESETS = [
    {
      id: "apex-builder",
      type: "builder" as const,
      name: "Rajesh Singhania (VP Projects)",
      company: "Apex Infra & Realty Group",
      email: "builder@apexrealty.in",
      role: "ROLE_BUILDER" as const,
      businessId: "PRM/KA/RERA/1251/310/PR/004020",
      domainOrCity: "Bengaluru & Pune Region",
      badge: "Real Estate Developer",
      badgeColor: "#EC4899",
      activeProjects: "2 Townships (Apex SkyLine Greens & EcoVistas)",
      icon: "🏢",
    },
    {
      id: "sunpower-vendor",
      type: "vendor" as const,
      name: "Arjun Deshmukh (Head EPC)",
      company: "SunPower CleanTech Pvt Ltd",
      email: "vendor@sunpower.com",
      role: "ROLE_VENDOR" as const,
      businessId: "27AABCS1429B1Z2 (GSTIN)",
      domainOrCity: "Solar PV & Microgrids",
      badge: "MNRE Empaneled EPC",
      badgeColor: "#F59E0B",
      activeProjects: "42+ Society Installations",
      icon: "☀️",
    },
    {
      id: "aquaflow-vendor",
      type: "vendor" as const,
      name: "Vikram Kulkarni (Technical Director)",
      company: "AquaFlow Hydro Solutions",
      email: "epc@aquaflow.in",
      role: "ROLE_VENDOR" as const,
      businessId: "27AAACA9823M1ZU (GSTIN)",
      domainOrCity: "Rainwater & Aquifer Recharge",
      badge: "CGWA Certified Contractor",
      badgeColor: "#06B6D4",
      activeProjects: "65+ Recharge Shafts",
      icon: "💧",
    },
    {
      id: "voltcharge-vendor",
      type: "vendor" as const,
      name: "Sameer Nambiar (Fleet Solutions)",
      company: "VoltCharge Systems",
      email: "partners@voltcharge.in",
      role: "ROLE_VENDOR" as const,
      businessId: "29AADCV7712P1ZN (GSTIN)",
      domainOrCity: "EV Hubs & Dynamic Charging",
      badge: "ARAI Approved Provider",
      badgeColor: "#10B981",
      activeProjects: "34+ Multi-Family Hubs",
      icon: "⚡",
    },
  ];

  const handlePresetLogin = (preset: typeof PARTNER_PRESETS[0]) => {
    setLoading(true);
    loginAsPartner({
      role: preset.role,
      name: preset.name,
      email: preset.email,
      companyName: preset.company,
      businessIdentifier: preset.businessId,
      partnerVertical: preset.domainOrCity,
    });
    setTimeout(() => {
      router.push("/portal");
    }, 250);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !companyName) {
      setError("Please provide your business email and registered company name.");
      return;
    }

    setLoading(true);
    setError(null);

    const isBuilder = partnerType === "builder";
    const defaultId = isBuilder ? "RERA-REG-PENDING" : "GSTIN-PENDING";

    loginAsPartner({
      role: isBuilder ? "ROLE_BUILDER" : "ROLE_VENDOR",
      name: companyName,
      email,
      companyName,
      businessIdentifier: businessId.trim() || defaultId,
      partnerVertical: domainOrCity || (isBuilder ? "Residential High-Rise" : "Clean Tech EPC"),
    });

    setTimeout(() => {
      router.push("/portal");
    }, 300);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 16px",
        background: "var(--bg-color)",
        backgroundImage: "radial-gradient(ellipse at 50% 10%, rgba(6, 182, 212, 0.12) 0%, rgba(16, 185, 129, 0.05) 50%, transparent 100%)",
      }}
    >
      <div style={{ width: "100%", maxWidth: "580px", position: "relative", zIndex: 1 }}>
        {/* Brand & Portal Type Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #06B6D4 0%, #10B981 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "1.3rem",
                boxShadow: "0 8px 20px rgba(6, 182, 212, 0.35)",
              }}
            >
              ⚡
            </div>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.65rem",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                color: "var(--text-primary)",
              }}
            >
              EcoSociety<span style={{ color: "#06B6D4" }}>AI</span>
            </span>
          </Link>

          {/* Access Pill */}
          <div style={{ display: "inline-block" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.72rem",
                padding: "4px 12px",
                borderRadius: "20px",
                background: "rgba(6, 182, 212, 0.15)",
                border: "1px solid rgba(6, 182, 212, 0.35)",
                color: "#06B6D4",
                fontWeight: 800,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#06B6D4" }}></span>
              Commercial B2B Partner Gateway
            </span>
          </div>

          <h1
            style={{
              fontSize: "1.6rem",
              fontWeight: 800,
              margin: "12px 0 6px 0",
              color: "var(--text-primary)",
            }}
          >
            Vendor &amp; Builder Access Desk
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", margin: 0, maxWidth: "460px", marginLeft: "auto", marginRight: "auto" }}>
            Dedicated workspace for sustainable real estate developers dispatching tenders and clean tech EPC contractors managing service catalogs.
          </p>
        </div>

        {/* Card Panel */}
        <div
          className="glass-panel"
          style={{
            padding: "32px",
            borderRadius: "20px",
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            boxShadow: "0 16px 36px rgba(0, 0, 0, 0.12)",
          }}
        >
          {/* Partner Role Selector Tabs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
              padding: "4px",
              borderRadius: "12px",
              background: "rgba(0, 0, 0, 0.05)",
              border: "1px solid var(--card-border)",
              marginBottom: "24px",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setPartnerType("builder");
                setError(null);
              }}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
                background: partnerType === "builder" ? "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)" : "transparent",
                color: partnerType === "builder" ? "#FFFFFF" : "var(--text-secondary)",
                boxShadow: partnerType === "builder" ? "0 4px 12px rgba(236, 72, 153, 0.3)" : "none",
              }}
            >
              <span>🏢</span>
              <span>Real Estate Builder</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setPartnerType("vendor");
                setError(null);
              }}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
                background: partnerType === "vendor" ? "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)" : "transparent",
                color: partnerType === "vendor" ? "#FFFFFF" : "var(--text-secondary)",
                boxShadow: partnerType === "vendor" ? "0 4px 12px rgba(245, 158, 11, 0.3)" : "none",
              }}
            >
              <span>⚡</span>
              <span>Clean Tech Vendor / EPC</span>
            </button>
          </div>

          {/* Quick Notice */}
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "8px",
              background: partnerType === "builder" ? "rgba(236, 72, 153, 0.08)" : "rgba(245, 158, 11, 0.08)",
              border: `1px solid ${partnerType === "builder" ? "rgba(236, 72, 153, 0.25)" : "rgba(245, 158, 11, 0.25)"}`,
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>ℹ️</span>
            <span>
              {partnerType === "builder"
                ? "Builders get access to Project Green Mandate Sizing, Statutory Compliance Calculators, and RFP Dispatch."
                : "Vendors get access to the Clean Tech Catalog publisher, CRM Lead Pipeline, and Tendering Desk."}
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#EF4444",
                fontSize: "0.85rem",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleFormSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    marginBottom: "6px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {partnerType === "builder" ? "Developer / Firm Name" : "Company / Contractor Name"}
                </label>
                <input
                  type="text"
                  placeholder={partnerType === "builder" ? "e.g. Apex Realty Infrastructure Group" : "e.g. SunPower CleanTech Pvt Ltd"}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--card-border)",
                    background: "var(--bg-color)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    marginBottom: "6px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Corporate Work Email
                </label>
                <input
                  type="email"
                  placeholder={partnerType === "builder" ? "projects@apexrealty.in" : "contact@sunpower.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--card-border)",
                    background: "var(--bg-color)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      marginBottom: "6px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {partnerType === "builder" ? "Project RERA Reg #" : "GSTIN / MSME Reg #"}
                  </label>
                  <input
                    type="text"
                    placeholder={partnerType === "builder" ? "PRM/KA/RERA/..." : "27AABCS1429..."}
                    value={businessId}
                    onChange={(e) => setBusinessId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--card-border)",
                      background: "var(--bg-color)",
                      color: "var(--text-primary)",
                      fontSize: "0.85rem",
                      outline: "none",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      marginBottom: "6px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {partnerType === "builder" ? "Operating Cities" : "Primary Technology"}
                  </label>
                  <input
                    type="text"
                    placeholder={partnerType === "builder" ? "Bengaluru, Pune" : "Solar, EV, Waste, RWH"}
                    value={domainOrCity}
                    onChange={(e) => setDomainOrCity(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--card-border)",
                      background: "var(--bg-color)",
                      color: "var(--text-primary)",
                      fontSize: "0.85rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    marginBottom: "6px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter partner portal password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--card-border)",
                    background: "var(--bg-color)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  borderRadius: "10px",
                  marginTop: "6px",
                  background: partnerType === "builder" ? "linear-gradient(135deg, #EC4899 0%, #BE185D 100%)" : "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                  borderColor: "transparent",
                }}
              >
                {loading ? "Authenticating Partner Session..." : `Sign In as ${partnerType === "builder" ? "Builder & Developer" : "Green Tech Vendor"}`}
              </button>
            </div>
          </form>

          {/* Fast 1-Click B2B Demo Accounts */}
          <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: "1px solid var(--card-border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                ⚡ Instant B2B Demo Accounts
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>1-Click Instant Sign In</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {PARTNER_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePresetLogin(p)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "10px",
                    border: "1px solid var(--card-border)",
                    background: "var(--card-bg)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = p.badgeColor;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--card-border)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span>{p.icon}</span>
                    <strong style={{ fontSize: "0.82rem", color: "var(--text-primary)" }}>{p.company}</strong>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        fontSize: "0.65rem",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        background: `${p.badgeColor}20`,
                        color: p.badgeColor,
                        fontWeight: 700,
                      }}
                    >
                      {p.badge}
                    </span>
                    <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{p.activeProjects}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Segregation Notice: Society Switcher */}
          <div
            style={{
              marginTop: "24px",
              paddingTop: "16px",
              borderTop: "1px solid var(--card-border)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", margin: "0 0 8px 0" }}>
              Are you a Housing Society Resident, Secretary, or Managing Committee member?
            </p>
            <Link
              href="/login"
              style={{
                fontSize: "0.85rem",
                color: "#10B981",
                fontWeight: 700,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <span>Switch to Society Portal Login</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Security & Isolation Disclaimer */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
            🔒 <strong>Strict Data Isolation</strong>: Vendor and builder project tenders, pricing bids, and compliance metrics are isolated from housing society resident records.
          </p>
        </div>
      </div>
    </div>
  );
}
