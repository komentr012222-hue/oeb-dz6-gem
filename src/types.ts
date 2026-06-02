/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AnnualProfitItem {
  year: string;
  income: number;
  expenses: number;
  netProfit: number;
}

export interface CashFlowItem {
  year: string;
  netFlow: number;
  accumulatedFlow: number;
}

export interface WeeklyRevenueItem {
  week: string;
  revenue: number;
}

export interface GivenCostsItem {
  system: string;
  capitalInvestment: number; // К - капитальные вложения
  annualOperatingCosts: number; // С - текущие затраты (себестоимость)
  reducedCosts: number; // Приведенные затраты: С + E_n * К
}

export interface BreakevenConfig {
  pricePerUnit: number;
  variableCostPerUnit: number;
  fixedCosts: number;
  salesVolume: number; // estimated sales
}

export interface StatsCalculations {
  mean: number;
  median: number;
  min: number;
  max: number;
  range: number;
  stdDev: number;
  variance: number;
  coeffVar: number; // Coefficient of variation in %
}
