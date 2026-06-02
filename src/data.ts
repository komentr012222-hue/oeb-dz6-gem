/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  AnnualProfitItem,
  CashFlowItem,
  WeeklyRevenueItem,
  GivenCostsItem,
  BreakevenConfig,
  StatsCalculations
} from "./types";

// --- Baseline Data in Russian ---

export const INITIAL_PROFIT_DATA: AnnualProfitItem[] = [
  { year: "1-й год", income: 5200, expenses: 4400, netProfit: 800 },
  { year: "2-й год", income: 6800, expenses: 5100, netProfit: 1700 },
  { year: "3-й год", income: 8500, expenses: 6000, netProfit: 2500 },
  { year: "4-й год", income: 9700, expenses: 6500, netProfit: 3200 }
];

export const INITIAL_CASH_FLOW_DATA: CashFlowItem[] = [
  { year: "Год 0", netFlow: -7500, accumulatedFlow: -7500 },
  { year: "Год 1", netFlow: 1800, accumulatedFlow: -5700 },
  { year: "Год 2", netFlow: 2200, accumulatedFlow: -3500 },
  { year: "Год 3", netFlow: 2500, accumulatedFlow: -1000 },
  { year: "Год 4", netFlow: 2500, accumulatedFlow: 1500 },
  { year: "Год 5", netFlow: 2000, accumulatedFlow: 3500 }
];

export const INITIAL_STATS_DATA: WeeklyRevenueItem[] = [
  { week: "Нед 1", revenue: 83 },
  { week: "Нед 2", revenue: 91 },
  { week: "Нед 3", revenue: 78 },
  { week: "Нед 4", revenue: 105 },
  { week: "Нед 5", revenue: 88 },
  { week: "Нед 6", revenue: 145 },
  { week: "Нед 7", revenue: 92 },
  { week: "Нед 8", revenue: 87 },
  { week: "Нед 9", revenue: 96 },
  { week: "Нед 10", revenue: 138 },
  { week: "Нед 11", revenue: 84 },
  { week: "Нед 12", revenue: 90 }
];

export const INITIAL_BREAKEVEN_CONFIG: BreakevenConfig = {
  pricePerUnit: 2.05,        // тыс. руб. (цена за ед.)
  variableCostPerUnit: 1.025, // тыс. руб. (переменные затраты на ед.)
  fixedCosts: 410,          // тыс. руб. (постоянные затраты)
  salesVolume: 650           // текущий или прогнозируемый объем продаж в ед.
};

// Параметры для Системы X vs Система Y (Приведенные затраты)
// К - кап.вложения, С - себестоимость, E_n - нормокоэффициент
export const INITIAL_COMPARE_SYSTEMS = {
  normativeCoefficient: 0.15, // E_n
  systems: [
    { name: "Система X", capitalInvestment: 12000, annualOperatingCosts: 2720 },
    { name: "Система Y", capitalInvestment: 10000, annualOperatingCosts: 2840 }
  ]
};

// --- Financial Calculation Math ---

/**
 * Calculates Payback Period based on Year 0 (investment) and subsequent Net cash flows.
 * Returns the period in years and months as object and a string.
 */
export function calculatePaybackPeriod(cashFlows: CashFlowItem[]): {
  years: number;
  months: number;
  label: string;
  isRecovered: boolean;
  investmentAmount: number;
} {
  if (cashFlows.length === 0) {
    return { years: 0, months: 0, label: "Нет данных", isRecovered: false, investmentAmount: 0 };
  }

  const investment = -Math.min(0, cashFlows[0].netFlow); // Positive representation of initial investment
  
  // Calculate cumulative cash flow manually to be fresh
  const accumulated: number[] = [];
  let currentSum = 0;
  for (let i = 0; i < cashFlows.length; i++) {
    currentSum += cashFlows[i].netFlow;
    accumulated.push(currentSum);
  }

  // Find where accumulated transitions from negative to positive
  let transitionIndex = -1;
  for (let i = 1; i < accumulated.length; i++) {
    if (accumulated[i - 1] < 0 && accumulated[i] >= 0) {
      transitionIndex = i;
      break;
    }
  }

  if (accumulated[0] >= 0) {
    return { years: 0, months: 0, label: "0 мес (окупается сразу)", isRecovered: true, investmentAmount: investment };
  }

  if (transitionIndex === -1) {
    // Check if it never crossed but is increasing
    const lastAccum = accumulated[accumulated.length - 1];
    if (lastAccum < 0) {
      return { years: 99, months: 0, label: "Не окупается в указ. период", isRecovered: false, investmentAmount: investment };
    }
  }

  const prevYearAccumVal = accumulated[transitionIndex - 1]; // negative value
  const transitionNetFlow = cashFlows[transitionIndex].netFlow;
  
  // Wait, year indices can be e.g. 'Год 1' = index 1
  // How many fractional years: fraction = (-prevYearAccumVal) / transitionNetFlow
  const fraction = (-prevYearAccumVal) / transitionNetFlow;
  const totalYears = (transitionIndex - 1) + fraction;
  
  const yearsPart = Math.floor(totalYears);
  let monthsPart = Math.round((totalYears - yearsPart) * 12);
  
  let finalYears = yearsPart;
  if (monthsPart === 12) {
    finalYears += 1;
    monthsPart = 0;
  }

  let labelStr = "";
  if (finalYears > 0) {
    labelStr += `${finalYears}г `;
  }
  labelStr += `${monthsPart}мес`;

  return {
    years: finalYears,
    months: monthsPart,
    label: labelStr,
    isRecovered: true,
    investmentAmount: investment
  };
}

