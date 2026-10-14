/**
 * Mock & Seed Data for EcoSocietyAI
 * Used as high-fidelity fallbacks when backend is offline or unseeded.
 */

import {
  Role,
  User,
  HousingSociety,
  SocietyMember,
  UtilityType,
  UtilityLog,
  VendorCategory,
  VendorProfile,
  VendorService,
} from "@/types/api";

export const MOCK_ROLES: Role[] = [
  { roleId: 1, roleName: "ROLE_ADMIN" },
  { roleId: 2, roleName: "ROLE_RESIDENT" },
  { roleId: 3, roleName: "ROLE_VENDOR" },
  { roleId: 4, roleName: "ROLE_AUDITOR" },
];

export const MOCK_USERS: User[] = [
  {
    userId: 1,
    fullName: "Atharva Kadam",
    email: "admin@ecosociety.ai",
    phoneNumber: "+91 98201 12345",
    role: MOCK_ROLES[0],
  },
  {
    userId: 2,
    fullName: "Rohan Shah",
    email: "rohan@ecosociety.ai",
    phoneNumber: "+91 98765 43210",
    role: MOCK_ROLES[1],
  },
  {
    userId: 3,
    fullName: "Priya Menon",
    email: "priya@ecosociety.ai",
    phoneNumber: "+91 99341 55667",
    role: MOCK_ROLES[1],
  },
  {
    userId: 4,
    fullName: "SunPower Solutions",
    email: "vendor@sunpower.com",
    phoneNumber: "+91 80234 56789",
    role: MOCK_ROLES[2],
  },
  {
    userId: 5,
    fullName: "Dr. Neha Sharma",
    email: "auditor@greenveritas.org",
    phoneNumber: "+91 97123 99887",
    role: MOCK_ROLES[3],
  },
];

export const MOCK_SOCIETIES: HousingSociety[] = [
  {
    societyId: 1,
    societyName: "GreenWood Heights Co-operative Society",
    registrationNumber: "MH/MUM/HSG/2021/4892",
    address: "Plot 42, Palm Beach Road, Sector 19",
    city: "Mumbai",
    pincode: "400705",
    totalFlats: 140,
    totalResidents: 480,
    availableRoofAreaSqft: 12500,
    availableGroundAreaSqft: 7500,
    monthlySustainabilityBudget: 150000,
    adminUser: MOCK_USERS[0],
  },
  {
    societyId: 2,
    societyName: "EcoVeda Residency",
    registrationNumber: "MH/PUN/HSG/2019/1102",
    address: "Baner-Pashan Link Road",
    city: "Pune",
    pincode: "411045",
    totalFlats: 96,
    totalResidents: 320,
    availableRoofAreaSqft: 9000,
    availableGroundAreaSqft: 4500,
    monthlySustainabilityBudget: 110000,
    adminUser: MOCK_USERS[0],
  },
  {
    societyId: 3,
    societyName: "Solaris Greens Parkview",
    registrationNumber: "KA/BLR/HSG/2022/8821",
    address: "Outer Ring Road, Bellandur",
    city: "Bengaluru",
    pincode: "560103",
    totalFlats: 220,
    totalResidents: 750,
    availableRoofAreaSqft: 20000,
    availableGroundAreaSqft: 11000,
    monthlySustainabilityBudget: 280000,
    adminUser: MOCK_USERS[0],
  },
];

export const MOCK_MEMBERS: SocietyMember[] = [
  {
    memberId: 1,
    society: MOCK_SOCIETIES[0],
    user: MOCK_USERS[0],
    flatNumber: "A-1201 (Secretary)",
  },
  {
    memberId: 2,
    society: MOCK_SOCIETIES[0],
    user: MOCK_USERS[1],
    flatNumber: "B-404",
  },
  {
    memberId: 3,
    society: MOCK_SOCIETIES[0],
    user: MOCK_USERS[2],
    flatNumber: "C-802",
  },
];

export const MOCK_UTILITY_TYPES: UtilityType[] = [
  { utilityTypeId: 1, typeName: "Electricity Grid" },
  { utilityTypeId: 2, typeName: "Water Supply" },
  { utilityTypeId: 3, typeName: "Solid Waste Management" },
  { utilityTypeId: 4, typeName: "Solar Generation" },
];

