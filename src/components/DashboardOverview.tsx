/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  BarChart,
  Bar,
  Line,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import {
  AnnualProfitItem,
  CashFlowItem,
  WeeklyRevenueItem,
  StatsCalculations
} from "../types";
import { TrendingUp, BarChart2, Zap, ArrowRightLeft } from "lucide-react";

interface DashboardOverviewProps {
  profitData: AnnualProfitItem[];
  cashFlowData: CashFlowItem[];
  statsData: WeeklyRevenueItem[];
  statsCalculations: StatsCalculations;
  systemXCosts: number;
  systemYCosts: number;
}

export default function DashboardOverview({
  profitData,
  cashFlowData,
  statsData,
  statsCalculations,
  systemXCosts,
  systemYCosts
}: DashboardOverviewProps) {
  // Format given costs for chart
  const givenCostsData = [
    { name: "Система X", costs: systemXCosts, fill: "#ef4444" },
    { name: "Система Y", costs: systemYCosts, fill: "#10b981" }
  ];

  // Custom tooltips for elegant look
  const customTooltipFormatter = (value: any) => {
    if (typeof value === "number") {
      return [`${value.toLocaleString("ru-RU")} тыс. руб.`, ""];
    }
    return [value, ""];
  };

  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-lg shadow-lg border border-slate-800 text-xs">
          <p className="font-semibold mb-1.5 text-slate-300">{label}</p>
          <div className="space-y-1">
            {payload.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color || item.fill }} />
                <span>{item.name}:</span>
                <span className="font-mono font-bold">
                  {item.value ? `${item.value.toLocaleString("ru-RU")} тыс. руб.` : "0"}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="charts-grid">
      
      {/* 2.1 График Прибыли */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col"
        id="chart-card-profit"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 leading-tight">
                Динамика доходов, расходов и чистой прибыли
              </h2>
              <p className="text-xs text-gray-400">Смешанный график по годам планирования</p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={profitData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v / 1000}м`} tickLine={false} />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="income" name="Доходы" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={45} />
              <Bar dataKey="expenses" name="Расходы" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={45} />
              <Line
                type="monotone"
                dataKey="netProfit"
                name="Чистая прибыль"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 1, fill: "#ffffff" }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 2.2 График Потоков */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col"
        id="chart-card-cashflow"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 leading-tight">
                Чистый и накопленный денежные потоки
              </h2>
              <p className="text-xs text-gray-400">Анализ окупаемости проекта с Шага 0</p>
            </div>
          </div>
        </div>

        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={cashFlowData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${v / 1000}м`} tickLine={false} />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="netFlow" name="Чистый ден. поток" maxBarSize={45}>
                {cashFlowData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.netFlow < 0 ? "rgba(239, 68, 68, 0.85)" : "rgba(16, 185, 129, 0.85)"}
                    radius={entry.netFlow < 0 ? [0, 0, 4, 4] : [4, 4, 0, 0]}
                  />
                ))}
              </Bar>
              <Line
                type="monotone"
                dataKey="accumulatedFlow"
                name="Накопленный поток"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 1, fill: "#ffffff" }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 2.3 График Статистики выручки */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col"
        id="chart-card-stats"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="bg-purple-50 text-purple-600 p-2 rounded-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 leading-tight">
                Среднедневная выручка (12 недель)
              </h2>
              <p className="text-xs text-gray-400">Недельные замеры и уровень среднего значения</p>
            </div>
          </div>
          <div className="bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold">
            x̄ = {statsCalculations.mean} т.р.
          </div>
        </div>

        <div className="h-72 w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={statsData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="week" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} domain={["auto", "auto"]} tickLine={false} />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine
                y={statsCalculations.mean}
                stroke="#64748b"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                label={{
                  value: `Среднее: ${statsCalculations.mean}`,
                  position: "top",
                  fill: "#475569",
                  fontSize: 10,
                  fontWeight: "semibold"
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Выручка"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 1, fill: "#ffffff" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 2.4 График сравнения затрат */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col"
        id="chart-card-costs"
      >
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="bg-rose-50 text-rose-600 p-2 rounded-lg">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 leading-tight">
                Сравнение приведенных затрат (Привед. затраты)
              </h2>
              <p className="text-xs text-gray-400">Ниже — выгоднее (Система X vs Система Y)</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
            {systemXCosts > systemYCosts ? "Y эффективнее" : "X эффективнее"}
          </span>
        </div>

        <div className="h-72 w-full mt-2 flex items-center">
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              layout="vertical"
              data={givenCostsData}
              margin={{ top: 15, right: 25, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <Tooltip formatter={customTooltipFormatter} />
              <Bar dataKey="costs" name="Приведенные затраты" radius={[0, 4, 4, 0]} maxBarSize={30}>
                {givenCostsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

    </div>
  );
}
