/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  AnnualProfitItem,
  CashFlowItem,
  WeeklyRevenueItem
} from "../types";
import {
  Save,
  Plus,
  Trash2,
  ListRestart,
  Table,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface DataManagerProps {
  profitData: AnnualProfitItem[];
  setProfitData: React.Dispatch<React.SetStateAction<AnnualProfitItem[]>>;
  cashFlowData: CashFlowItem[];
  setCashFlowData: React.Dispatch<React.SetStateAction<CashFlowItem[]>>;
  statsData: WeeklyRevenueItem[];
  setStatsData: React.Dispatch<React.SetStateAction<WeeklyRevenueItem[]>>;
  onResetToBaseline: () => void;
}

export default function DataManager({
  profitData,
  setProfitData,
  cashFlowData,
  setCashFlowData,
  statsData,
  setStatsData,
  onResetToBaseline
}: DataManagerProps) {
  const [activeTab, setActiveTab] = useState<"profit" | "cashflow" | "stats">("profit");
  const [successMsg, setSuccessMsg] = useState("");

  const triggerSuccesMessage = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg("");
    }, 3000);
  };

  // --- Profit Data Handlers ---
  const handleProfitChange = (index: number, field: "income" | "expenses", value: string) => {
    const numVal = parseFloat(value) || 0;
    const newData = [...profitData];
    newData[index] = {
      ...newData[index],
      [field]: numVal,
      netProfit: field === "income" ? numVal - newData[index].expenses : newData[index].income - numVal
    };
    setProfitData(newData);
  };

  const addProfitYear = () => {
    const nextYearNum = profitData.length + 1;
    setProfitData([
      ...profitData,
      {
        year: `${nextYearNum}-й год`,
        income: 8000,
        expenses: 6000,
        netProfit: 2000
      }
    ]);
    triggerSuccesMessage("Год успешно добавлен");
  };

  const removeProfitYear = (index: number) => {
    if (profitData.length <= 1) return;
    setProfitData(profitData.filter((_, idx) => idx !== index));
    triggerSuccesMessage("Год удален");
  };

  // --- Cash Flow Handlers ---
  const handleCashFlowChange = (index: number, value: string) => {
    const numVal = parseFloat(value) || 0;
    const newData = [...cashFlowData];
    newData[index] = {
      ...newData[index],
      netFlow: numVal
    };

    // Recalculate accumulated flows sequentially
    let currentSum = 0;
    const computedData = newData.map((item) => {
      currentSum += item.netFlow;
      return {
        ...item,
        accumulatedFlow: currentSum
      };
    });

    setCashFlowData(computedData);
  };

  const addCashFlowYear = () => {
    const nextYearNum = cashFlowData.length;
    const lastItem = cashFlowData[cashFlowData.length - 1];
    const newNetFlow = 2000;
    const newAccum = lastItem ? lastItem.accumulatedFlow + newNetFlow : newNetFlow;
    
    setCashFlowData([
      ...cashFlowData,
      {
        year: `Год ${nextYearNum}`,
        netFlow: newNetFlow,
        accumulatedFlow: newAccum
      }
    ]);
    triggerSuccesMessage("Период движения денежных средств добавлен");
  };

  const removeCashFlowYear = (index: number) => {
    if (cashFlowData.length <= 1) return;
    const filtered = cashFlowData.filter((_, idx) => idx !== index);
    
    // Recalculate accumulated flows sequentially
    let currentSum = 0;
    const computedData = filtered.map((item) => {
      currentSum += item.netFlow;
      return {
        ...item,
        accumulatedFlow: currentSum
      };
    });

    setCashFlowData(computedData);
    triggerSuccesMessage("Период движения денежных средств удален");
  };

  // --- Weekly Revenue Handlers ---
  const handleWeeklyRevenueChange = (index: number, value: string) => {
    const numVal = parseFloat(value) || 0;
    const newData = [...statsData];
    newData[index] = {
      ...newData[index],
      revenue: numVal
    };
    setStatsData(newData);
  };

  const addWeek = () => {
    const nextWeekNum = statsData.length + 1;
    setStatsData([
      ...statsData,
      {
        week: `Нед ${nextWeekNum}`,
        revenue: 95
      }
    ]);
    triggerSuccesMessage("Неделя добавлена");
  };

  const removeWeek = (index: number) => {
    if (statsData.length <= 1) return;
    setStatsData(statsData.filter((_, idx) => idx !== index));
    triggerSuccesMessage("Неделя удалена");
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm" id="data-manager-panel">
      
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-6 border-b border-gray-100 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <Table className="w-5 h-5 text-indigo-600" />
            Редактор табличных данных
          </h2>
          <p className="text-xs text-gray-400">Изменение полей мгновенно пересчитает аналитику и построит новые графики</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={onResetToBaseline}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-slate-50 transition-colors"
            id="reset-baseline-btn"
          >
            <ListRestart className="w-3.5 h-3.5" />
            Сбросить к исходным
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-6 gap-2">
        <button
          onClick={() => setActiveTab("profit")}
          className={`pb-2.5 px-4 text-sm font-semibold transition-all relative ${
            activeTab === "profit"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
          id="editor-tab-profit"
        >
          Прибыли компаний по годам
        </button>
        <button
          onClick={() => setActiveTab("cashflow")}
          className={`pb-2.5 px-4 text-sm font-semibold transition-all relative ${
            activeTab === "cashflow"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
          id="editor-tab-cashflow"
        >
          Движение денежных средств (Кэш-фло)
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={`pb-2.5 px-4 text-sm font-semibold transition-all relative ${
            activeTab === "stats"
              ? "text-indigo-600 border-b-2 border-indigo-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
          id="editor-tab-stats"
        >
          Недельная выручка замеры
        </button>
      </div>

      {/* Message feedback */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 bg-emerald-50 text-emerald-700 text-xs font-semibold p-2.5 rounded-lg flex items-center gap-2 border border-emerald-100"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {successMsg}
        </motion.div>
      )}

      {/* Tab Contents: Profit */}
      {activeTab === "profit" && (
        <div className="space-y-4">
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs text-left">
                <tr>
                  <th className="px-6 py-3 font-semibold">Год планирования</th>
                  <th className="px-6 py-3 font-semibold">Доходы (тыс. руб.)</th>
                  <th className="px-6 py-3 font-semibold">Расходы (тыс. руб.)</th>
                  <th className="px-6 py-3 font-semibold text-emerald-600">Чистая прибыль (Рекалькуляция)</th>
                  <th className="px-6 py-3 font-semibold text-center w-20">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 divide-solid">
                {profitData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-gray-700">{item.year}</td>
                    <td className="px-6 py-3.5">
                      <input
                        type="number"
                        min="0"
                        value={item.income || ""}
                        onChange={(e) => handleProfitChange(index, "income", e.target.value)}
                        className="w-full max-w-[160px] px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-800 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </td>
                    <td className="px-6 py-3.5">
                      <input
                        type="number"
                        min="0"
                        value={item.expenses || ""}
                        onChange={(e) => handleProfitChange(index, "expenses", e.target.value)}
                        className="w-full max-w-[160px] px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-800 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </td>
                    <td className="px-6 py-3.5 font-bold text-emerald-600 font-mono">
                      {(item.income - item.expenses).toLocaleString("ru-RU")} тыс. руб.
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <button
                        onClick={() => removeProfitYear(index)}
                        disabled={profitData.length <= 1}
                        className="p-1 px-2.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        title="Удалить строку"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addProfitYear}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            id="add-profit-year-btn"
          >
            <Plus className="w-4 h-4" />
            Добавить еще один год
          </button>
        </div>
      )}

      {/* Tab Contents: Cashflow */}
      {activeTab === "cashflow" && (
        <div className="space-y-4">
          <div className="overflow-x-auto border border-gray-100 rounded-xl">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-xs text-left">
                <tr>
                  <th className="px-6 py-3 font-semibold">Временной шаг</th>
                  <th className="px-6 py-3 font-semibold">Чистый Ден. Поток (тыс. руб.)</th>
                  <th className="px-6 py-3 font-semibold text-amber-600">Накопленный поток (Рекалькуляция)</th>
                  <th className="px-6 py-3 font-semibold text-center w-20">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 divide-solid">
                {cashFlowData.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-semibold text-gray-700">
                      {item.year}
                      {index === 0 && <span className="ml-2 text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Инвестиционный этап</span>}
                    </td>
                    <td className="px-6 py-3.5">
                      <input
                        type="number"
                        value={item.netFlow || ""}
                        onChange={(e) => handleCashFlowChange(index, e.target.value)}
                        className="w-full max-w-[200px] px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-mono text-gray-800 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </td>
                    <td className={`px-6 py-3.5 font-bold font-mono ${item.accumulatedFlow >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                      {item.accumulatedFlow.toLocaleString("ru-RU")} тыс. руб.
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <button
                        onClick={() => removeCashFlowYear(index)}
                        disabled={cashFlowData.length <= 1}
                        className="p-1 px-2.5 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        title="Удалить шаг"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addCashFlowYear}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            id="add-cashflow-step-btn"
          >
            <Plus className="w-4 h-4" />
            Добавить шаг (Год)
          </button>
        </div>
      )}

      {/* Tab Contents: Stats */}
      {activeTab === "stats" && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 bg-slate-50 p-3 rounded-lg flex items-center gap-2 border border-slate-100 leading-relaxed">
            <AlertCircle className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            Эти цифры отражают еженедельную выручку проекта и используются для дисперсионного и среднеквадратического анализа в секции описательной статистики.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
            {statsData.map((item, index) => (
              <div key={index} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 flex items-center justify-between gap-2.5">
                <span className="text-xs font-bold font-mono text-slate-500">{item.week}</span>
                <input
                  type="number"
                  min="0"
                  value={item.revenue || ""}
                  onChange={(e) => handleWeeklyRevenueChange(index, e.target.value)}
                  className="w-24 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-indigo-700 text-right focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={() => removeWeek(index)}
                  disabled={statsData.length <= 1}
                  className="text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addWeek}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
            id="add-week-btn"
          >
            <Plus className="w-4 h-4" />
            Добавить неделю замера
          </button>
        </div>
      )}

    </div>
  );
}