/**
 * Calculates Return on Investment (ROI) based on average net profits and investment
 */
export function calculateROI(
  netProfits: number[],
  investment: number
): { rate: number; averageAnnualProfit: number; alternativeRate: number; isJustified: boolean } {
  if (investment <= 0 || netProfits.length === 0) {
    return { rate: 0, averageAnnualProfit: 0, alternativeRate: 15, isJustified: false };
  }
  
  const totalProfit = netProfits.reduce((sum, val) => sum + val, 0);
  const averageAnnualProfit = totalProfit / netProfits.length;
  
  const rate = (averageAnnualProfit / investment) * 100;
  const alternativeRate = 15; // Benchmark standard
  const isJustified = rate >= alternativeRate;

  return {
    rate: Math.round(rate * 10) / 10,
    averageAnnualProfit: Math.round(averageAnnualProfit * 10) / 10,
    alternativeRate,
    isJustified
  };
}

/**
 * Calculates Breakeven point in units and revenue
 */
export function calculateBreakeven(config: BreakevenConfig): {
  units: number;
  revenue: number;
  marginSafetyPercent: number;
  isProfitable: boolean;
} {
  const { pricePerUnit, variableCostPerUnit, fixedCosts, salesVolume } = config;
  
  const contributionMargin = pricePerUnit - variableCostPerUnit;
  if (contributionMargin <= 0) {
    return { units: Infinity, revenue: Infinity, marginSafetyPercent: 0, isProfitable: false };
  }
  
  const units = Math.ceil(fixedCosts / contributionMargin);
  const revenue = Math.round(units * pricePerUnit * 10) / 10;
  
  // Margin of safety = (estimated sales - breakeven sales) / estimated sales * 100%
  const safety = ((salesVolume - units) / salesVolume) * 100;
  const marginSafetyPercent = Math.max(0, Math.round(safety * 10) / 10);
  
  const isProfitable = salesVolume > units;

  return {
    units,
    revenue,
    marginSafetyPercent,
    isProfitable
  };
}

/**
 * Calculates Descriptive Statistics for an array of numbers
 */
export function calculateDescriptiveStats(data: number[]): StatsCalculations {
  if (data.length === 0) {
    return { mean: 0, median: 0, min: 0, max: 0, range: 0, stdDev: 0, variance: 0, coeffVar: 0 };
  }

  const n = data.length;
  const sum = data.reduce((s, v) => s + v, 0);
  const mean = sum / n;

  // Sorted
  const sorted = [...data].sort((a, b) => a - b);
  let median = 0;
  const mid = Math.floor(n / 2);
  if (n % 2 !== 0) {
    median = sorted[mid];
  } else {
    median = (sorted[mid - 1] + sorted[mid]) / 2;
  }

  const min = sorted[0];
  const max = sorted[n - 1];
  const range = max - min;

  // Variance & standard deviation
  const sqDiffSum = data.reduce((s, v) => s + Math.pow(v - mean, 2), 0);
  // Using sample variance (divide by n - 1)
  const variance = n > 1 ? sqDiffSum / (n - 1) : 0;
  const stdDev = Math.sqrt(variance);

  // Coefficient of Variation = (stdDev / mean) * 100%
  const coeffVar = mean > 0 ? (stdDev / mean) * 100 : 0;

  return {
    mean: Math.round(mean * 10) / 10,
    median: Math.round(median * 10) / 10,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    range: Math.round(range * 10) / 10,
    stdDev: Math.round(stdDev * 10) / 10,
    variance: Math.round(variance * 10) / 10,
    coeffVar: Math.round(coeffVar * 10) / 10
  };
}

/**
 * Calculates Reduced Costs for comparison
 */
export function calculateReducedCosts(
  capitalInvest: number,
  operatingCosts: number,
  normativeCoeff: number
): number {
  return operatingCosts + (normativeCoeff * capitalInvest);
}
