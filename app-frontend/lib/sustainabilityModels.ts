/**
 * EcoSocietyAI - Sustainability Mathematical Models
 * Implements the rigorous analytical formulations:
 *
 * 1. Solar Photovoltaic Capacity and Yield Model:
 *    - Equation (3): P_cap = min(A_roof / kappa_pv, P_max)
 *    - Equation (4): E_monthly = P_cap * H_sun_bar * PR * 30
 *    - Equation (5): S_solar = min(B_bill * lambda_offset, E_monthly * C_tariff)
 *
 * 2. Rainwater Harvesting Potential Model:
 *    - Equation (6): V_rain = A_ground * C_runoff * R_annual_bar * eta_filter * 0.0929
 *
 * 3. Carbon Footprint Abatement Model:
 *    - Equation (7): Delta_CO2 = ((E_monthly * 12 * EF_grid) + (V_rain * EF_water)) / 1000
 *
 * 4. Multi-Criteria Cosine Similarity Metric:
 *    - Equation (8): sim(s, v) = (s . v) / (||s||_2 * ||v||_2)
 *
 * 5. Pareto-Feasibility Guarantee (Theorem 1 / Algorithm 2):
 *    - Equation (12): a_spatial(v*) <= A_available AND c(v*) <= B_cap AND Delta_S(v*) > 0
 */

// Model Constants
export const SUSTAINABILITY_CONSTANTS = {
  // Solar PV Parameters
  KAPPA_PV: 100, // ft^2/kWp (approx area required per kWp)
  P_MAX: 500, // kWp (maximum system capacity ceiling)
  H_SUN_BAR: 4.5, // kWh/m^2/day (avg daily solar insolation in central/western India)
  PR: 0.75, // System performance ratio accounting for losses
  LAMBDA_OFFSET: 0.75, // Max grid offset factor (75% limit)
  DEFAULT_TARIFF: 9.25, // INR / kWh average commercial/residential tier

  // Rainwater Parameters
  C_RUNOFF: 0.8, // Runoff coefficient for concrete/rooftop/paved surface
  R_ANNUAL_BAR: 900, // mm average annual rainfall
  ETA_FILTER: 0.9, // Filtration efficiency
  FT2_TO_M2: 0.0929, // Conversion multiplier from sq.ft to sq.m

  // Carbon Abatement Emission Factors
  EF_GRID: 0.82, // kg CO2 / kWh (grid emission factor for India)
  EF_WATER: 0.0003, // kg CO2 / Litre (municipal pumping emission factor)
} as const;

export interface SolarYieldResult {
  pCapKWp: number; // P_cap (kWp)
  eMonthlyKWh: number; // E_monthly (kWh/month)
  eAnnualKWh: number; // E_annual (kWh/year)
  sSolarMonthlyINR: number; // S_solar (INR/month savings)
  sSolarAnnualINR: number; // Annual savings (INR)
  panelCountEstimate: number; // Approx standard 400W panels
  gridOffsetPercent: number; // % of previous bill saved
}

/**
 * 1. Solar Photovoltaic Capacity and Yield Model
 * Equations (3), (4), and (5)
 */
