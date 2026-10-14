"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useTheme } from "@/context/ThemeContext";

// --- Comprehensive In-Depth Utility Model ---
export interface UtilityItem {
  id: string;
  category: "solar" | "water" | "ev" | "waste" | "storage";
  categoryLabel: string;
  title: string;
  vendorName: string;
  city: string;
  rating: number;
  installationsCount: number;
  priceGuide: string;
  estimatedCapexINR: number;
  subsidyEligible: boolean;
  subsidyName?: string;
  subsidyAmountINR?: number;
  netInvestmentINR?: number;
  paybackYears: number;
  monthlySavingsINR: number;
  annualCarbonOffsetTonnes: number;
  warranty: string;
  trustBadge: string;
  targetScale: "Societies (50-200 flats)" | "Townships (200+ flats)" | "Builders & Developers" | "All Properties";
  shortDesc: string;
  overview: string;
  technicalSpecs: { label: string; value: string }[];
  tariffAndFinancials: {
    tariffRate: string;
    annualSavings: string;
    subsidyDetails: string;
    roiSummary: string;
  };
  regulatoryAndNorms: {
    discomPolicy: string;
    municipalIncentive: string;
    standardCertifications: string[];
  };
  sampleCaseStudy: {
    societyScale: string;
    installedSystem: string;
    preBill: string;
    postBill: string;
    resultSummary: string;
  };
}

