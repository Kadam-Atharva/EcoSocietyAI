"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  activeView?: "dashboard" | "portal" | "landing" | "marketplace";
}

export default function Navbar({ activeView = "landing" }: NavbarProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout, activeSociety, availableSocieties, switchSociety, isBackendConnected } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: "72px",
        background: isDark ? "rgba(8, 11, 17, 0.85)" : "rgba(255, 255, 255, 0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          height: "100%",
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        {/* Left Section: Brand Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-heading), 'Outfit', sans-serif",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    letterSpacing: "-0.4px",
                    color: "var(--text-primary)",
                  }}
                >
                  EcoSociety<span style={{ color: "#10B981" }}>AI</span>
                </span>

                {/* Context badge only for non-landing dashboards */}
                {activeView === "dashboard" && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      padding: "2px 7px",
                      borderRadius: "4px",
                      fontWeight: 800,
                      letterSpacing: "0.5px",
                      background: "rgba(16, 185, 129, 0.14)",
                      color: "#10B981",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    SOCIETY ADMIN
                  </span>
                )}
                {activeView === "portal" && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontWeight: 800,
                      letterSpacing: "0.5px",
                      background: "rgba(6, 182, 212, 0.14)",
                      color: "#06B6D4",
                      border: "1px solid rgba(6, 182, 212, 0.3)",
                    }}
                  >
                    VENDOR &amp; BUILDER HUB
                  </span>
                )}
                {activeView === "marketplace" && (
                  <span
                    style={{
                      fontSize: "0.65rem",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontWeight: 800,
                      letterSpacing: "0.5px",
                      background: "rgba(16, 185, 129, 0.14)",
                      color: "#10B981",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                    }}
                  >
                    MARKETPLACE
                  </span>
                )}
              </div>

              {/* Subtitles only for dashboards, keeping landing page clean */}
              {activeView === "dashboard" && (
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--text-muted)",
                    display: "block",
                    marginTop: "-3px",
                    fontWeight: 500,
                  }}
                >
                  Housing Society Administration &amp; Microgrid Console
                </span>
              )}
              {activeView === "portal" && (
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--text-muted)",
                    display: "block",
                    marginTop: "-3px",
                    fontWeight: 500,
                  }}
                >
                  Clean Tech EPCs &amp; Sustainable Real Estate Developers
                </span>
              )}
              {activeView === "marketplace" && (
                <span
                  style={{
                    fontSize: "0.68rem",
                    color: "var(--text-muted)",
                    display: "block",
                    marginTop: "-3px",
                    fontWeight: 500,
                  }}
                >
                  Verified Green Technologies, Utilities &amp; Turnkey EPCs
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Center Section: Navigation Links for Landing & Marketplace Pages */}
        {(activeView === "landing" || activeView === "marketplace") && (
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            className="landing-nav-links"
          >
            <Link
              href="/#features"
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Features
            </Link>
            <Link
              href="/#calculator"
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Impact Calculator
            </Link>


            {/* Dedicated All Marketplace Tab (Links to /marketplace) */}
            <Link
              href="/marketplace"
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#10B981",
                textDecoration: "none",
                padding: "8px 14px",
                borderRadius: "8px",
                background: activeView === "marketplace" ? "rgba(16, 185, 129, 0.18)" : "rgba(16, 185, 129, 0.08)",
                border: activeView === "marketplace" ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(16, 185, 129, 0.2)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(16, 185, 129, 0.18)";
                e.currentTarget.style.borderColor = "rgba(16, 185, 129, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = activeView === "marketplace" ? "rgba(16, 185, 129, 0.18)" : "rgba(16, 185, 129, 0.08)";
                e.currentTarget.style.borderColor = activeView === "marketplace" ? "rgba(16, 185, 129, 0.4)" : "rgba(16, 185, 129, 0.2)";
              }}
            >
              <span>Marketplace</span>
              <span
                style={{
                  fontSize: "0.62rem",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  background: "rgba(16, 185, 129, 0.25)",
                  color: "#10B981",
                  fontWeight: 800,
                  letterSpacing: "0.4px",
                }}
              >
                PAGE
              </span>
            </Link>

            {/* Direct link to Vendor & Builder Dashboard */}
            <Link
              href="/portal"
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--text-primary)";
                e.currentTarget.style.background = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span>Vendors &amp; Builders</span>
              <span
                style={{
                  fontSize: "0.62rem",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  background: isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                  color: "var(--text-muted)",
                  fontWeight: 700,
                }}
              >
                HUB
              </span>
            </Link>
          </nav>
        )}

        {/* Center Section: Navigation for Vendor & Builder Hub */}
        {activeView === "portal" && (
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
            className="landing-nav-links"
          >
            <Link
              href="/"
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              ← Back to Main Site
            </Link>
          </nav>
        )}

        {/* Right Section: Telemetry (Dashboard only), Theme Toggle, Auth CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Active Society Selector (ONLY on Housing Society Dashboard) */}
          {activeView === "dashboard" && availableSocieties && availableSocieties.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                borderRadius: "8px",
                background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "#10B981" }}>
                <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/>
              </svg>
              <select
                value={activeSociety?.societyId || 1}
                onChange={(e) => switchSociety(Number(e.target.value))}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                {availableSocieties.map((s) => (
                  <option key={s.societyId} value={s.societyId} style={{ background: isDark ? "#0F1624" : "#FFFFFF", color: isDark ? "#F9FAFB" : "#0F172A" }}>
                    {s.societyName} ({s.city || "Pune"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Backend Connectivity Status Pill (ONLY in Dashboard view, NOT on Landing) */}
          {activeView === "dashboard" && (
            <div
              title={isBackendConnected ? "Backend Spring Boot API is online on :8080" : "Running in demo mode"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 10px",
                borderRadius: "20px",
                fontSize: "0.74rem",
                fontWeight: 700,
                background: isBackendConnected ? "rgba(16, 185, 129, 0.12)" : "rgba(245, 158, 11, 0.12)",
                border: `1px solid ${isBackendConnected ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
                color: isBackendConnected ? "var(--primary)" : "var(--accent-orange)",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: isBackendConnected ? "#10B981" : "#F59E0B",
                  boxShadow: isBackendConnected ? "0 0 8px #10B981" : "none",
                }}
              />
              <span>{isBackendConnected ? "API :8080 LIVE" : "DEMO READY"}</span>
            </div>
          )}

          {/* Clean, Elegant Icon-Only Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Dark Mode"
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.04)",
              border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)"}`,
              color: isDark ? "#F59E0B" : "#4B5563",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#10B981";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {/* User Profile Pill or Sign In CTA */}
          {isAuthenticated && user ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "4px 12px 4px 6px",
                borderRadius: "24px",
                background: isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)",
                border: `1px solid ${isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)"}`,
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: user?.roleName?.includes("ADMIN")
                    ? "#10B981"
                    : user?.roleName?.includes("BUILDER")
                    ? "#EC4899"
                    : user?.roleName?.includes("VENDOR")
                    ? "#F59E0B"
                    : "#06B6D4",
                  color: "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                  flexShrink: 0,
                }}
              >
                {user?.fullName?.charAt(0) || "U"}
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
                  {user?.fullName || "Verified User"}
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span>{user?.roleName?.replace("ROLE_", "") || "USER"}</span>
                </div>
              </div>

              {(activeView === "landing" || activeView === "marketplace") && (
                <Link
                  href={user?.roleName?.includes("VENDOR") || user?.roleName?.includes("BUILDER") ? "/portal" : "/dashboard"}
                  className="btn btn-secondary btn-sm"
                  style={{ padding: "4px 10px", fontSize: "0.75rem", marginLeft: "4px" }}
                >
                  {user?.roleName?.includes("VENDOR") || user?.roleName?.includes("BUILDER") ? "Vendor/Builder Hub" : "Society Dashboard"}
                </Link>
              )}

              {/* Sign Out Button */}
              <button
                onClick={() => {
                  logout();
                  if (activeView === "portal") {
                    router.push("/portal/login");
                  } else {
                    router.push("/login");
                  }
                }}
                title="Sign out of your session"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  padding: "4px 6px",
                  marginLeft: "2px",
                  borderRadius: "4px",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#EF4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link
                href={activeView === "portal" ? "/portal/login" : "/login"}
                className="btn btn-secondary btn-sm"
                style={{ padding: "7px 16px", fontSize: "0.85rem", borderRadius: "8px" }}
              >
                {activeView === "portal" ? "Partner Login" : "Sign In"}
              </Link>
              <Link
                href="/register"
                className="btn btn-primary btn-sm"
                style={{ padding: "7px 18px", fontSize: "0.85rem", borderRadius: "8px" }}
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Navigation Menu Toggle */}
          {(activeView === "landing" || activeView === "marketplace") && (
            <button
              className="mobile-nav-toggle"
              aria-label="Toggle mobile menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-primary)",
                cursor: "pointer",
                padding: "6px",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {(activeView === "landing" || activeView === "marketplace") && mobileMenuOpen && (
        <div
          style={{
            position: "absolute",
            top: "72px",
            left: 0,
            width: "100%",
            background: isDark ? "rgba(8, 11, 17, 0.98)" : "rgba(255, 255, 255, 0.98)",
            borderBottom: "1px solid var(--card-border)",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            boxShadow: "var(--shadow)",
          }}
        >
          <Link href="/#features" onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            Features
          </Link>
          <Link href="/#calculator" onClick={() => setMobileMenuOpen(false)} style={{ color: "var(--text-primary)", fontWeight: 600 }}>
            Impact Calculator
          </Link>

          <Link href="/marketplace" onClick={() => setMobileMenuOpen(false)} style={{ color: "#10B981", fontWeight: 700 }}>
            All Marketplace →
          </Link>
          <Link href="/portal" onClick={() => setMobileMenuOpen(false)} style={{ color: "#06B6D4", fontWeight: 700 }}>
            Vendors &amp; Builders Hub →
          </Link>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            <Link href="/login" className="btn btn-secondary btn-sm" style={{ flex: 1, textAlign: "center" }}>
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm" style={{ flex: 1, textAlign: "center" }}>
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