export function calculateSolarYield(
  aRoofSqft: number,
  previousMonthlyBillINR: number = 142800,
  tariffINRPerKWh: number = SUSTAINABILITY_CONSTANTS.DEFAULT_TARIFF
): SolarYieldResult {
  const { KAPPA_PV, P_MAX, H_SUN_BAR, PR, LAMBDA_OFFSET } = SUSTAINABILITY_CONSTANTS;

  // Eq (3): P_cap = min(A_roof / kappa_pv, P_max)
  const pCapKWp = Math.min(aRoofSqft / KAPPA_PV, P_MAX);

  // Eq (4): E_monthly = P_cap * H_sun_bar * PR * 30
  // Note: 4.5 * 0.75 * 30 = 101.25 kWh per kWp per month
  const eMonthlyKWh = pCapKWp * H_SUN_BAR * PR * 30;
  const eAnnualKWh = eMonthlyKWh * 12;

  // Eq (5): S_solar = min(B_bill * lambda_offset, E_monthly * C_tariff)
  const maxGridOffsetCap = previousMonthlyBillINR * LAMBDA_OFFSET;
  const potentialEnergyValue = eMonthlyKWh * tariffINRPerKWh;
  const sSolarMonthlyINR = Math.min(maxGridOffsetCap, potentialEnergyValue);
  const sSolarAnnualINR = sSolarMonthlyINR * 12;

  const panelCountEstimate = Math.round(pCapKWp * 2.5); // ~400W per panel
  const gridOffsetPercent =
    previousMonthlyBillINR > 0
      ? Math.min(100, Math.round((sSolarMonthlyINR / previousMonthlyBillINR) * 100))
      : 0;

  return {
    pCapKWp: Math.round(pCapKWp * 10) / 10,
    eMonthlyKWh: Math.round(eMonthlyKWh),
    eAnnualKWh: Math.round(eAnnualKWh),
    sSolarMonthlyINR: Math.round(sSolarMonthlyINR),
    sSolarAnnualINR: Math.round(sSolarAnnualINR),
    panelCountEstimate,
    gridOffsetPercent,
  };
}

export interface RainwaterHarvestingResult {
  vRainAnnualLitres: number; // V_rain (Litres/year)
  vRainDailyAverageLitres: number;
  tankCapacityRecommendedLitres: number; // Sized for 15-day buffer
}

/**
 * 2. Rainwater Harvesting Potential Model
 * Equation (6): V_rain = A_ground * C_runoff * R_annual_bar * eta_filter * 0.0929
 */
export function calculateRainwaterHarvesting(aGroundSqft: number): RainwaterHarvestingResult {
  const { C_RUNOFF, R_ANNUAL_BAR, ETA_FILTER, FT2_TO_M2 } = SUSTAINABILITY_CONSTANTS;

  // Eq (6): V_rain = A_ground * C_runoff * R_annual_bar * eta_filter * 0.0929
  // 0.80 * 900 * 0.90 * 0.0929 = 60.1992 Litres per sq.ft
  const vRainAnnualLitres = aGroundSqft * C_RUNOFF * R_ANNUAL_BAR * ETA_FILTER * FT2_TO_M2;
  const vRainDailyAverageLitres = vRainAnnualLitres / 365;
  const tankCapacityRecommendedLitres = Math.round(vRainAnnualLitres * 0.12); // ~12% surge storage

  return {
    vRainAnnualLitres: Math.round(vRainAnnualLitres),
    vRainDailyAverageLitres: Math.round(vRainDailyAverageLitres),
    tankCapacityRecommendedLitres,
  };
}

export interface CarbonAbatementResult {
  deltaCO2AnnualTonnes: number; // Metric tonnes of CO2/year
  solarCO2AbatedTonnes: number;
  waterCO2AbatedTonnes: number;
  equivalentTreesPlanted: number;
}

/**
 * 3. Carbon Footprint Abatement Model
 * Equation (7): Delta_CO2 = ((E_monthly * 12 * EF_grid) + (V_rain * EF_water)) / 1000
 */
export function calculateCarbonAbatement(
  eMonthlyKWh: number,
  vRainAnnualLitres: number
): CarbonAbatementResult {
  const { EF_GRID, EF_WATER } = SUSTAINABILITY_CONSTANTS;

  const solarCO2Kg = eMonthlyKWh * 12 * EF_GRID;
  const waterCO2Kg = vRainAnnualLitres * EF_WATER;
  const deltaCO2AnnualTonnes = (solarCO2Kg + waterCO2Kg) / 1000;

  // 1 tree absorbs ~21.77 kg CO2/year -> ~46 trees per ton of CO2
  const equivalentTreesPlanted = Math.round(deltaCO2AnnualTonnes * 46);

  return {
    deltaCO2AnnualTonnes: Math.round(deltaCO2AnnualTonnes * 10) / 10,
    solarCO2AbatedTonnes: Math.round((solarCO2Kg / 1000) * 10) / 10,
    waterCO2AbatedTonnes: Math.round((waterCO2Kg / 1000) * 100) / 100,
    equivalentTreesPlanted,
  };
}