export const DETAILED_UTILITIES: UtilityItem[] = [
  {
    id: "util-solar-bifacial",
    category: "solar",
    categoryLabel: "Solar PV & Microgrid",
    title: "High-Efficiency Bifacial Mono-PERC Rooftop Solar PV System",
    vendorName: "SunPower CleanTech",
    city: "Pune, Mumbai & Nashik",
    rating: 4.9,
    installationsCount: 42,
    priceGuide: "₹42,000 / kWp installed",
    estimatedCapexINR: 420000,
    subsidyEligible: true,
    subsidyName: "PM Surya Ghar Muft Bijli Yojana (Central Subsidy)",
    subsidyAmountINR: 78000,
    netInvestmentINR: 342000,
    paybackYears: 3.1,
    monthlySavingsINR: 9250,
    annualCarbonOffsetTonnes: 12.8,
    warranty: "25-Year Linear Power Warranty (Tier-1 Standard)",
    trustBadge: "MNRE Empaneled",
    targetScale: "Societies (50-200 flats)",
    shortDesc: "Dual-glass bifacial photovoltaic modules generating up to 25% extra energy via ground reflection. Ideal for common lighting, lifts, and water pumps.",
    overview:
      "Rooftop Solar PV microgrids are the highest-ROI clean utility for residential housing societies and apartment associations. By installing bifacial mono-PERC panels on common terrace roofs, societies capture both direct sunlight and reflective ground albedo radiation, delivering 1,350 to 1,500 kWh clean electricity per month for every 10 kWp installed. Systems are grid-tied under DISCOM net metering, directly offsetting high common-meter commercial tariffs.",
    technicalSpecs: [
      { label: "Module Technology", value: "Tier-1 Dual-Glass Bifacial Mono-PERC (550Wp units)" },
      { label: "Cell Efficiency", value: "21.8% Nominal Module Efficiency" },
      { label: "Inverter", value: "Three-Phase On-Grid String Inverter with Dual MPPT (IP65 rated)" },
      { label: "Mounting Structure", value: "Hot-Dip Galvanized Iron (HDGI 80 microns, 150 km/h wind resistant)" },
      { label: "Terrace Footprint", value: "80 - 100 sq.ft required per 1 kWp installed" },
      { label: "Monitoring", value: "Cloud IoT Gateway with Mobile App Live Telemetry (kWh/day, CO2 offset)" },
      { label: "Net Metering", value: "Bidirectional Generation & Import/Export Meter included" },
    ],
    tariffAndFinancials: {
      tariffRate: "₹9.25 - ₹10.50 per unit (Commercial/Common DISCOM rate)",
      annualSavings: "₹1,11,000 to ₹1,35,000 per 10 kWp annually",
      subsidyDetails: "Eligible for PM Surya Ghar RWA Central Subsidy up to ₹78,000 for residential associations.",
      roiSummary: "Simple financial payback achieved in 3.1 years; yields free green electricity for subsequent 22+ years.",
    },
    regulatoryAndNorms: {
      discomPolicy: "Sanctioned under State Electricity Distribution Net-Metering Regulations (MSEDCL/Tata Power/BESCOM). Fast-track 30-day grid synchronization.",
      municipalIncentive: "Eligible for 5% to 10% lifetime rebate on common property tax under municipal green building bye-laws.",
      standardCertifications: ["MNRE Empaneled Tier-1", "IEC 61215 / IEC 61730 Safety Tested", "ISO 9001 Certified Quality"],
    },
    sampleCaseStudy: {
      societyScale: "Green Meadows CHS (120 flats, Pune)",
      installedSystem: "25 kWp Bifacial Rooftop Solar System",
      preBill: "₹48,500 / month common electricity bill",
      postBill: "₹14,200 / month (70.7% net reduction)",
      resultSummary: "Society saves ₹4,11,600 annually, lowering per-flat monthly maintenance fee by ₹285.",
    },
  },
  {
    id: "util-water-rwh",
    category: "water",
    categoryLabel: "Rainwater & Hydro-Recharge",
    title: "Dual-Chamber Aquifer Hydro-Recharge & Rainwater Harvester",
    vendorName: "AquaFlow Rainwater Solutions",
    city: "Pune, Mumbai, Nashik & Nagpur",
    rating: 4.8,
    installationsCount: 65,
    priceGuide: "₹1,80,000 / recharge shaft unit",
    estimatedCapexINR: 180000,
    subsidyEligible: false,
    paybackYears: 2.1,
    monthlySavingsINR: 7100,
    annualCarbonOffsetTonnes: 2.4,
    warranty: "5-Year Desilting & AMC Guarantee",
    trustBadge: "CGWA Hydro-Certified",
    targetScale: "All Properties",
    shortDesc: "Ground-level filtration chambers and recharge shafts that capture, filter, and direct monsoon runoff into deep borewells, replenishing the local water table.",
    overview:
      "Rapid groundwater depletion forces hundreds of residential communities to spend tens of thousands of rupees on private water tanker procurement each summer. The Dual-Chamber Aquifer Hydro-Recharge utility collects storm and terrace rainwater, channels it through silt traps and multi-layered silica sand beds, and injects clean filtered water directly into depleted groundwater aquifers. This turns drying community borewells back into abundant, self-sustaining water sources.",
    technicalSpecs: [
      { label: "Catchment Capacity", value: "8,000 - 15,000 sq.ft terrace and paved ground area per unit" },
      { label: "Annual Catchment Yield", value: "Up to 6,50,000 Litres clean rainwater per monsoon season" },
      { label: "Filtration Media", value: "Dual Media: Multi-grade Silica Sand (0.5-2mm), River Gravel (5-10mm), Charcoal" },
      { label: "Recharge Shaft", value: "150mm UPVC Slotted Screen casing extending 60 - 100 ft into aquifer strata" },
      { label: "Silt Trapping", value: "Automatic dual-chamber desanding settlement pit with overflow bypass" },
      { label: "Water Quality", value: "Removes 99% suspended solids, turbidity < 2 NTU" },
    ],
    tariffAndFinancials: {
      tariffRate: "Displaces private commercial water tankers costing ₹800 - ₹1,400 per 10,000L tanker",
      annualSavings: "₹65,000 - ₹1,20,000 saved per year in avoided summer tanker costs",
      subsidyDetails: "Municipal property tax rebate eligible; mandatory for building completion certification (OC).",
      roiSummary: "Rapid payback within 2.1 years due to immediate reduction in private tanker billing during dry months.",
    },
    regulatoryAndNorms: {
      discomPolicy: "Mandatory compliance under Central Ground Water Authority (CGWA) guidelines for residential plots > 300 m².",
      municipalIncentive: "Mandatory for Occupancy Certificate; saves up to 5% on municipal water cess.",
      standardCertifications: ["CGWA Hydrogeological Approved", "IS 15797:2008 Rainwater Standards", "Municipal Corporation Empaneled"],
    },
    sampleCaseStudy: {
      societyScale: "Sunrise Eco Heights (80 flats, Thane)",
      installedSystem: "2x Aquifer Recharge Shafts (12,000 sq.ft catchment)",
      preBill: "₹1,40,000 spent on summer tankers (March - June)",
      postBill: "₹18,000 spent on tankers (87% tanker reduction)",
      resultSummary: "Society borewell output doubled, remaining productive throughout the harsh May summer.",
    },
  },
  {
    id: "util-water-metering",
    category: "water",
    categoryLabel: "Smart Water Metering & IoT",
    title: "LoRaWAN Ultrasonic Smart Water Metering & Automated Leak Detection",
    vendorName: "PureStream Labs IoT",
    city: "National (Pan-India)",
    rating: 4.7,
    installationsCount: 28,
    priceGuide: "₹3,200 / flat meter point",
    estimatedCapexINR: 256000,
    subsidyEligible: false,
    paybackYears: 1.4,
    monthlySavingsINR: 15200,
    annualCarbonOffsetTonnes: 1.8,
    warranty: "3-Year Complete Replacement Warranty",
    trustBadge: "MID Water Meter Norms",
    targetScale: "Societies (50-200 flats)",
    shortDesc: "Automated consumption monitoring with resident mobile app tracking, instant burst alerts, and fair per-flat billing that ends maintenance fee disputes.",
    overview:
      "In traditional housing societies without sub-metering, water costs are divided equally among all flats regardless of actual consumption, penalizing conservative users and ignoring hidden pipe leakages. The LoRaWAN Smart Water Metering utility installs ultrasonic transit-time meters on inlet lines for each apartment. Wireless long-range radio transmits hourly readings to a central society portal, identifying leaking toilet flushes within minutes and generating fair, transparent flat-wise consumption invoices.",
    technicalSpecs: [
      { label: "Measurement Principle", value: "Ultrasonic Transit-Time (zero moving parts, immune to silt/sand jamming)" },
      { label: "Accuracy Class", value: "Class 2 / R160 (Meets MID European & ISO 4064 Metrology standards)" },
      { label: "Wireless Protocol", value: "LoRaWAN 865 - 867 MHz (Deep building penetration up to 3 floors underground)" },
      { label: "Battery Life", value: "10+ Years internal Lithium Thionyl Chloride (Li-SOCl2) battery" },
      { label: "Protection Rating", value: "IP68 Submersible (withstands continuous flooded pipe shafts)" },
      { label: "Leak Detection", value: "Continuous flow alert (> 2 hours continuous run triggers resident SMS/app alert)" },
    ],
    tariffAndFinancials: {
      tariffRate: "Societies transitioning from flat-fee billing to pay-per-use consumption",
      annualSavings: "Reduces overall community water consumption and tanker bills by 28% to 35%",
      subsidyDetails: "Private society capex; self-funds in under 18 months via avoided wastage and detected leaks.",
      roiSummary: "Average society recovers total investment in 1.4 years solely from reduced water tanker deliveries.",
    },
    regulatoryAndNorms: {
      discomPolicy: "Complies with Indian Telecommunications WPC License-Exempt Frequency Norms for LoRaWAN (865 MHz).",
      municipalIncentive: "Aligns with National Water Mission guidelines for 20% water conservation in urban communities.",
      standardCertifications: ["ISO 4064 International Water Meter Standard", "IP68 Submersible Enclosure", "WPC Approved Radio"],
    },
    sampleCaseStudy: {
      societyScale: "Horizon Greens CHS (100 flats, Bengaluru)",
      installedSystem: "100x LoRaWAN Ultrasonic Meters + Gateway",
      preBill: "1,20,000 Litres daily community consumption",
      postBill: "86,000 Litres daily community consumption (28.3% cut)",
      resultSummary: "Detected 9 continuously leaking concealed flushes in Week 1, saving 18 tanker loads every month.",
    },
  },
  {
    id: "util-ev-charging",
    category: "ev",
    categoryLabel: "EV Fast Charging Hubs",
    title: "Society Fast EV Charging Station Hub (Type-2 AC 7.4 - 22kW)",
    vendorName: "VoltCharge Systems",
    city: "Delhi NCR, Mumbai, Pune & Bengaluru",
    rating: 4.9,
    installationsCount: 34,
    priceGuide: "₹48,000 / charging gun point",
    estimatedCapexINR: 192000,
    subsidyEligible: true,
    subsidyName: "State EV Infrastructure Incentive",
    subsidyAmountINR: 30000,
    netInvestmentINR: 162000,
    paybackYears: 2.8,
    monthlySavingsINR: 4800,
    annualCarbonOffsetTonnes: 9.6,
    warranty: "3-Year All-Inclusive Comprehensive AMC",
    trustBadge: "ARAI Approved",
    targetScale: "All Properties",
    shortDesc: "Commercial grade EV chargers with automated resident RFID / UPI QR billing, dynamic load balancing, and dedicated electricity accounting.",
    overview:
      "Electric Vehicle adoption in Indian cities is surging, but resident parking slots often lack sanctioned power cables, and haphazard extension cords create dangerous fire and transformer overloading risks. The VoltCharge Society EV Hub installs shared commercial Type-2 AC chargers in common parking areas. Members scan a QR code to charge via UPI, and the system automatically balances power draw against common transformer loads, crediting electricity payments back to the society account.",
    technicalSpecs: [
      { label: "Charger Type", value: "Type-2 AC IEC 62196-2 Gun (Single-Phase 7.4kW or Three-Phase 22kW)" },
      { label: "Communication", value: "OCPP 1.6J Open Protocol over 4G/WiFi with Over-the-Air (OTA) updates" },
      { label: "Payment Gateway", value: "Direct UPI (PhonePe, GPay, Paytm) + Society Resident RFID Cards" },
      { label: "Electrical Safety", value: "Built-in Type-B RCD (30mA AC / 6mA DC leakage protection) + SPD" },
      { label: "Load Balancing", value: "Dynamic load management (throttles EV charging during peak lift/pump usage)" },
      { label: "Enclosure", value: "IP54 Outdoor Weatherproof + IK10 Vandal-Resistant Metal Body" },
    ],
    tariffAndFinancials: {
      tariffRate: "EV Tariff rate ₹7.50/unit; society recovers ₹10.50/unit from users (₹3.00/unit society margin)",
      annualSavings: "Provides ₹57,000 recurring revenue to society while saving members 65% vs petrol costs",
      subsidyDetails: "Qualifies for State EV Infrastructure subsidy in Maharashtra, Delhi, and Karnataka.",
      roiSummary: "Recovers initial investment in 2.8 years via convenience margin and state capital incentives.",
    },
    regulatoryAndNorms: {
      discomPolicy: "Complies with Ministry of Power EV Charging Infrastructure Guidelines. Separate EV meter connection supported.",
      municipalIncentive: "Mandatory under municipal building rules: 20% of all parking bays must be EV charging ready.",
      standardCertifications: ["ARAI Certified AIS 138-1", "OCPP 1.6J Security Validated", "CE Certified Hardware"],
    },
    sampleCaseStudy: {
      societyScale: "Apex Towers (180 flats, Pune)",
      installedSystem: "4x 7.4kW Type-2 AC EV Charging Bays",
      preBill: "0 EV chargers; residents running loose extension cables",
      postBill: "24 EV owners charging seamlessly on automated UPI",
      resultSummary: "Eliminated fire hazards, compliant with municipal 20% mandate, earns ₹4,800/mo net profit for RWA.",
    },
  },
  {
    id: "util-waste-owc",
    category: "waste",
    categoryLabel: "Solid Waste & Biogas",
    title: "Zero-Odor Aerobic Organic Waste Converter (OWC-150 / 300)",
    vendorName: "EcoTerra Bio-Engineering",
    city: "Bengaluru, Chennai, Pune & Hyderabad",
    rating: 4.7,
    installationsCount: 51,
    priceGuide: "₹2,80,000 (150 kg/day machine)",
    estimatedCapexINR: 280000,
    subsidyEligible: false,
    paybackYears: 3.5,
    monthlySavingsINR: 6700,
    annualCarbonOffsetTonnes: 14.5,
    warranty: "5-Year SS-304 Stainless Steel Chamber Warranty",
    trustBadge: "CPCB Compliant",
    targetScale: "Societies (50-200 flats)",
    shortDesc: "Processes raw food and kitchen waste into high-grade organic manure in 24 hours using bacterial microbial consortium and moisture sensors.",
    overview:
      "Municipal corporations across India now penalize bulk waste generators (societies generating over 100 kg of waste daily) that do not segregate and process organic waste in-situ. The Zero-Odor OWC machine takes kitchen peelings, leftover food, and garden leaves, shreds them, and maintains optimal aerobic bacterial temperature and moisture. Within 24 hours, wet kitchen garbage is converted into nutrient-dense, odorless organic manure for the society's landscape gardens.",
    technicalSpecs: [
      { label: "Daily Processing Capacity", value: "100 kg to 300 kg wet kitchen waste per day" },
      { label: "Cycle Duration", value: "24 Hours automated aerobic thermophilic digestion" },
      { label: "Chamber Material", value: "SS-304 Heavy-Duty Stainless Steel (Acid and corrosion proof)" },
      { label: "Volume Reduction", value: "85% to 90% volume reduction into dry organic manure" },
      { label: "Power Consumption", value: "3.5 kWh per 100 kg batch (~₹32 electricity cost per cycle)" },
      { label: "Odor Control", value: "Forced draft bio-filter with activated carbon and microbial biocatalyst" },
    ],
    tariffAndFinancials: {
      tariffRate: "Avoids municipal non-compliance penalties of ₹5,000 to ₹25,000/month for bulk generators",
      annualSavings: "₹80,000+ saved annually in municipal waste cess and purchased garden fertilizers",
      subsidyDetails: "Enables societies to receive 5-star Swachh Society certification and property tax discounts.",
      roiSummary: "Payback achieved in 3.5 years through penalty elimination and internal manure utilization.",
    },
    regulatoryAndNorms: {
      discomPolicy: "Fulfills Solid Waste Management (SWM) Rules 2016 for residential communities > 100 flats.",
      municipalIncentive: "Required for municipal green ratings; qualifies for municipal rebate on sanitation cess.",
      standardCertifications: ["CPCB Emission Standards Compliant", "ISO 14001 Environmental Standard", "CE Electrical Safety"],
    },
    sampleCaseStudy: {
      societyScale: "Palm Grove Residency (150 flats, Bengaluru)",
      installedSystem: "OWC-150 (150 kg/day capacity)",
      preBill: "₹12,000 / month municipal waste cess + ₹4,000 garden manure purchases",
      postBill: "₹1,200 / month operating electricity; zero waste cess",
      resultSummary: "Produces 450 kg organic manure monthly for clubhouse gardens; awarded 5-Star Clean Society Award.",
    },
  },
  {
    id: "util-storage-bess",
    category: "storage",
    categoryLabel: "Battery Energy Storage (BESS)",
    title: "Modular Lithium Ferro Phosphate Battery Storage (30kWh BESS)",
    vendorName: "PowerVault Clean Energy",
    city: "Mumbai, Bengaluru & Hyderabad",
    rating: 4.8,
    installationsCount: 12,
    priceGuide: "₹18,000 / kWh capacity",
    estimatedCapexINR: 540000,
    subsidyEligible: false,
    paybackYears: 4.2,
    monthlySavingsINR: 10800,
    annualCarbonOffsetTonnes: 8.2,
    warranty: "10-Year Performance Warranty (6,000 Cycles)",
    trustBadge: "UL 9540A Fire-Safe",
    targetScale: "Townships (200+ flats)",
    shortDesc: "Buffers daytime solar surplus to power evening corridor lights, elevators, and pumps without costly diesel generator burn or peak DISCOM tariffs.",
    overview:
      "When housing societies generate excess solar energy during mid-day peak sun hours, net-metering credits from DISCOMs are often credited at low wholesale rates, while common areas draw electricity at high evening peak tariff rates. The PowerVault BESS utility stores surplus daytime solar energy in non-flammable Lithium Ferro Phosphate (LiFePO4) battery racks. During evening peak hours or power outages, it powers common elevators and water pumps with zero noise, zero smoke, and zero expensive diesel generator burn.",
    technicalSpecs: [
      { label: "Chemistry", value: "Lithium Ferro Phosphate (LiFePO4 - thermally stable, zero fire hazard)" },
      { label: "Usable Capacity", value: "30 kWh to 100 kWh modular rack configuration" },
      { label: "Cycle Life", value: "6,000 Cycles at 90% Depth of Discharge (DOD) ~ 15-year operational life" },
      { label: "Transfer Time", value: "10 Milliseconds (Seamless UPS transfer; elevators & pumps do not trip)" },
      { label: "Inverter Compatibility", value: "Works with all standard three-phase hybrid inverters (48V to 400V DC)" },
      { label: "Safety System", value: "Multi-point Aerosol fire suppression + Cloud Battery Management System (BMS)" },
    ],
    tariffAndFinancials: {
      tariffRate: "Arbitrages between ₹4.50 solar cost and ₹11.50 evening peak grid rate; displaces ₹32/unit diesel",
      annualSavings: "₹1,30,000 / year in reduced evening grid import and eliminated diesel generator runs",
      subsidyDetails: "Accelerated depreciation eligible for commercial/builder projects.",
      roiSummary: "Payback in 4.2 years with complete elimination of diesel generator maintenance and fuel costs.",
    },
    regulatoryAndNorms: {
      discomPolicy: "Complies with CEA (Central Electricity Authority) Technical Standards for Grid Connectivity.",
      municipalIncentive: "Contributes to zero-emission building mandates by replacing polluting diesel gensets.",
      standardCertifications: ["UL 9540A Thermal Runaway Tested", "IEC 62619 Industrial Battery Safety", "UN 38.3 Transport Tested"],
    },
    sampleCaseStudy: {
      societyScale: "Skyline Green Towers (220 flats, Mumbai)",
      installedSystem: "45 kWh LiFePO4 BESS integrated with 50kWp Solar",
      preBill: "₹28,000 / month spent on diesel fuel during load-shedding",
      postBill: "₹0 spent on diesel; 100% clean solar battery backup",
      resultSummary: "Zero diesel fumes in basement parking, zero noise complaints, saves ₹3,36,000 every year.",
    },
  },
  {
    id: "util-waste-biogas",
    category: "waste",
    categoryLabel: "Solid Waste & Biogas",
    title: "Community Anaerobic Biogas Digestor Plant (5m³)",
    vendorName: "GreenMethane Tech",
    city: "Pune, Gujarat & Bengaluru",
    rating: 4.7,
    installationsCount: 18,
    priceGuide: "₹3,10,000 turnkey setup",
    estimatedCapexINR: 310000,
    subsidyEligible: true,
    subsidyName: "SATAT Central Bio-Energy Initiative",
    subsidyAmountINR: 45000,
    netInvestmentINR: 265000,
    paybackYears: 3.1,
    monthlySavingsINR: 7200,
    annualCarbonOffsetTonnes: 11.2,
    warranty: "5-Year FRP Digestor Dome Warranty",
    trustBadge: "Zero Odor Tech",
    targetScale: "Societies (50-200 flats)",
    shortDesc: "Converts kitchen food waste into clean methane cooking gas for clubhouse canteens or water heaters, eliminating commercial LPG cylinder costs.",
    overview:
      "Rather than treating food scraps as garbage, anaerobic digestion captures clean, pressurized methane fuel. The 5 Cubic Meter community biogas utility digests 50 to 75 kg of food waste daily from apartment kitchens. The generated biogas is scrubbed of moisture and hydrogen sulfide, pressurized, and piped directly to the community clubhouse kitchen or swimming pool water heaters, replacing expensive commercial LPG cylinders.",
    technicalSpecs: [
      { label: "Digestor Volume", value: "5 Cubic Meter (m³) floating dome anaerobic digester" },
      { label: "Daily Input Waste", value: "50 kg to 75 kg crushed raw and cooked food waste" },
      { label: "Daily Gas Output", value: "4 to 5 m³ clean methane gas (~ equivalent to 2kg commercial LPG/day)" },
      { label: "Gas Pressure", value: "Regulated to 20 - 50 mbar for standard gas stoves and boilers" },
      { label: "By-Product Slurry", value: "Produces 50L/day rich liquid bio-fertilizer for society trees" },
      { label: "Safety Controls", value: "In-line flame arrestor + automated pressure relief valve" },
    ],
    tariffAndFinancials: {
      tariffRate: "Replaces commercial 19kg LPG cylinders costing ₹1,850 - ₹2,100 each",
      annualSavings: "₹86,400 saved annually on clubhouse cooking fuel and swimming pool heaters",
      subsidyDetails: "Eligible for Ministry of New and Renewable Energy (MNRE) decentralized biogas subsidies.",
      roiSummary: "Simple payback in 3.1 years based on direct fuel substitution.",
    },
    regulatoryAndNorms: {
      discomPolicy: "Fulfills CPCB solid waste processing rules without drawing high electric motor power.",
      municipalIncentive: "Qualifies society for Swachh Survekshan sanitation award credits.",
      standardCertifications: ["PESO Safety Norms Compliant", "CPCB Methane Capture Guidelines", "ISO 9001 Approved"],
    },
    sampleCaseStudy: {
      societyScale: "Silver Oaks CHS (140 flats, Pune)",
      installedSystem: "5m³ Floating Dome Digester + Biogas Kitchen Line",
      preBill: "4x Commercial LPG cylinders/month for clubhouse canteen (₹7,800/mo)",
      postBill: "0 LPG cylinders purchased; 100% biogas powered kitchen",
      resultSummary: "Society diverts 2 tonnes of wet kitchen waste from landfills every month, saving ₹93,600/year.",
    },
  },
];

