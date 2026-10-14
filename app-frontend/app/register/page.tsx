"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { signup, availableSocieties, isBackendConnected, backendUrl } = useAuth();

  const [roleName, setRoleName] = useState<"ROLE_ADMIN" | "ROLE_RESIDENT" | "ROLE_VENDOR">("ROLE_ADMIN");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [societyId, setSocietyId] = useState<number>(availableSocieties[0]?.societyId || 1);
  const [flatNumber, setFlatNumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setError("Please fill in your name and email.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const selectedSociety = availableSocieties.find((s) => s.societyId === societyId);

    const result = await signup({
      fullName,
      email,
      password: password || "temp123",
      phoneNumber,
      roleName,
      societyId: roleName !== "ROLE_VENDOR" ? societyId : undefined,
      societyName: roleName !== "ROLE_VENDOR" ? selectedSociety?.societyName : undefined,
      flatNumber: roleName === "ROLE_RESIDENT" ? flatNumber : undefined,
      companyName: roleName === "ROLE_VENDOR" ? companyName || fullName : undefined,
      gstNumber: roleName === "ROLE_VENDOR" ? gstNumber : undefined,
    });

    setSubmitting(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error || "Registration failed. Please check your information.");
    }
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
      <div style={{ width: "100%", maxWidth: "580px", position: "relative", zIndex: 1 }}>
        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              marginBottom: "8px",
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
              fontSize: "1.45rem",
              fontWeight: 700,
              margin: "6px 0 4px 0",
              color: "var(--text-primary)",
            }}
          >
            Create Your Account
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Join India&apos;s intelligent housing society sustainability ecosystem
          </p>
        </div>

        {/* Backend Connectivity Status Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "6px 14px",
            borderRadius: "20px",
            background: isBackendConnected ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
            border: `1px solid ${isBackendConnected ? "rgba(16, 185, 129, 0.3)" : "rgba(245, 158, 11, 0.3)"}`,
            marginBottom: "16px",
            fontSize: "0.75rem",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: isBackendConnected ? "#10B981" : "#F59E0B",
            }}
          />
          <span style={{ color: isBackendConnected ? "var(--primary)" : "var(--accent-orange)", fontWeight: 600 }}>
            {isBackendConnected
              ? `Backend Sync Active: ${backendUrl}`
              : `Local Demo Mode (Backend Offline)`}
          </span>
        </div>

        {/* Registration Card */}
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
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Picker */}
            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginBottom: "8px",
                  color: "var(--text-secondary)",
                }}
              >
                I am registering as:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {[
                  { id: "ROLE_ADMIN", label: "Society Admin", icon: "🏢" },
                  { id: "ROLE_RESIDENT", label: "Resident", icon: "🏡" },
                  { id: "ROLE_VENDOR", label: "Green Vendor", icon: "⚡" },
                ].map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setRoleName(role.id as any)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: "8px",
                      border:
                        roleName === role.id
                          ? "2px solid var(--primary)"
                          : "1px solid var(--card-border)",
                      background:
                        roleName === role.id ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 255, 255, 0.03)",
                      color: roleName === role.id ? "var(--primary)" : "var(--text-primary)",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: "1.1rem" }}>{role.icon}</span>
                    <span>{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Common Fields */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    marginBottom: "6px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Atharva Kadam"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid var(--card-border)",
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
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    marginBottom: "6px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98200 00000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid var(--card-border)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
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
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid var(--card-border)",
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
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    marginBottom: "6px",
                    color: "var(--text-secondary)",
                  }}
                >
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid var(--card-border)",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Role Specific Fields */}
            {roleName !== "ROLE_VENDOR" ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: roleName === "ROLE_RESIDENT" ? "1.5fr 1fr" : "1fr",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      marginBottom: "6px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Select Housing Society
                  </label>
                  <select
                    value={societyId}
                    onChange={(e) => setSocietyId(Number(e.target.value))}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid var(--card-border)",
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  >
                    {availableSocieties.map((s) => (
                      <option
                        key={s.societyId}
                        value={s.societyId}
                        style={{ background: "#0F1624", color: "#F9FAFB" }}
                      >
                        {s.societyName} ({s.city || "India"})
                      </option>
                    ))}
                  </select>
                </div>

                {roleName === "ROLE_RESIDENT" && (
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        marginBottom: "6px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Flat / Unit #
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. B-404"
                      value={flatNumber}
                      onChange={(e) => setFlatNumber(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid var(--card-border)",
                        color: "var(--text-primary)",
                        fontSize: "0.9rem",
                        outline: "none",
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1fr",
                  gap: "12px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      marginBottom: "6px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Company / Firm Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apex Solar Energy Ltd"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid var(--card-border)",
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
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      marginBottom: "6px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    GST Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="27AABCS1234D1Z5"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid var(--card-border)",
                      color: "var(--text-primary)",
                      fontSize: "0.9rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
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
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Creating Account..." : "Complete Registration & Enter Dashboard →"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Already registered?{" "}
            <Link
              href="/login"
              style={{
                color: "var(--primary)",
                fontWeight: 600,
                textDecoration: "underline",
              }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
