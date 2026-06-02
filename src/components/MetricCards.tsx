/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  Clock,
  Target,
  DollarSign,
  Cpu,
  BookmarkCheck,
  AlertCircle
} from "lucide-react";

interface MetricCardsProps {
  roiRate: number;
  roiJustified: boolean;
  alternativeRate: number;
  paybackPeriodLabel: string;
  investmentAmount: number;
  breakevenUnits: number;
  breakevenRevenue: number;
  averageAnnualProfit: number;
  totalProfit: number;
  optimalSystemName: string;
  optimalSystemReducedCosts: number;
}

export default function MetricCards({
  roiRate,
  roiJustified,
  alternativeRate,
  paybackPeriodLabel,
  investmentAmount,
  breakevenUnits,
  breakevenRevenue,
  averageAnnualProfit,
  totalProfit,
  optimalSystemName,
  optimalSystemReducedCosts
}: MetricCardsProps) {
  const cards = [
    {
      id: "roi",
      title: "ROI (Годовой)",
      value: `${roiRate}%`,
      sub: `Альтернатива: ${alternativeRate}% (${
        roiJustified ? "Инвестиции оправданы" : "Инвестиции невыгодны"
      })`,
      icon: TrendingUp,
      color: "border-emerald-500 text-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/10",
      accent: "emerald",
      titleColor: "#cacaca",
      valueColor: "#4ba158",
      subColor: "#c5bebb"
    },
    {
      id: "payback",
      title: "Период окупаемости",
      value: paybackPeriodLabel,
      sub: `Инвестиции: ${investmentAmount.toLocaleString("ru-RU")} тыс. руб.`,
      icon: Clock,
      color: "border-blue-500 text-blue-600 bg-blue-50/50 dark:bg-blue-950/10",
      accent: "blue",
      titleColor: "#b6b6b8",
      valueColor: "#499c42",
      subColor: "#cacaca"
    },
    {
      id: "breakeven",
      title: "Точка безубыточности",
      value: `${breakevenUnits} ед.`,
      sub: `Выручка ТБУ: ${breakevenRevenue.toLocaleString("ru-RU")} тыс. руб.`,
      icon: Target,
      color: "border-amber-500 text-amber-600 bg-amber-50/50 dark:bg-amber-950/10",
      accent: "amber",
      titleColor: "#b2b4b5",
      valueColor: "#398d46",
      subColor: "#dcdcdc"
    },
    {
      id: "profit",
      title: "Среднегодовая прибыль",
      value: `${averageAnnualProfit.toLocaleString("ru-RU")} тыс. руб.`,
      sub: `Суммарно: ${totalProfit.toLocaleString("ru-RU")} тыс. руб.`,
      icon: DollarSign,
      color: "border-purple-500 text-purple-600 bg-purple-50/50 dark:bg-purple-950/10",
      accent: "purple",
      titleColor: "#b2adad",
      valueColor: "#408b44",
      subColor: "#b8b5b5"
    },
    {
      id: "system",
      title: "Оптимальная система",
      value: optimalSystemName,
      sub: `Привед. затраты: ${optimalSystemReducedCosts.toLocaleString("ru-RU")} тыс. руб.`,
      icon: Cpu,
      color: "border-rose-500 text-rose-600 bg-rose-50/50 dark:bg-rose-950/10",
      accent: "rose",
      titleColor: "#a7a0a0",
      valueColor: "#3a905c",
      subColor: "#a9a9a9"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8" id="metrics-grid">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className={`cursor-pointer rounded-xl bg-white border-t-4 ${card.color} shadow-sm border-gray-100 p-5 flex flex-col justify-between transition-all duration-200 border-x border-b`}
            id={`metric-card-${card.id}`}
          >
            <div className="flex items-start justify-between" style={card.id === "roi" ? { color: "#a99999" } : {}}>
              <span className="text-sm font-semibold tracking-tight leading-tight" style={{ color: card.titleColor }}>
                {card.title}
              </span>
              <Icon className="w-5 h-5 opacity-80" />
            </div>

            <div className="my-3" style={card.id === "system" ? { color: "#45a75d" } : {}}>
              <span className="text-2xl font-bold font-sans tracking-tight" style={{ color: card.valueColor }}>
                {card.value}
              </span>
            </div>

            <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-50">
              {card.id === "roi" && (
                <div
                  className={`w-2 h-2 rounded-full ${
                    roiJustified ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
              )}
              {card.id === "system" && <BookmarkCheck className="w-3.5 h-3.5 text-rose-500" />}
              <span className="text-xs font-medium line-clamp-1" style={{ color: card.subColor }}>
                {card.sub}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