export default function MarketplacePage() {
  const { isDark } = useTheme();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedScale, setSelectedScale] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "payback-asc" | "carbon-desc">("featured");

  // Detail Modal State
  const [selectedUtility, setSelectedUtility] = useState<UtilityItem | null>(null);
  const [detailTab, setDetailTab] = useState<"specs" | "financials" | "regulatory" | "case-study" | "quote">("specs");

  // Quote Request Form States (within Modal)
  const [quoteSocietyName, setQuoteSocietyName] = useState("");
  const [quoteContactPhone, setQuoteContactPhone] = useState("");
  const [quoteFlats, setQuoteFlats] = useState<number>(100);
  const [quoteCity, setQuoteCity] = useState("Pune");
  const [quoteNotes, setQuoteNotes] = useState("");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Filtered & Sorted Utilities
  const filteredUtilities = useMemo(() => {
    return DETAILED_UTILITIES.filter((u) => {
      const matchesCat = selectedCategory === "all" || u.category === selectedCategory;
      const matchesScale = selectedScale === "all" || u.targetScale === selectedScale || u.targetScale === "All Properties";
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        u.title.toLowerCase().includes(q) ||
        u.vendorName.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.categoryLabel.toLowerCase().includes(q) ||
        u.shortDesc.toLowerCase().includes(q) ||
        u.trustBadge.toLowerCase().includes(q);

      return matchesCat && matchesScale && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === "price-asc") return a.estimatedCapexINR - b.estimatedCapexINR;
      if (sortBy === "payback-asc") return a.paybackYears - b.paybackYears;
      if (sortBy === "carbon-desc") return b.annualCarbonOffsetTonnes - a.annualCarbonOffsetTonnes;
      return b.rating - a.rating;
    });
  }, [searchQuery, selectedCategory, selectedScale, sortBy]);

  const handleOpenDetailModal = (u: UtilityItem, defaultTab: "specs" | "quote" = "specs") => {
    setSelectedUtility(u);
    setDetailTab(defaultTab);
    setQuoteSubmitted(false);
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
  };

  return (
    <>
      <Navbar activeView="marketplace" />

      <main style={{ minHeight: "100vh", background: "var(--bg-color)", backgroundImage: "var(--bg-gradient)", padding: "40px 24px 80px 24px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>

          {/* Breadcrumb Navigation */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "16px" }}>
            <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <span style={{ color: "var(--primary)", fontWeight: 700 }}>Clean Utilities Marketplace</span>
          </div>

          {/* Hero Banner Header */}
          <div
            className="glass-panel"
            style={{
              padding: "36px 32px",
              borderRadius: "20px",
              marginBottom: "32px",
              border: "1px solid var(--card-border)",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)",
            }}
          >
            <div style={{ maxWidth: "860px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10B981",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  marginBottom: "12px",
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }} />
                VERIFIED SUSTAINABLE UTILITIES &amp; TURNKEY EPCS
              </div>

              <h1 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0 0 12px 0", color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
                Smart Utilities &amp; Clean Technology Marketplace
              </h1>

              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.6 }}>
                Search, evaluate technical specifications, assess DISCOM tariffs, calculate return on investment, and request verified turnkey quotations for rooftop solar PV, rainwater harvesting, smart water metering, EV charging, and solid waste converters.
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--card-border)" }}>
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Verified Turnkey Utilities</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)" }}>{DETAILED_UTILITIES.length} Solutions</div>
              </div>
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Average ROI Payback</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#10B981" }}>2.8 Years</div>
              </div>
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Central Capital Subsidy</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#F59E0B" }}>Up to ₹78,000</div>
              </div>
              <div>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Contractor Compliance</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#06B6D4" }}>100% MNRE / CGWA</div>
              </div>
            </div>
          </div>

          {/* Search, Filter & Sizing Controls */}
          <div
            className="glass-panel"
            style={{
              padding: "20px 24px",
              borderRadius: "16px",
              marginBottom: "28px",
              border: "1px solid var(--card-border)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Top Row: Search Input & Sort Dropdown */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ flex: 1, minWidth: "280px", position: "relative" }}>
                <input
                  type="text"
                  placeholder="Search by utility name, technical keywords (bifacial, LoRaWAN, OWC, LFP, kWh), vendor, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px 18px 12px 42px",
                    borderRadius: "10px",
                    border: "1px solid var(--card-border)",
                    fontSize: "0.92rem",
                    outline: "none",
                  }}
                />
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--text-secondary)" }}>Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1px solid var(--card-border)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <option value="featured">⭐ Top Rated &amp; Verified</option>
                  <option value="payback-asc">⚡ Fastest Payback Period</option>
                  <option value="price-asc">₹ Lowest Estimated Cost</option>
                  <option value="carbon-desc">🌱 Highest Carbon Abatement</option>
                </select>
              </div>
            </div>

            {/* Bottom Row: Category Pills & Scale Filter */}
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "12px", paddingTop: "12px", borderTop: "1px solid var(--card-border)" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {[
                  { key: "all", label: "All Utilities" },
                  { key: "solar", label: "☀️ Solar PV & Microgrid" },
                  { key: "water", label: "💧 Rainwater & Hydro-Recharge" },
                  { key: "ev", label: "🚗 EV Fast Charging Hubs" },
                  { key: "waste", label: "♻️ Waste & Biogas" },
                  { key: "storage", label: "🔋 Battery Storage (BESS)" },
                ].map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setSelectedCategory(c.key)}
                    className={`filter-btn ${selectedCategory === c.key ? "active" : ""}`}
                    style={{ padding: "6px 14px", fontSize: "0.82rem", borderRadius: "20px" }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Target Scale:</span>
                <select
                  value={selectedScale}
                  onChange={(e) => setSelectedScale(e.target.value)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  <option value="all">All Scale Sizes</option>
                  <option value="Societies (50-200 flats)">Societies (50-200 flats)</option>
                  <option value="Townships (200+ flats)">Townships (200+ flats)</option>
                  <option value="Builders & Developers">Builders &amp; Developers</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count Summary */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "0.88rem", color: "var(--text-muted)", fontWeight: 600 }}>
              Showing <strong>{filteredUtilities.length}</strong> verified clean utility solutions
            </span>

            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                style={{ background: "none", border: "none", color: "#10B981", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}
              >
                Clear Search Filter ✕
              </button>
            )}
          </div>

          {/* Utilities Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px" }}>
            {filteredUtilities.map((item) => (
              <div
                key={item.id}
                className="market-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  borderRadius: "16px",
                  padding: "24px",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
              >
                <div>
                  {/* Top Header Pill */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                    <span className="market-badge" style={{ fontSize: "0.74rem" }}>
                      {item.categoryLabel}
                    </span>
                    <span style={{ fontSize: "0.75rem", padding: "3px 9px", borderRadius: "12px", background: "rgba(245, 158, 11, 0.15)", color: "#F59E0B", fontWeight: 700 }}>
                      ⭐ {item.rating} ({item.installationsCount}+ Sites)
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.18rem", fontWeight: 800, margin: "0 0 6px 0", color: "var(--text-primary)", lineHeight: 1.35 }}>
                    {item.title}
                  </h3>

                  {/* Vendor & Trust Credentials */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--primary)" }}>
                      {item.vendorName}
                    </span>
                    <span style={{ fontSize: "0.7rem", padding: "1px 7px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", fontWeight: 700 }}>
                      {item.trustBadge}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: "0 0 16px 0" }}>
                    {item.shortDesc}
                  </p>

                  {/* Key Highlights Table */}
                  <div
                    style={{
                      background: "var(--card-bg)",
                      borderRadius: "10px",
                      padding: "12px 14px",
                      border: "1px solid var(--card-border)",
                      marginBottom: "16px",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "10px",
                      fontSize: "0.78rem",
                    }}
                  >
                    <div>
                      <span style={{ color: "var(--text-muted)", display: "block" }}>Typical Payback</span>
                      <strong style={{ color: "#10B981", fontSize: "0.92rem" }}>{item.paybackYears} Years</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)", display: "block" }}>Est. Monthly Savings</span>
                      <strong style={{ color: "var(--text-primary)", fontSize: "0.92rem" }}>₹{item.monthlySavingsINR.toLocaleString("en-IN")}/mo</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)", display: "block" }}>Carbon Abatement</span>
                      <strong style={{ color: "#06B6D4", fontSize: "0.92rem" }}>{item.annualCarbonOffsetTonnes} Tonnes CO₂/yr</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--text-muted)", display: "block" }}>Central Subsidy</span>
                      <strong style={{ color: item.subsidyEligible ? "#F59E0B" : "var(--text-muted)", fontSize: "0.92rem" }}>
                        {item.subsidyEligible ? "Eligible (PM Surya)" : "Commercial"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{ paddingTop: "14px", borderTop: "1px solid var(--card-border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
                  <div>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "block" }}>Price Guide</span>
                    <strong style={{ fontSize: "1.05rem", color: "var(--text-primary)" }}>{item.priceGuide}</strong>
                  </div>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleOpenDetailModal(item, "specs")}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "0.8rem", padding: "8px 12px" }}
                    >
                      In-Depth Info ℹ️
                    </button>
                    <button
                      onClick={() => handleOpenDetailModal(item, "quote")}
                      className="btn btn-primary btn-sm"
                      style={{ fontSize: "0.8rem", padding: "8px 14px" }}
                    >
                      Request Quote
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUtilities.length === 0 && (
            <div className="glass-panel" style={{ textAlign: "center", padding: "60px 24px", borderRadius: "16px", marginTop: "24px" }}>
              <h3>No matching utilities found</h3>
              <p style={{ color: "var(--text-muted)", maxWidth: "460px", margin: "8px auto 20px auto" }}>
                We couldn't find any clean utility matching &quot;{searchQuery}&quot;. Try clearing your search term or select &quot;All Utilities&quot;.
              </p>
              <button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} className="btn btn-primary btn-sm">
                Reset Filters
              </button>
            </div>
          )}

          {/* Builder & Vendor Ecosystem Banner */}
          <div
            className="glass-panel"
            style={{
              marginTop: "56px",
              padding: "36px",
              borderRadius: "16px",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "24px",
            }}
          >
            <div>
              <span style={{ fontSize: "0.72rem", padding: "3px 9px", borderRadius: "4px", background: "#10B981", color: "#FFFFFF", fontWeight: 800, letterSpacing: "0.5px" }}>
                FOR GREEN EPCs &amp; REAL ESTATE BUILDERS
              </span>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "8px 0 4px 0", color: "var(--text-primary)" }}>
                Want to list your clean tech hardware or issue developer project tenders?
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0, maxWidth: "700px" }}>
                Verified contractors can publish offerings and reply to tenders. Real estate builders can manage project green mandates and dispatch tenders in the dedicated <strong>Vendor &amp; Builder Hub</strong>.
              </p>
            </div>

            <Link href="/portal" className="btn btn-primary btn-md" style={{ flexShrink: 0 }}>
              Open Vendor &amp; Builder Hub →
            </Link>
          </div>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* IN-DEPTH UTILITY DETAIL MODAL (MULTI-TAB) */}
      {/* ========================================================================= */}
      {selectedUtility && (
        <div className="modal-backdrop" onClick={() => setSelectedUtility(null)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "840px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "36px",
              borderRadius: "20px",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedUtility(null)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "none",
                border: "none",
                fontSize: "1.3rem",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              ✕
            </button>

            {/* Modal Header */}
            <div style={{ marginBottom: "20px", paddingRight: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <span className="market-badge">{selectedUtility.categoryLabel}</span>
                <span style={{ fontSize: "0.75rem", padding: "2px 8px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", fontWeight: 700 }}>
                  {selectedUtility.trustBadge}
                </span>
                <span style={{ fontSize: "0.75rem", color: "#F59E0B", fontWeight: 700 }}>
                  ⭐ {selectedUtility.rating} ({selectedUtility.installationsCount}+ completed sites)
                </span>
              </div>

              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 6px 0", color: "var(--text-primary)" }}>
                {selectedUtility.title}
              </h2>

              <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", margin: 0 }}>
                Provided &amp; Commissioned by <strong>{selectedUtility.vendorName}</strong> ({selectedUtility.city})
              </p>
            </div>

            {/* In-Depth Navigation Tabs */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                borderBottom: "1px solid var(--card-border)",
                paddingBottom: "12px",
                marginBottom: "24px",
                overflowX: "auto",
              }}
            >
              {[
                { key: "specs", label: "Technical Architecture" },
                { key: "financials", label: "Tariffs, Subsidy & ROI" },
                { key: "regulatory", label: "DISCOM & Municipal Norms" },
                { key: "case-study", label: "Sample Society Audit" },
                { key: "quote", label: "Request Turnkey Quote" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setDetailTab(t.key as any)}
                  className={`filter-btn ${detailTab === t.key ? "active" : ""}`}
                  style={{ padding: "8px 16px", fontSize: "0.82rem", whiteSpace: "nowrap" }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* TAB 1: TECHNICAL SPECS & ARCHITECTURE */}
            {detailTab === "specs" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "10px", color: "var(--text-primary)" }}>
                  Operational Overview
                </h4>
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "20px" }}>
                  {selectedUtility.overview}
                </p>

                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "12px", color: "var(--text-primary)" }}>
                  Engineering &amp; Hardware Specifications
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                  {selectedUtility.technicalSpecs.map((spec, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "10px",
                        background: "var(--card-bg)",
                        border: "1px solid var(--card-border)",
                      }}
                    >
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>{spec.label}</span>
                      <strong style={{ fontSize: "0.88rem", color: "var(--text-primary)" }}>{spec.value}</strong>
                    </div>
                  ))}
                </div>

                <div style={{ padding: "14px 18px", borderRadius: "10px", background: "rgba(16, 185, 129, 0.08)", border: "1px solid rgba(16, 185, 129, 0.25)" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10B981", marginBottom: "2px" }}>
                    Warranty &amp; Service Assurance
                  </div>
                  <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", margin: 0 }}>
                    {selectedUtility.warranty}. Includes routine scheduled audits, telemetric inverter checkups, and zero-downtime maintenance.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: TARIFFS & FINANCIAL PAYBACK */}
            {detailTab === "financials" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)" }}>
                  Financial Sizing &amp; DISCOM Tariff Arbitrage
                </h4>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ padding: "16px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                    <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Estimated Turnkey CAPEX</span>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-primary)", margin: "4px 0" }}>
                      ₹{selectedUtility.estimatedCapexINR.toLocaleString("en-IN")}
                    </div>
                    <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>Includes procurement &amp; installation</span>
                  </div>

                  <div style={{ padding: "16px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                    <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Capital Subsidy</span>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: selectedUtility.subsidyEligible ? "#F59E0B" : "var(--text-muted)", margin: "4px 0" }}>
                      {selectedUtility.subsidyEligible ? `₹${selectedUtility.subsidyAmountINR?.toLocaleString("en-IN")}` : "Direct RWA Capex"}
                    </div>
                    <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{selectedUtility.subsidyName || "State/Municipal Norm"}</span>
                  </div>

                  <div style={{ padding: "16px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                    <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Annual Savings</span>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#10B981", margin: "4px 0" }}>
                      ₹{(selectedUtility.monthlySavingsINR * 12).toLocaleString("en-IN")}/yr
                    </div>
                    <span style={{ fontSize: "0.76rem", color: "#10B981", fontWeight: 700 }}>Recurring utility cost reduction</span>
                  </div>

                  <div style={{ padding: "16px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                    <span style={{ fontSize: "0.74rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Simple Payback Period</span>
                    <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#06B6D4", margin: "4px 0" }}>
                      {selectedUtility.paybackYears} Years
                    </div>
                    <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>Free clean service for 20+ years</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "var(--card-bg)", padding: "20px", borderRadius: "12px", border: "1px solid var(--card-border)" }}>
                  <div>
                    <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>Grid Tariff Rate:</strong>{" "}
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{selectedUtility.tariffAndFinancials.tariffRate}</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>Annual Financial Impact:</strong>{" "}
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{selectedUtility.tariffAndFinancials.annualSavings}</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>Subsidy &amp; Rebate Scheme:</strong>{" "}
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{selectedUtility.tariffAndFinancials.subsidyDetails}</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)" }}>ROI Guarantee:</strong>{" "}
                    <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{selectedUtility.tariffAndFinancials.roiSummary}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: REGULATORY & DISCOM NORMS */}
            {detailTab === "regulatory" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "14px", color: "var(--text-primary)" }}>
                  Regulatory Compliance &amp; DISCOM Interconnection
                </h4>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  <div style={{ padding: "16px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#10B981", marginBottom: "4px" }}>
                      ⚡ DISCOM &amp; Utility Interconnection Policy:
                    </div>
                    <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                      {selectedUtility.regulatoryAndNorms.discomPolicy}
                    </p>
                  </div>

                  <div style={{ padding: "16px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)" }}>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#06B6D4", marginBottom: "4px" }}>
                      🏛️ Municipal Corporation Rebates &amp; Statutory Bye-Laws:
                    </div>
                    <p style={{ fontSize: "0.86rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                      {selectedUtility.regulatoryAndNorms.municipalIncentive}
                    </p>
                  </div>

                  <div>
                    <strong style={{ fontSize: "0.86rem", color: "var(--text-primary)", display: "block", marginBottom: "8px" }}>
                      Certified Technical &amp; Safety Standards:
                    </strong>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {selectedUtility.regulatoryAndNorms.standardCertifications.map((cert, i) => (
                        <span key={i} style={{ fontSize: "0.78rem", padding: "4px 10px", borderRadius: "6px", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", fontWeight: 700 }}>
                          ✓ {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SAMPLE SOCIETY AUDIT CASE STUDY */}
            {detailTab === "case-study" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "14px", color: "var(--text-primary)" }}>
                  Verified Case Study &amp; Structural Audit
                </h4>

                <div style={{ padding: "20px", borderRadius: "12px", background: "var(--card-bg)", border: "1px solid var(--card-border)", marginBottom: "20px" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>
                    {selectedUtility.sampleCaseStudy.societyScale}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#10B981", fontWeight: 700, marginBottom: "16px" }}>
                    Installed: {selectedUtility.sampleCaseStudy.installedSystem}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                    <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                      <span style={{ fontSize: "0.72rem", color: "#EF4444", fontWeight: 700, display: "block" }}>PRE-INSTALLATION EXPENSE</span>
                      <strong style={{ fontSize: "1rem", color: "var(--text-primary)" }}>{selectedUtility.sampleCaseStudy.preBill}</strong>
                    </div>

                    <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
                      <span style={{ fontSize: "0.72rem", color: "#10B981", fontWeight: 700, display: "block" }}>POST-INSTALLATION EXPENSE</span>
                      <strong style={{ fontSize: "1rem", color: "var(--text-primary)" }}>{selectedUtility.sampleCaseStudy.postBill}</strong>
                    </div>
                  </div>

                  <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.5, margin: 0 }}>
                    💡 <strong>Impact Summary:</strong> {selectedUtility.sampleCaseStudy.resultSummary}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 5: REQUEST TURNKEY QUOTATION */}
            {detailTab === "quote" && (
              <div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "6px", color: "var(--text-primary)" }}>
                  Request Turnkey Proposal &amp; Structural Site Audit
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0 20px 0" }}>
                  Direct technical dispatch to <strong>{selectedUtility.vendorName}</strong>. Zero middleman commission.
                </p>

                {quoteSubmitted ? (
                  <div style={{ textAlign: "center", padding: "36px 16px" }}>
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "rgba(16, 185, 129, 0.2)",
                        color: "#10B981",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px auto",
                        fontSize: "2rem",
                      }}
                    >
                      ✓
                    </div>
                    <h3 style={{ fontSize: "1.3rem", fontWeight: 800, margin: "0 0 8px 0", color: "var(--text-primary)" }}>
                      Quotation &amp; Audit Request Dispatched!
                    </h3>
                    <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", maxWidth: "480px", margin: "0 auto 20px auto" }}>
                      Your inquiry has been forwarded to the technical liaison team at <strong>{selectedUtility.vendorName}</strong>. A certified energy/water engineer will contact you via <strong>{quoteContactPhone || "+91 Contact"}</strong> within 24 business hours to schedule a free rooftop/ground site audit.
                    </p>
                    <button onClick={() => setSelectedUtility(null)} className="btn btn-secondary btn-sm">
                      Back to Marketplace
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitQuote}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                            Housing Society / Builder Project Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Green Meadows CHS or Apex Towers"
                            value={quoteSocietyName}
                            onChange={(e) => setQuoteSocietyName(e.target.value)}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                            Contact Mobile Number *
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={quoteContactPhone}
                            onChange={(e) => setQuoteContactPhone(e.target.value)}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                            Number of Flats / Units
                          </label>
                          <input
                            type="number"
                            min={1}
                            value={quoteFlats}
                            onChange={(e) => setQuoteFlats(Number(e.target.value))}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                            City / Location
                          </label>
                          <input
                            type="text"
                            value={quoteCity}
                            onChange={(e) => setQuoteCity(e.target.value)}
                            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px" }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "4px" }}>
                          Specific Requirements / Structural Notes
                        </label>
                        <textarea
                          rows={3}
                          placeholder="e.g. Approx 8,000 sq.ft terrace area available, interested in net-metering assistance and PM Surya Ghar subsidy application."
                          value={quoteNotes}
                          onChange={(e) => setQuoteNotes(e.target.value)}
                          style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", resize: "none" }}
                        />
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                        <div>
                          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block" }}>Price Guide</span>
                          <strong style={{ fontSize: "1rem", color: "var(--text-primary)" }}>{selectedUtility.priceGuide}</strong>
                        </div>

                        <div style={{ display: "flex", gap: "10px" }}>
                          <button type="button" onClick={() => setSelectedUtility(null)} className="btn btn-secondary btn-sm">
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-primary btn-sm">
                            Submit Turnkey Quote Request →
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
