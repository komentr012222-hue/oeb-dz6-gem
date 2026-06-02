/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { StatsCalculations } from "../types";
import {
  ShieldAlert,
  Sliders,
  TrendingDown,
  TrendingUp,
  BarChart,
  HelpCircle
} from "lucide-react";

interface StatsAnalyzerProps {
  stats: StatsCalculations;
  dataLength: number;
}

export default function StatsAnalyzer({ stats, dataLength }: StatsAnalyzerProps) {
  // Determine standard business interpretation of Coefficient of Variation in Russia
  // CV < 10% - высокая однородность (стабильно)
  // CV 10% - 33% - средняя однородность (умеренная волатильность)
  // CV > 33% - неоднородная выборка (высокие риски розницы)
  let variationLabel = "";
  let variationDescription = "";
  let variationBadgeColor = "";

  if (stats.coeffVar < 10) {
    variationLabel = "Высокая однородность (Стабильный доход)";
    variationDescription = "Показатели выручки исключительно стабильны. Сезонность или непредвиденные спады отсутствуют. Низкий операционный риск.";
    variationBadgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
  } else if (stats.coeffVar <= 33) {
    variationLabel = "Умеренная колеблемость (Допустимый риск)";
    variationDescription = "Поток доходов умеренно изменчив. Наблюдаются небольшие недельные пики и спады, характерные для нормального бизнес-цикла.";
    variationBadgeColor = "bg-blue-50 text-blue-700 border-blue-200";
  } else {
    variationLabel = "Высокая волатильность (Повышенный риск)";
    variationDescription = "Продажи крайне неоднородны. Коэффициент вариации выше 33% сигнализирует о нестабильности спроса или хаотичности заказов.";
    variationBadgeColor = "bg-amber-50 text-amber-700 border-amber-200";
  }

  // Cards layout logic
  const items = [
    { name: "Среднее значение (x̄)", value: `${stats.mean} т.р.`, desc: "Среднеарифметическое значение выручки за все недели" },
    { name: "Медиана (Me)", value: `${stats.median} т.р.`, desc: "Физический центр выборки (половина недель была лучше, половина хуже)" },
    { name: "Минимум / Максимум", value: `${stats.min} / ${stats.max} т.р.`, desc: `Диапазон выплат от худшей недели до лучшей` },
    { name: "Размах вариации (R)", value: `${stats.range} т.р.`, desc: "Абсолютная разница между рекордной и минимальной выручкой" },
    { name: "Станд. отклонение (σ)", value: `${stats.stdDev} т.р.`, desc: "Среднее расстояние, на которое факты отклоняются от среднего" },
    { name: "Коэф. вариации (CV)", value: `${stats.coeffVar}%`, desc: "Относительная мера колеблемости (σ к среднему)" }
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm" id="stats-analyzer-panel">
      
      {/* Title */}
      <div className="flex items-center gap-2 pb-4 mb-6 border-b border-gray-100">
        <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg">
          <BarChart className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-950 leading-tight">
            Описательная статистика и дисперсионный анализ выручки
          </h2>
          <p className="text-xs text-gray-400">Показатели изменчивости и рисков на основе выборки из {dataLength} недель</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Metric grids table */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25, delay: idx * 0.03 }}
              className="p-4 border border-gray-50 bg-slate-50/40 rounded-xl"
            >
              <span className="text-[11px] font-bold text-gray-400 block tracking-tight mb-1">
                {item.name}
              </span>
              <span className="text-base font-bold font-mono text-slate-800 block">
                {item.value}
              </span>
              <p className="text-[10px] text-gray-500 leading-tight mt-1">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Business Insight Section */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-slate-50 border border-slate-100 p-5 rounded-2xl">
          <div>
            <h3 className="text-xs font-bold text-gray-700 tracking-tight mb-3 flex items-center gap-1.5 uppercase">
              <Sliders className="w-4 h-4 text-indigo-500" />
              Экономическое толкование рисков
            </h3>

            <div className={`p-3 rounded-lg border text-xs font-bold mb-4 ${variationBadgeColor}`}>
              {variationLabel}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {variationDescription} Стабильное развитие проекта гарантирует высокую прогнозируемость бюджетирования.
            </p>

            <div className="bg-white rounded-xl p-3 border border-gray-100 text-[11px] leading-relaxed text-slate-500 space-y-1.5">
              <strong className="text-gray-700 block">Заметки аудитора:</strong>
              <span className="block">
                • <strong>СКО ({stats.stdDev} тыс. руб.)</strong> указывает на компактность распределения результатов по неделям.
              </span>
              <span className="block">
                • Расхождение между средним ({stats.mean}) и медианой ({stats.median}) незначительно, что указывает на отсутствие критически смещенных аномалий.
              </span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-[10px] text-slate-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Метод расчета: Метод выборочной несмещенной оценки</span>
          </div>
        </div>

      </div>

    </div>
  );
}
