"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  // --- States ---
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"utility" | "space" | "rfps">("utility");
  const [marketplaceFilter, setMarketplaceFilter] = useState<"all" | "solar" | "water" | "waste">("all");

  // Calculator inputs
  const [roofArea, setRoofArea] = useState(10000);
  const [groundArea, setGroundArea] = useState(5000);
  const [monthlyBill, setMonthlyBill] = useState(75000);

  // Stats Counter Animation States
  const [co2, setCo2] = useState(0);
  const [societies, setSocieties] = useState(0);
  const [saving, setSaving] = useState(0);

  // --- Effects ---
  // Theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Theme application
  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Stats count-up animation
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 2000; // 2 seconds

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);

      setCo2(Math.floor(progress * 1245000));
      setSocieties(Math.floor(progress * 140));
      setSaving(Math.floor(progress * 45));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, []);

  // --- Calculator Logic ---
  const solarCap = Math.min(Math.round(roofArea / 110), 500);
  const dailyGen = solarCap * 4;
  const monthlyGen = dailyGen * 30;
  const solarCostPerKwh = 10; // ₹10 per unit grid price
  const maxOffset = 0.75; // max 75% bill offset

  const theoreticalSavings = monthlyGen * solarCostPerKwh;
  const actualMonthlySavings = Math.min(monthlyBill * maxOffset, theoreticalSavings);
  const annualSavings = actualMonthlySavings * 12;

  const savingPercVal = Math.round((actualMonthlySavings / monthlyBill) * 100);

  const annualRainwaterLitres = Math.round(groundArea * 66.8);

  const annualKwhSolar = solarCap * 4 * 365;
  const co2OffsetKg = annualKwhSolar * 0.8;
  const co2OffsetTons = Math.round((co2OffsetKg / 1000) * 10) / 10;
  const treesEquivalent = Math.round(co2OffsetKg / 22);

  const capExSolar = solarCap * 45000;
  const capExRain = groundArea * 25;
  const totalCapEx = capExSolar + capExRain;

  let paybackYears = 3.0;
  if (annualSavings > 0) {
    paybackYears = totalCapEx / annualSavings;
  }
  paybackYears = Math.max(2.5, Math.min(8.5, paybackYears));
  const roiProgress = 100 - ((paybackYears - 2.5) / (8.5 - 2.5)) * 80;

  // Formatting helpers
  const formatSavings = (savings: number) => {
    if (savings >= 100000) {
      return "₹" + (savings / 100000).toFixed(1) + "L";
    }
    return "₹" + Math.round(savings).toLocaleString("en-IN");
  };

  const formatRainwater = (litres: number) => {
    if (litres >= 100000) {
      return (litres / 100000).toFixed(1) + "L";
    }
    return Math.round(litres / 1000) + "K";
  };

  const formatNumberWithCommas = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    return num.toLocaleString("en-IN");
  };

  // --- Vendor Marketplace Data ---
  const vendorServices = [
    {
      id: 1,
      category: "solar",
      badge: "Solar",
      title: "Solar Panel Installation - 10kWp",
      desc: "Complete installation including mono-PERC solar modules, grid-tie inverter, structure, net-metering assistance, and 5-year maintenance.",
      price: "₹4,50,000",
    },
    {
      id: 2,
      category: "water",
      badge: "Rainwater",
      title: "Dual-Chamber Rainwater Harvester",
      desc: "Ground-level filtration chambers and recharge shafts setup. Captures, filters, and redirects storm water to recharge housing borewells.",
      price: "₹1,80,000",
    },
    {
      id: 3,
      category: "waste",
      badge: "Waste",
      title: "Organic Shredder & Compost Tumbler",
      desc: "Heavy-duty food waste shredder combined with mechanical turning compost pits. Converts 150kg wet kitchen waste to organic manure daily.",
      price: "₹95,000",
    },
    {
      id: 4,
      category: "solar",
      badge: "Solar",
      title: "Smart EV Charger Station Hub",
      desc: "Setup 3x AC Type-2 chargers (7.4kW) with integrated RFID/UPI payment gateway. Allows members to self-charge vehicles and auto-bill.",
      price: "₹2,20,000",
    },
    {
      id: 5,
      category: "water",
      badge: "Rainwater",
      title: "Borewell Recharge System Repair",
      desc: "Cleaning, silt removal, desand, and restructuring of silt traps for existing housing community rainwater structures.",
      price: "₹45,000",
    },
    {
      id: 6,
      category: "waste",
      badge: "Waste",
      title: "Biogas Plant (5 Cubic Meter)",
      desc: "Compact community anaerobic waste digestor. Recovers methane from kitchen waste to generate biogas for communal heaters or kitchens.",
      price: "₹3,10,000",
    },
  ];

  const filteredServices = vendorServices.filter(
    (service) => marketplaceFilter === "all" || service.category === marketplaceFilter
  );

  return (
    <>
      {/* Header Navigation */}
      <header className="header">
        <div className="container header-container">
          <a href="#" className="logo">
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
          </a>
          <nav className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
            <a href="#features" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
              Features
            </a>
            <a href="#calculator" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
              Impact Calculator
            </a>
            <a href="#dashboard" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
              Dashboard Preview
            </a>
            <a href="#marketplace" className="nav-item" onClick={() => setMobileMenuOpen(false)}>
              Marketplace
            </a>
          </nav>
          <div className="nav-actions">
            <Link href="/dashboard" className="btn btn-secondary btn-sm" id="btn-login">
              Login
            </Link>
            <Link href="/dashboard" className="btn btn-primary btn-sm" id="btn-register">
              Get Started
            </Link>
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
          </div>
          <button
            className="mobile-nav-toggle"
            aria-label="Open Navigation Menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container hero-container grid-2">
            <div className="hero-content">
              <div className="badge-pill">
                <span className="badge-dot"></span>
                <span className="badge-text">Next-Gen Green Housing Solutions</span>
              </div>
              <h1 className="hero-title">
                Transform Your Housing Society Into a <span className="gradient-text">Sustainable Ecosystem</span>
              </h1>
              <p className="hero-description">
                EcoSocietyAI helps housing societies audit utilities, allocate space for green initiatives like solar energy, rainwater harvesting, and EV chargers, and discover verified green vendors.
              </p>
              <div className="hero-actions">
                <a href="#calculator" className="btn btn-primary btn-lg">
                  Calculate Your ROI
                </a>
                <a href="#dashboard" className="btn btn-secondary btn-lg">
                  Watch Interactive Demo
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number" id="stat-co2">
                    {formatNumberWithCommas(co2)}
                  </span>
                  <span className="stat-unit">kg</span>
                  <span className="stat-label">Carbon Offset</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number" id="stat-societies">
                    {societies}
                  </span>
                  <span className="stat-unit">+</span>
                  <span className="stat-label">Smart Societies</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number" id="stat-saving">
                    {saving}%
                  </span>
                  <span className="stat-label">Average Utility Savings</span>
                </div>
              </div>
            </div>
            <div className="hero-visual">
              <div className="glow-effect"></div>
              <div className="image-wrapper">
                <Image
                  src="/assets/hero_green_society.png"
                  alt="EcoSocietyAI Sustainable Housing Society Illustration"
                  className="hero-image"
                  width={600}
                  height={420}
                  priority
                />
              </div>
              <div className="floating-card metric-card">
                <div className="card-icon">
                  <svg width="24" height="24" fill="none" stroke="#10B981" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div className="card-details">
                  <span className="card-title">Live Solar Generation</span>
                  <span className="card-value">42.8 kW</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section id="features" className="features-section">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Core Platform Modules</h2>
              <p className="section-subtitle">
                Designed to cover all aspects of community carbon auditing, budgeting, and green infrastructure deployment.
              </p>
            </div>
            <div className="features-grid grid-3">
              {/* Feature 1 */}
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </div>
                <h3>Smart Utility Auditing</h3>
                <p>
                  Log and track electricity, water, and waste trends. Identify surges and structural wastage using intelligent trend analytics.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    ></path>
                  </svg>
                </div>
                <h3>Space Asset Planner</h3>
                <p>
                  Analyze available rooftop and ground space automatically. Align space measurements with solar capacity and rainwater retention calculations.
                </p>
              </div>
              {/* Feature 3 */}
              <div className="feature-card">
                <div className="feature-icon">
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                  </svg>
                </div>
                <h3>Green Marketplace</h3>
                <p>
                  Connect with verified service vendors for Solar Panels, EV Charging Stations, Organic Composting, and Rainwater Harvesting.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability Calculator Section */}
        <section id="calculator" className="calculator-section">
          <div className="container">
            <div className="grid-2 align-center">
              <div className="calculator-info">
                <h2 className="section-title">
                  Evaluate Your Society's <span className="gradient-text">Sustainability Potential</span>
                </h2>
                <p className="section-subtitle">
                  Adjust the parameters to estimate the environmental and economic savings your housing society can achieve.
                </p>
                <div className="calculator-form glass-panel">
                  {/* Input 1 */}
                  <div className="form-group">
                    <label htmlFor="input-roof">Available Rooftop Area (sq. ft.)</label>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        id="input-roof"
                        min="500"
                        max="50000"
                        step="500"
                        value={roofArea}
                        onChange={(e) => setRoofArea(Number(e.target.value))}
                      />
                      <span className="value-display" id="display-roof">
                        {roofArea.toLocaleString("en-IN")} sq.ft.
                      </span>
                    </div>
                  </div>
                  {/* Input 2 */}
                  <div className="form-group">
                    <label htmlFor="input-ground">Available Ground Area (sq. ft.)</label>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        id="input-ground"
                        min="500"
                        max="50000"
                        step="500"
                        value={groundArea}
                        onChange={(e) => setGroundArea(Number(e.target.value))}
                      />
                      <span className="value-display" id="display-ground">
                        {groundArea.toLocaleString("en-IN")} sq.ft.
                      </span>
                    </div>
                  </div>
                  {/* Input 3 */}
                  <div className="form-group">
                    <label htmlFor="input-bill">Monthly Electricity Bill (₹)</label>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        id="input-bill"
                        min="5000"
                        max="500000"
                        step="5000"
                        value={monthlyBill}
                        onChange={(e) => setMonthlyBill(Number(e.target.value))}
                      />
                      <span className="value-display" id="display-bill">
                        ₹{monthlyBill.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Outputs Side */}
              <div className="calculator-outputs">
                <div className="outputs-wrapper glass-panel">
                  <h3 className="output-header">Estimated Yearly Benefits</h3>
                  <div className="outputs-grid">
                    <div className="output-card">
                      <span className="output-label">Solar Power Capacity</span>
                      <div className="output-val-wrapper">
                        <span className="output-value" id="out-solar-cap">
                          {solarCap}
                        </span>
                        <span className="output-unit">kWp</span>
                      </div>
                      <span className="output-detail" id="out-solar-desc">
                        Optimal setup for {roofArea.toLocaleString("en-IN")} sq.ft.
                      </span>
                    </div>
                    <div className="output-card">
                      <span className="output-label">Annual Utility Savings</span>
                      <div className="output-val-wrapper">
                        <span className="output-value text-green" id="out-savings">
                          {formatSavings(annualSavings)}
                        </span>
                      </div>
                      <span className="output-detail" id="out-saving-percent">
                        Reduces power bill by {savingPercVal}%
                      </span>
                    </div>
                    <div className="output-card">
                      <span className="output-label">Rainwater Harvested</span>
                      <div className="output-val-wrapper">
                        <span className="output-value text-blue" id="out-rainwater">
                          {formatRainwater(annualRainwaterLitres)}
                        </span>
                        <span className="output-unit">Litres/yr</span>
                      </div>
                      <span className="output-detail" id="out-rain-desc">
                        Recharges local borewells
                      </span>
                    </div>
                    <div className="output-card">
                      <span className="output-label">CO2 Carbon Offset</span>
                      <div className="output-val-wrapper">
                        <span className="output-value text-teal" id="out-co2">
                          {co2OffsetTons}
                        </span>
                        <span className="output-unit">Tons/yr</span>
                      </div>
                      <span className="output-detail" id="out-trees">
                        ≈ {treesEquivalent.toLocaleString("en-IN")} trees planted
                      </span>
                    </div>
                  </div>
                  {/* Payback visualization */}
                  <div className="payback-container">
                    <div className="payback-labels">
                      <span>Estimated Payback Period</span>
                      <span className="payback-years" id="out-payback">
                        {paybackYears.toFixed(1)} Years
                      </span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        id="payback-progress"
                        style={{ width: `${roiProgress}%` }}
                      ></div>
                    </div>
                    <span className="payback-hint">
                      Excellent ROI: Green investments generally break even in 3-5 years.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Dashboard Mockup */}
        <section id="dashboard" className="dashboard-section">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Interactive Society Admin Portal</h2>
              <p className="section-subtitle">
                A live mockup of our application interface dashboard. Click on the tabs below to explore different modules.
              </p>
              <div style={{ marginTop: "16px" }}>
                <Link href="/dashboard" className="btn btn-primary btn-md">
                  Open Fully Functional Dashboard &rarr;
                </Link>
              </div>
            </div>

            <div className="dashboard-container glass-panel">
              {/* Dashboard Sidebar/Navigation */}
              <div className="dashboard-sidebar">
                <div className="sidebar-header">
                  <div className="sidebar-logo">
                    <span className="sidebar-logo-dot"></span>
                    <span>Grand Meadows Society</span>
                  </div>
                  <span className="sidebar-role">SOCIETY ADMIN</span>
                </div>
                <div className="sidebar-menu">
                  <button
                    className={`sidebar-menu-btn ${activeTab === "utility" ? "active" : ""}`}
                    onClick={() => setActiveTab("utility")}
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
                    Space allocation
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
                    Vendor RFPs <span className="badge-count">2</span>
                  </button>
                </div>
              </div>

              {/* Dashboard Main Content Screen */}
              <div className="dashboard-content">
                {/* TAB 1: UTILITY ANALYTICS */}
                <div className={`tab-pane ${activeTab === "utility" ? "active" : ""}`}>
                  <div className="tab-header">
                    <div>
                      <h4>Utility Resource Logs</h4>
                      <p className="text-muted">Track monthly bills, resource consumption and target thresholds.</p>
                    </div>
                    <button className="btn btn-primary btn-sm">+ Log Utility Bill</button>
                  </div>

                  <div className="utility-grid">
                    {/* Utility Card 1 */}
                    <div className="util-data-card">
                      <div className="util-data-header">
                        <div className="util-title">
                          <span className="util-badge util-badge-energy">Energy</span>
                          <h5>Electricity Grid</h5>
                        </div>
                        <span className="util-cost">₹1,42,800</span>
                      </div>
                      <div className="util-metric">
                        <span className="metric-val">12,450</span>
                        <span className="metric-unit">kWh</span>
                      </div>
                      <div className="util-progress-section">
                        <div className="progress-labels">
                          <span>Budget Consumption</span>
                          <span>82%</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill progress-energy" style={{ width: "82%" }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Utility Card 2 */}
                    <div className="util-data-card">
                      <div className="util-data-header">
                        <div className="util-title">
                          <span className="util-badge util-badge-water">Water</span>
                          <h5>Ground Water Supply</h5>
                        </div>
                        <span className="util-cost">₹58,400</span>
                      </div>
                      <div className="util-metric">
                        <span className="metric-val">3,82,000</span>
                        <span className="metric-unit">Litres</span>
                      </div>
                      <div className="util-progress-section">
                        <div className="progress-labels">
                          <span>Conservation Limit</span>
                          <span>64%</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill progress-water" style={{ width: "64%" }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Utility Card 3 */}
                    <div className="util-data-card">
                      <div className="util-data-header">
                        <div className="util-title">
                          <span className="util-badge util-badge-waste">Waste</span>
                          <h5>Solid Waste Disposal</h5>
                        </div>
                        <span className="util-cost">₹12,800</span>
                      </div>
                      <div className="util-metric">
                        <span className="metric-val">4,120</span>
                        <span className="metric-unit">kg</span>
                      </div>
                      <div className="util-progress-section">
                        <div className="progress-labels">
                          <span>Recycling Rate</span>
                          <span>74%</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill progress-waste" style={{ width: "74%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mini Chart Representation */}
                  <div className="chart-panel">
                    <div className="chart-header">
                      <h5>Consumption Analysis &amp; Reduction Trends</h5>
                      <span className="chart-badge text-green">-14% vs Last Month</span>
                    </div>
                    <div className="mock-chart">
                      <div className="chart-bars">
                        <div className="bar-col">
                          <div className="bar-fill" style={{ height: "90%" }}></div>
                          <span>May</span>
                        </div>
                        <div className="bar-col">
                          <div className="bar-fill" style={{ height: "82%" }}></div>
                          <span>Jun</span>
                        </div>
                        <div className="bar-col">
                          <div className="bar-fill" style={{ height: "70%" }}></div>
                          <span>Jul (Current)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TAB 2: SPACE ASSET ALLOCATION */}
                <div className={`tab-pane ${activeTab === "space" ? "active" : ""}`}>
                  <div className="tab-header">
                    <div>
                      <h4>Rooftop and Ground Space Management</h4>
                      <p className="text-muted">
                        Analyze your physical environment constraints to project maximum environmental output capacity.
                      </p>
                    </div>
                  </div>

                  <div className="space-columns">
                    <div className="space-info-card">
                      <h5>Rooftop Space Allocation</h5>
                      <div className="space-stats">
                        <div>
                          <span className="label">Total Roof Area</span>
                          <span className="value">15,000 sq.ft.</span>
                        </div>
                        <div>
                          <span className="label">Allocated to Solar</span>
                          <span className="value text-green">6,500 sq.ft. (43%)</span>
                        </div>
                      </div>
                      <div className="space-chart-bar">
                        <div className="segment segment-solar" style={{ width: "43%" }}>
                          Solar
                        </div>
                        <div className="segment segment-greenhouse" style={{ width: "20%" }}>
                          Gardens
                        </div>
                        <div className="segment segment-free" style={{ width: "37%" }}>
                          Unused
                        </div>
                      </div>
                      <ul className="space-list">
                        <li>
                          <span>Solar Panels Installed:</span> <strong>80 kWp (320 panels)</strong>
                        </li>
                        <li>
                          <span>Active Clean Gen:</span> <strong>340 kWh/day</strong>
                        </li>
                      </ul>
                    </div>

                    <div className="space-info-card">
                      <h5>Ground Space Allocation</h5>
                      <div className="space-stats">
                        <div>
                          <span className="label">Total Ground Area</span>
                          <span className="value">8,000 sq.ft.</span>
                        </div>
                        <div>
                          <span className="label">Rainwater Recharge</span>
                          <span className="value text-blue">2,400 sq.ft. (30%)</span>
                        </div>
                      </div>
                      <div className="space-chart-bar">
                        <div className="segment segment-rainwater" style={{ width: "30%" }}>
                          Water Pit
                        </div>
                        <div className="segment segment-compost" style={{ width: "15%" }}>
                          Compost
                        </div>
                        <div className="segment segment-free" style={{ width: "55%" }}>
                          Gardens &amp; Open
                        </div>
                      </div>
                      <ul className="space-list">
                        <li>
                          <span>Rainwater Recharge Shafts:</span> <strong>3 Active Shafts</strong>
                        </li>
                        <li>
                          <span>Organic Composting Capacity:</span> <strong>500 kg/month</strong>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* TAB 3: VENDOR SERVICE RFPs */}
                <div className={`tab-pane ${activeTab === "rfps" ? "active" : ""}`}>
                  <div className="tab-header">
                    <div>
                      <h4>Vendor Service Requests &amp; Proposals</h4>
                      <p className="text-muted">
                        Receive competitive bids from verified green engineering services match-fit for your budget.
                      </p>
                    </div>
                    <button className="btn btn-secondary btn-sm">Create New RFP</button>
                  </div>

                  <div className="rfp-list">
                    {/* RFP Item 1 */}
                    <div className="rfp-item">
                      <div className="rfp-main">
                        <div className="rfp-info">
                          <span className="rfp-status status-bids">3 Bids Received</span>
                          <h5>Solar System Expansion (50 kWp Addon)</h5>
                          <p className="text-muted">
                            Rooftop space ready. Targeting completion by Q4. Budget: ₹12,0,000 max.
                          </p>
                        </div>
                        <div className="rfp-actions">
                          <button className="btn btn-outline btn-sm">View Proposals</button>
                        </div>
                      </div>
                      {/* Embedded bids list */}
                      <div className="rfp-bids">
                        <div className="bid-row">
                          <span>☀️ SunPower Systems</span>
                          <span className="bid-rating">⭐ 4.8 (Verified)</span>
                          <strong className="bid-price">₹10,50,000</strong>
                          <button className="btn btn-primary btn-xs">Accept Bid</button>
                        </div>
                        <div className="bid-row">
                          <span>⚡ ElectroGrid Green</span>
                          <span className="bid-rating">⭐ 4.5 (Verified)</span>
                          <strong className="bid-price">₹11,20,000</strong>
                          <button className="btn btn-primary btn-xs">Accept Bid</button>
                        </div>
                      </div>
                    </div>

                    {/* RFP Item 2 */}
                    <div className="rfp-item">
                      <div className="rfp-main">
                        <div className="rfp-info">
                          <span className="rfp-status status-bids">1 Bid Received</span>
                          <h5>Rainwater Harvesting Re-lining &amp; Maintenance</h5>
                          <p className="text-muted">
                            Periodic maintenance for 2 underground storage tanks and filtration sand beds.
                          </p>
                        </div>
                        <div className="rfp-actions">
                          <button className="btn btn-outline btn-sm">View Proposals</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vendor Marketplace Showcase */}
        <section id="marketplace" className="marketplace-section">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Verified Green Vendor Marketplace</h2>
              <p className="section-subtitle">
                Instantly buy or request quotations from highly rated sustainable technology providers verified by
                system administrators.
              </p>
              <div className="filter-tabs">
                <button
                  className={`filter-btn ${marketplaceFilter === "all" ? "active" : ""}`}
                  onClick={() => setMarketplaceFilter("all")}
                >
                  All Solutions
                </button>
                <button
                  className={`filter-btn ${marketplaceFilter === "solar" ? "active" : ""}`}
                  onClick={() => setMarketplaceFilter("solar")}
                >
                  Solar Energy
                </button>
                <button
                  className={`filter-btn ${marketplaceFilter === "water" ? "active" : ""}`}
                  onClick={() => setMarketplaceFilter("water")}
                >
                  Rainwater Harvesting
                </button>
                <button
                  className={`filter-btn ${marketplaceFilter === "waste" ? "active" : ""}`}
                  onClick={() => setMarketplaceFilter("waste")}
                >
                  Waste Management
                </button>
              </div>
            </div>

            <div className="marketplace-grid grid-3" id="marketplace-grid">
              {filteredServices.map((service) => (
                <div key={service.id} className="market-card" data-category={service.category}>
                  <div className="market-badge">{service.badge}</div>
                  <div className="market-content">
                    <h4>{service.title}</h4>
                    <p className="text-muted">{service.desc}</p>
                    <div className="market-footer">
                      <div className="price-info">
                        <span className="price-label">Starts at</span>
                        <span className="price-value">{service.price}</span>
                      </div>
                      <button className="btn btn-primary btn-sm btn-market">Request Quote</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Callout */}
        <section className="cta-section">
          <div className="container text-center">
            <h2>Ready to Make Your Society Carbon Neutral?</h2>
            <p>
              Register your residential association, schedule a structural audit, and get automated recommendations
              from green vendors.
            </p>
            <div className="cta-buttons">
              <Link href="/dashboard" className="btn btn-primary btn-lg">
                Register Society
              </Link>
              <button className="btn btn-outline btn-lg">Join as Eco-Vendor</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-container">
          <div className="footer-brand">
            <a href="#" className="logo">
              <svg
                className="logo-icon"
                width="24"
                height="24"
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
            </a>
            <p className="brand-tagline">Empowering residential structures for a sustainable, net-zero future.</p>
          </div>
          <div className="footer-links-group">
            <div className="footer-links-col">
              <h6>Platform</h6>
              <a href="#features">Features</a>
              <a href="#calculator">Savings Calculator</a>
              <a href="#dashboard">Admin Demo</a>
              <a href="#marketplace">Eco-Vendors</a>
            </div>
            <div className="footer-links-col">
              <h6>Resources</h6>
              <a href="#">Documentation</a>
              <a href="#">Carbon Standards</a>
              <a href="#">Support Hub</a>
              <a href="#">API Access</a>
            </div>
            <div className="footer-links-col">
              <h6>Company</h6>
              <a href="#">About Us</a>
              <a href="#">Press Kit</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Use</a>
            </div>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>&copy; 2026 EcoSocietyAI. Designed for housing society sustainability. All rights reserved.</p>
          <div className="footer-socials">
            <a href="#" aria-label="Twitter">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" aria-label="GitHub">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
