/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceDot,
  ReferenceLine
} from "recharts";
import { BreakevenConfig } from "../types";
import {
  Calculator,
  Compass,
  Coins,
  Cpu,
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";

interface InteractiveCalculatorProps {
  breakevenConfig: BreakevenConfig;
  setBreakevenConfig: React.Dispatch<React.SetStateAction<BreakevenConfig>>;
  normativeCoeff: number;
  setNormativeCoeff: React.Dispatch<React.SetStateAction<number>>;
  systemXCap: number;
  setSystemXCap: (val: number) => void;
  systemXCost: number;
  setSystemXCost: (val: number) => void;
  systemYCap: number;
  setSystemYCap: (val: number) => void;
  systemYCost: number;
  setSystemYCost: (val: number) => void;
  paybackPeriodLabel: string;
  roiRate: number;
  roiJustified: boolean;
}

export default function InteractiveCalculator({
  breakevenConfig,
  setBreakevenConfig,
  normativeCoeff,
  setNormativeCoeff,
  systemXCap,
  setSystemXCap,
  systemXCost,
  setSystemXCost,
  systemYCap,
  setSystemYCap,
  systemYCost,
  setSystemYCost,
  paybackPeriodLabel,
  roiRate,
  roiJustified
}: InteractiveCalculatorProps) {
  const [calcTab, setCalcTab] = useState<"cvp" | "reduced" | "roi">("cvp");

  // --- CVP (Breakeven) Math & Chart Data ---
  const handleCvpChange = (field: keyof BreakevenConfig, value: string) => {
    const numVal = parseFloat(value) || 0;
    setBreakevenConfig((prev) => ({
      ...prev,
      [field]: numVal
    }));
  };

  const p = breakevenConfig.pricePerUnit;
  const v = breakevenConfig.variableCostPerUnit;
  const fc = breakevenConfig.fixedCosts;
  const vol = breakevenConfig.salesVolume;

  const contributionMargin = p - v;
  const breakevenUnits = contributionMargin > 0 ? Math.ceil(fc / contributionMargin) : 0;
  const breakevenRevenue = contributionMargin > 0 ? breakevenUnits * p : 0;
  const safetyMargin = vol > 0 ? ((vol - breakevenUnits) / vol) * 100 : 0;
  const safetyMarginRounded = Math.max(0, Math.round(safetyMargin * 10) / 10);

  // Generate CVP Line chart points
  const cvpChartData = [];
  const maxVolume = Math.max(vol * 1.5, breakevenUnits * 1.5, 100);
  const steps = 8;
  for (let i = 0; i <= steps; i++) {
    const currentUnits = Math.round((maxVolume / steps) * i);
    const revenueVal = Math.round(currentUnits * p);
    const varCostVal = currentUnits * v;
    const totalCostVal = Math.round(fc + varCostVal);
    
    cvpChartData.push({
      units: currentUnits,
      "Выручка": revenueVal,
      "Общие издержки": totalCostVal,
      "Постоянные издержки": fc
    });
  }

  // --- System Comparison Advice ---
  const rx = systemXCost + normativeCoeff * systemXCap;
  const ry = systemYCost + normativeCoeff * systemYCap;
  const optimalChoice = rx < ry ? "Система X" : "Система Y";
  const worstChoice = rx < ry ? "Система Y" : "Система X";
  const savings = Math.abs(rx - ry);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm" id="modeling-calculator-panel">
      
      {/* Tab Navigation header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-gray-100 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            Интерактивный симулятор-конструктор
          </h2>
          <p className="text-xs text-gray-400">Настраивайте параметры бизнес-модели для поиска оптимальных решений</p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl self-start sm:self-center gap-1">
          <button
            onClick={() => setCalcTab("cvp")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              calcTab === "cvp" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            CVP Безубыточность
          </button>
          <button
            onClick={() => setCalcTab("reduced")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              calcTab === "reduced" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Приведенные затраты
          </button>
          <button
            onClick={() => setCalcTab("roi")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              calcTab === "roi" ? "bg-white text-indigo-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            Окупаемость & ROI
          </button>
        </div>
      </div>

      {/* 2. TAB: CVP Analysis */}
      {calcTab === "cvp" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Bar */}
          <div className="lg:col-span-4 space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Параметры CVP планирования
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Цена продажи за единицу продукции (тыс. руб.)
              </label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                value={p || ""}
                onChange={(e) => handleCvpChange("pricePerUnit", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500 font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Переменные затраты на единицу (тыс. руб.)
              </label>
              <input
                type="number"
                step="0.05"
                min="0"
                value={v || ""}
                onChange={(e) => handleCvpChange("variableCostPerUnit", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500 font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Суммарные постоянные издержки (тыс. руб.)
              </label>
              <input
                type="number"
                step="10"
                min="0"
                value={fc || ""}
                onChange={(e) => handleCvpChange("fixedCosts", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500 font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Ожидаемый объем продаж (ед. продукции)
              </label>
              <input
                type="number"
                step="10"
                min="1"
                value={vol || ""}
                onChange={(e) => handleCvpChange("salesVolume", e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-indigo-500 font-bold text-gray-800"
              />
            </div>

            {/* In-tab instant calculations output */}
            <div className="pt-3 border-t border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Маржинальная прибыль на единицу:</span>
                <span className="font-mono font-bold text-gray-800">{(p - v).toFixed(3)} тыс. руб.</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-500">Запас финансовой прочности:</span>
                <span className={`font-mono font-bold ${safetyMarginRounded > 25 ? "text-emerald-600 animate-pulse" : "text-amber-600"}`}>
                  {vol >= breakevenUnits ? `${safetyMarginRounded}%` : "Отрицательный"}
                </span>
              </div>
            </div>
          </div>

          {/* Visualization Canvas */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div className="bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200 mb-4">
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-indigo-500" />
                Результаты расчета CVP (Cost-Volume-Profit):
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Для достижения безубыточности проекту необходимо выпустить и реализовать не менее{" "}
                <strong className="text-slate-950 font-extrabold">{breakevenUnits} ед.</strong> готовой продукции, что соответствует объему выручки{" "}
                <strong className="text-slate-950 font-extrabold">{breakevenRevenue.toLocaleString("ru-RU")} тыс. руб.</strong> При прогнозировании
                эффективности продаж на уровне {vol} ед. проект имеет запас прочности{" "}
                <strong className={safetyMarginRounded > 20 ? "text-emerald-700" : "text-amber-700"}>{safetyMarginRounded}%</strong> (риск убытков отсутствует).
              </p>
            </div>

            <div className="h-72 w-full mt-2" id="cvp-chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cvpChartData} margin={{ top: 15, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="units" stroke="#94a3b8" fontSize={11} tickLine={false} label={{ value: "Объем (ед.)", position: "insideBottomRight", offset: -5 }} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} label={{ value: "тыс. руб.", angle: -90, position: "insideLeft", offset: 10 }} />
                  <Tooltip formatter={(value) => `${value.toLocaleString("ru-RU")} тыс. руб.`} />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                  
                  {/* Reference line showing breakeven intersection */}
                  {breakevenUnits > 0 && breakevenUnits < maxVolume && (
                    <ReferenceLine
                      x={breakevenUnits}
                      stroke="#f59e0b"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      label={{ value: `ТБУ: ${breakevenUnits} ед.`, position: "insideBottom", fill: "#d97706", fontSize: 10, fontWeight: "bold" }}
                    />
                  )}

                  <Line type="monotone" dataKey="Выручка" stroke="#3b82f6" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Общие издержки" stroke="#ef4444" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="Постоянные издержки" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: Reduced Costs Comparison */}
      {calcTab === "reduced" && (
        <div className="space-y-6">
          <div className="bg-slate-50/50 p-4 border border-slate-100 rounded-xl leading-relaxed text-xs text-slate-600">
            <p className="flex items-start gap-1 pb-2">
              <Info className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <span>
                <strong>Формула приведенных затрат:</strong> {"$E_{прив} = C + E_n \\cdot K$"}, где {"$C$"} — годовые текущие затраты (себестоимость), {"$K$"} — единовременные капитальные вложения (инвестиции), а {"$E_n$"} — нормативный коэффициент эффективности капитальных вложений.
              </span>
            </p>
            <p>
              Оптимальным решением является вариант с минимальными приведенными затратами. При изменении коэффициента $E_n$ соотношение ценности капвложений и текущих затрат меняется.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* System X variables */}
            <div className="bg-white border border-gray-100 shadow-xs rounded-xl p-5 space-y-3.5">
              <h4 className="text-xs font-bold text-gray-700 border-b border-gray-100 pb-2 flex items-center justify-between">
                Система X
                <span className="text-[10px] text-gray-400 font-mono">Базово: К=12000, С=2720</span>
              </h4>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Капитальные вложения (тыс. руб.)
                </label>
                <input
                  type="number"
                  step="500"
                  min="0"
                  value={systemXCap}
                  onChange={(e) => setSystemXCap(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-700"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Текущие операционные затраты / год (тыс. руб.)
                </label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={systemXCost}
                  onChange={(e) => setSystemXCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-700"
                />
              </div>
              <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-semibold">Приведенные затраты:</span>
                <span className="text-sm font-extrabold text-slate-800 font-mono">
                  {rx.toLocaleString("ru-RU")} тыс. руб.
                </span>
              </div>
            </div>

            {/* System Y variables */}
            <div className="bg-white border border-gray-100 shadow-xs rounded-xl p-5 space-y-3.5">
              <h4 className="text-xs font-bold text-gray-700 border-b border-gray-100 pb-2 flex items-center justify-between">
                Система Y
                <span className="text-[10px] text-gray-400 font-mono">Базово: К=10000, С=2840</span>
              </h4>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Капитальные вложения (тыс. руб.)
                </label>
                <input
                  type="number"
                  step="500"
                  min="0"
                  value={systemYCap}
                  onChange={(e) => setSystemYCap(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-700"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-gray-500 mb-1">
                  Текущие операционные затраты / год (тыс. руб.)
                </label>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={systemYCost}
                  onChange={(e) => setSystemYCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-gray-200 rounded-lg text-xs font-mono font-bold text-gray-700"
                />
              </div>
              <div className="pt-2 border-t border-gray-50 flex justify-between items-center">
                <span className="text-xs text-gray-500 font-semibold">Приведенные затраты:</span>
                <span className="text-sm font-extrabold text-slate-800 font-mono">
                  {ry.toLocaleString("ru-RU")} тыс. руб.
                </span>
              </div>
            </div>

            {/* Standard Coeff and Choice output */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 space-y-3.5">
              <h4 className="text-xs font-bold text-indigo-900 border-b border-indigo-100 pb-2">
                Нормокоэффициент эффективности E_n
              </h4>
              <div>
                <div className="flex justify-between items-center text-[10px] text-indigo-700 font-bold font-mono mb-1">
                  <span>Значение En</span>
                  <span>{normativeCoeff}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.01"
                  value={normativeCoeff}
                  onChange={(e) => setNormativeCoeff(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600"
                />
                <span className="text-[9px] text-indigo-500 leading-tight block mt-1.5">
                  Рекомендуемый стандарт: 0.15 (15% годовая норма окупаемости инвестиций)
                </span>
              </div>

              <div className="pt-3 border-t border-indigo-100">
                <span className="text-[10px] text-indigo-500 block mb-1">Лучшее решение в симуляции:</span>
                <span className="text-lg font-black text-emerald-700 block tracking-tight">
                  {optimalChoice}
                </span>
                <span className="text-[10px] text-slate-600 block leading-tight mt-1">
                  Экономический эффект в год: {(savings).toLocaleString("ru-RU")} тыс. руб. по сравнению с {worstChoice}.
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. TAB: ROI & Payback details */}
      {calcTab === "roi" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Логика оценки эффективности инвестиций
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Окупаемость достигается в тот момент, когда накопленный чистый денежный поток (NPV без дисконтирования) пересекает ось нуля и становится стабильно положительным.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">Текущий период окупаемости проекта:</span>
                <span className="text-xl font-bold text-indigo-600 font-mono block">{paybackPeriodLabel}</span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">Динамический ROI (Коэффициент рентабельности):</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black text-emerald-600 font-mono block">{roiRate}%</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roiJustified ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                    {roiJustified ? "Выше барьера 15%" : "Ниже барьера 15%"}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed italic">
              * Примечание: Альтернативная ставка доходности установлена в размере 15% годовых в соответствии с государственными и корпоративными нормативами для сопоставимых финансово-инженерных систем в РФ.
            </p>
          </div>

          <div className="bg-slate-900 text-slate-100 px-6 py-5 rounded-2xl flex flex-col justify-between border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400" />
                Заключение финансового аналитика
              </h3>
              <ul className="text-xs space-y-3.5 text-slate-300">
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span>
                    Среднегодовая прибыль проекта превышает рубеж в <strong>2 млн руб.</strong>, подтверждая надежность операционной структуры на 4-летнем горизонте планирования.
                  </span>
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span>
                    Накопленный доход к 5-му году составляет <strong>3.5 млн руб.</strong> чистой прибыли сверху первоначальных капитальных вложений.
                  </span>
                </li>
                <li className="flex gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0" />
                  <span>
                    Из двух изученных технических платформ наиболее экономичной является <strong>Система Y</strong> за счет меньшей ресурсоемкости капрасходов при схожей стоимости владения.
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Моделирование окончено</span>
              <span className="font-mono text-emerald-400">Статус: Стабильно</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