/**
 * 4. Multi-Criteria Cosine Similarity Metric
 * Equation (8): sim(s, v) = (s . v) / (||s||_2 * ||v||_2) = sum(s_k * v_k) / (sqrt(sum(s_k^2)) * sqrt(sum(v_k^2)))
 *
 * Vectors represent K criteria:
 * k=1: Scale / Capacity match
 * k=2: Cost / Budget Affordability
 * k=3: Reputation / Quality Rating
 * k=4: Carbon Abatement / Efficiency
 * k=5: Delivery Speed / Warranty SLA
 */
export function calculateCosineSimilarity(
  societyVector: number[],
  vendorVector: number[]
): { similarity: number; similarityPercent: number } {
  if (
    societyVector.length === 0 ||
    vendorVector.length === 0 ||
    societyVector.length !== vendorVector.length
  ) {
    return { similarity: 0, similarityPercent: 0 };
  }

  let dotProduct = 0;
  let normS = 0;
  let normV = 0;

  for (let k = 0; k < societyVector.length; k++) {
    dotProduct += societyVector[k] * vendorVector[k];
    normS += societyVector[k] * societyVector[k];
    normV += vendorVector[k] * vendorVector[k];
  }

  const denominator = Math.sqrt(normS) * Math.sqrt(normV);
  if (denominator === 0) return { similarity: 0, similarityPercent: 0 };

  const similarity = Math.max(0, Math.min(1, dotProduct / denominator));
  return {
    similarity: Math.round(similarity * 1000) / 1000,
    similarityPercent: Math.round(similarity * 1000) / 10,
  };
}

/**
 * 5. Pareto-Feasibility Guarantee (Theorem 1 / Algorithm 2)
 * Equation (12): a_spatial(v*) <= A_available AND c(v*) <= B_cap AND Delta_S(v*) > 0
 */
export interface ParetoCheckResult {
  isFeasible: boolean;
  spatialSatisfied: boolean;
  budgetSatisfied: boolean;
  utilitySatisfied: boolean;
  violations: string[];
}

export function evaluateParetoFeasibility(
  bidPrice: number,
  rfpBudgetCap: number,
  spaceRequiredSqft: number,
  spaceAvailableSqft: number,
  estimatedAnnualSavingsINR: number
): ParetoCheckResult {
  const spatialSatisfied = spaceRequiredSqft <= spaceAvailableSqft;
  const budgetSatisfied = bidPrice <= rfpBudgetCap;
  const utilitySatisfied = estimatedAnnualSavingsINR > 0;

  const violations: string[] = [];
  if (!spatialSatisfied) {
    violations.push(
      `Spatial Excess: Required ${spaceRequiredSqft.toLocaleString("en-IN")} sq.ft exceeds available ${spaceAvailableSqft.toLocaleString("en-IN")} sq.ft`
    );
  }
  if (!budgetSatisfied) {
    violations.push(
      `Budget Overrun: Bid ₹${bidPrice.toLocaleString("en-IN")} exceeds cap ₹${rfpBudgetCap.toLocaleString("en-IN")}`
    );
  }
  if (!utilitySatisfied) {
    violations.push(`Negative Financial Utility: Delta S <= 0`);
  }

  return {
    isFeasible: spatialSatisfied && budgetSatisfied && utilitySatisfied,
    spatialSatisfied,
    budgetSatisfied,
    utilitySatisfied,
    violations,
  };
}
