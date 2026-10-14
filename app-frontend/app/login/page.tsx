"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, DEMO_PROFILES } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const {
    login,
    loginAsDemo,
    isBackendConnected,
    backendUrl,
    checkBackendConnection,
    isLoading: authLoading,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [checkingBackend, setCheckingBackend] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setSubmitting(true);
    setError(null);

    const result = await login({ email, password });
    setSubmitting(false);

    if (result.success) {
      const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("ecosociety_user") : null;
      const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;
      if (savedUser?.roleName?.includes("VENDOR") || savedUser?.roleName?.includes("BUILDER")) {
        router.push("/portal");
      } else {
        router.push("/dashboard");
      }
    } else {
      setError(result.error || "Failed to sign in. Please verify your credentials.");
    }
  };

  const handleDemoSelect = (profileId: "ADMIN" | "RESIDENT" | "VENDOR" | "AUDITOR" | "BUILDER") => {
    loginAsDemo(profileId);
    if (profileId === "VENDOR" || profileId === "BUILDER") {
      router.push("/portal");
    } else {
      router.push("/dashboard");
    }
  };

  const handleTestConnection = async () => {
    setCheckingBackend(true);
    await checkBackendConnection();
    setCheckingBackend(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "32px 16px",
        background: "var(--bg-color)",
        backgroundImage: "var(--bg-gradient)",
      }}
    >
      {/* Background ambient orbs */}
      <div
        style={{
          position: "fixed",
          top: "10%",
          left: "15%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "10%",
          right: "15%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{ width: "100%", maxWidth: "520px", position: "relative", zIndex: 1 }}>
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
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
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #10B981 0%, #06B6D4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontWeight: 800,
                fontSize: "1.2rem",
                boxShadow: "0 8px 16px rgba(16, 185, 129, 0.3)",
              }}
            >
              🌱
            </div>
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.6rem",
                fontWeight: 800,
                letterSpacing: "-0.5px",
                color: "var(--text-primary)",
              }}
            >
              EcoSociety<span style={{ color: "var(--primary)" }}>AI</span>
            </span>
          </Link>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              margin: "8px 0 4px 0",
              color: "var(--text-primary)",
            }}
          >
            Welcome Back
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            Sign in to manage your society&apos;s sustainability metrics and green vendor network
          </p>
        </div>

        {/* Backend Connectivity Status Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "8px 14px",
            borderRadius: "10px",
            background: isBackendConnected ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
            border: `1px solid ${isBackendConnected ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
            marginBottom: "20px",
            fontSize: "0.8rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isBackendConnected ? "#10B981" : "#F59E0B",
                boxShadow: isBackendConnected
                  ? "0 0 8px #10B981"
                  : "0 0 8px #F59E0B",
              }}
            />
            <span style={{ color: isBackendConnected ? "var(--primary)" : "var(--accent-orange)", fontWeight: 600 }}>
              {isBackendConnected
                ? `Backend Online (${backendUrl})`
                : `Backend Offline (Demo Fallback Mode)`}
            </span>
          </div>
          <button
            onClick={handleTestConnection}
            disabled={checkingBackend}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-secondary)",
              fontSize: "0.75rem",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {checkingBackend ? "Pinging..." : "Check API"}
          </button>
        </div>

        {/* Main Login Card */}
        <div
          style={{
            background: "var(--card-bg-solid)",
            border: "1px solid var(--card-border)",
            borderRadius: "16px",
            padding: "32px",
            boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(16px)",
          }}
        >
          {error && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#EF4444",
                fontSize: "0.85rem",
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "18px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "6px",
                  color: "var(--text-secondary)",
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@ecosociety.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--card-border)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <label
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                  }}
                >
                  Password
                </label>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Any password in demo mode
                </span>
              </div>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid var(--card-border)",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  outline: "none",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || authLoading}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "8px",
                background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                border: "none",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "1rem",
                fontFamily: "var(--font-heading)",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
                transition: "transform 0.15s ease, opacity 0.2s ease",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Signing in..." : "Sign In to Dashboard →"}
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div style={{ marginTop: "28px", borderTop: "1px solid var(--card-border)", paddingTop: "20px" }}>
            <div
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                color: "var(--text-muted)",
                marginBottom: "12px",
                textAlign: "center",
              }}
            >
              ⚡ Quick Demo Profiles (1-Click Instant Login)
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {DEMO_PROFILES.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => handleDemoSelect(profile.id)}
                  type="button"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid var(--card-border)",
                    color: "var(--text-primary)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.borderColor = profile.badgeColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                    e.currentTarget.style.borderColor = "var(--card-border)";
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      background: profile.badgeColor,
                      color: "#fff",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {profile.avatarText}
                  </div>
                  <div style={{ overflow: "hidden" }}>
                    <div
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {profile.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {profile.roleTitle.split("(")[0]}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dedicated Vendor & Builder Portal Callout */}
        <div
          style={{
            marginTop: "16px",
            padding: "12px 18px",
            borderRadius: "12px",
            background: "rgba(6, 182, 212, 0.08)",
            border: "1px solid rgba(6, 182, 212, 0.25)",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            Are you a Clean Tech Vendor or Real Estate Developer?{" "}
          </span>
          <Link
            href="/portal/login"
            style={{
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#06B6D4",
              textDecoration: "none",
            }}
          >
            Go to Partner Portal Login →
          </Link>
        </div>

        {/* Footer Links */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              style={{
                color: "var(--primary)",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Create Account
            </Link>
          </p>
          <div style={{ marginTop: "12px" }}>
            <Link
              href="/"
              style={{
                color: "var(--text-muted)",
                fontSize: "0.8rem",
                textDecoration: "none",
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