export const MOCK_UTILITY_LOGS: UtilityLog[] = [
  {
    logId: 1,
    society: MOCK_SOCIETIES[0],
    utilityType: MOCK_UTILITY_TYPES[0],
    billingPeriodStart: "2026-07-01",
    billingPeriodEnd: "2026-07-31",
    consumptionUnit: "kWh",
    consumptionValue: 12450,
    totalCost: 142800,
    loggedByUser: MOCK_USERS[0],
  },
  {
    logId: 2,
    society: MOCK_SOCIETIES[0],
    utilityType: MOCK_UTILITY_TYPES[1],
    billingPeriodStart: "2026-07-01",
    billingPeriodEnd: "2026-07-31",
    consumptionUnit: "Litres",
    consumptionValue: 382000,
    totalCost: 58400,
    loggedByUser: MOCK_USERS[0],
  },
  {
    logId: 3,
    society: MOCK_SOCIETIES[0],
    utilityType: MOCK_UTILITY_TYPES[2],
    billingPeriodStart: "2026-07-01",
    billingPeriodEnd: "2026-07-31",
    consumptionUnit: "kg",
    consumptionValue: 4120,
    totalCost: 12800,
    loggedByUser: MOCK_USERS[0],
  },
  {
    logId: 4,
    society: MOCK_SOCIETIES[0],
    utilityType: MOCK_UTILITY_TYPES[0],
    billingPeriodStart: "2026-06-01",
    billingPeriodEnd: "2026-06-30",
    consumptionUnit: "kWh",
    consumptionValue: 13500,
    totalCost: 154000,
    loggedByUser: MOCK_USERS[0],
  },
  {
    logId: 5,
    society: MOCK_SOCIETIES[0],
    utilityType: MOCK_UTILITY_TYPES[1],
    billingPeriodStart: "2026-06-01",
    billingPeriodEnd: "2026-06-30",
    consumptionUnit: "Litres",
    consumptionValue: 410000,
    totalCost: 62000,
    loggedByUser: MOCK_USERS[0],
  },
  {
    logId: 6,
    society: MOCK_SOCIETIES[0],
    utilityType: MOCK_UTILITY_TYPES[2],
    billingPeriodStart: "2026-06-01",
    billingPeriodEnd: "2026-06-30",
    consumptionUnit: "kg",
    consumptionValue: 4300,
    totalCost: 14000,
    loggedByUser: MOCK_USERS[0],
  },
];

export const MOCK_VENDOR_CATEGORIES: VendorCategory[] = [
  { categoryId: 1, categoryName: "Solar PV Rooftop" },
  { categoryId: 2, categoryName: "Rainwater Harvesting" },
  { categoryId: 3, categoryName: "Organic Waste & Composting" },
  { categoryId: 4, categoryName: "EV Charging Infrastructure" },
];

export const MOCK_VENDOR_PROFILES: VendorProfile[] = [
  {
    vendorId: 1,
    user: MOCK_USERS[3],
    companyName: "SunPower CleanTech Pvt Ltd",
    gstNumber: "27AABCS1429B1Z8",
    isVerified: true,
  },
  {
    vendorId: 2,
    user: {
      userId: 6,
      fullName: "AquaFlow Engineering",
      email: "contact@aquaflow.in",
      role: MOCK_ROLES[2],
    },
    companyName: "AquaFlow Rainwater Systems",
    gstNumber: "27AABCA9081C1Z4",
    isVerified: true,
  },
  {
    vendorId: 3,
    user: {
      userId: 7,
      fullName: "EcoTerra Waste Solutions",
      email: "info@ecoterra.com",
      role: MOCK_ROLES[2],
    },
    companyName: "EcoTerra Organic Processors",
    gstNumber: "27AABCE5523D1ZX",
    isVerified: true,
  },
];

export const MOCK_VENDOR_SERVICES: VendorService[] = [
  {
    serviceId: 1,
    vendor: MOCK_VENDOR_PROFILES[0],
    category: MOCK_VENDOR_CATEGORIES[0],
    serviceTitle: "Commercial Rooftop Solar Turnkey (30-100 kWp)",
    basePrice: 42000,
  },
  {
    serviceId: 2,
    vendor: MOCK_VENDOR_PROFILES[1],
    category: MOCK_VENDOR_CATEGORIES[1],
    serviceTitle: "Underground Rainwater Filtration Bed & Borewell Recharge",
    basePrice: 65000,
  },
  {
    serviceId: 3,
    vendor: MOCK_VENDOR_PROFILES[2],
    category: MOCK_VENDOR_CATEGORIES[2],
    serviceTitle: "Automated Bio-Mechanical Organic Waste Composter (500kg/day)",
    basePrice: 185000,
  },
  {
    serviceId: 4,
    vendor: MOCK_VENDOR_PROFILES[0],
    category: MOCK_VENDOR_CATEGORIES[3],
    serviceTitle: "Dual Gun 22kW Fast AC EV Charger with CMS App",
    basePrice: 78000,
  },
];
