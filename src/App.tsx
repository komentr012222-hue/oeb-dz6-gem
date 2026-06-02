/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Table,
  SlidersHorizontal,
  BookOpen,
  RotateCcw,
  TrendingUp,
  Cpu,
  BookmarkCheck,
  Building
} from "lucide-react";

// Types
import {
  AnnualProfitItem,
  CashFlowItem,
  WeeklyRevenueItem,
  BreakevenConfig
} from "./types";

// Baseline Data & Math Utils
import {
  INITIAL_PROFIT_DATA,
  INITIAL_CASH_FLOW_DATA,
  INITIAL_STATS_DATA,
  INITIAL_BREAKEVEN_CONFIG,
  INITIAL_COMPARE_SYSTEMS,
  calculatePaybackPeriod,
  calculateROI,
  calculateBreakeven,
  calculateDescriptiveStats,
  calculateReducedCosts
} from "./data";

// Components
import MetricCards from "./components/MetricCards";
import DashboardOverview from "./components/DashboardOverview";
import DataManager from "./components/DataManager";
import InteractiveCalculator from "./components/InteractiveCalculator";
import StatsAnalyzer from "./components/StatsAnalyzer";
import ExportReport from "./components/ExportReport";

export default function App() {
  // --- Core Dynamic State ---
  const [profitData, setProfitData] = useState<AnnualProfitItem[]>(INITIAL_PROFIT_DATA);
  const [cashFlowData, setCashFlowData] = useState<CashFlowItem[]>(INITIAL_CASH_FLOW_DATA);
  const [statsData, setStatsData] = useState<WeeklyRevenueItem[]>(INITIAL_STATS_DATA);
  const [breakevenConfig, setBreakevenConfig] = useState<BreakevenConfig>(INITIAL_BREAKEVEN_CONFIG);

  // States for System X vs System Y (Приведенные затраты)
  const [normativeCoeff, setNormativeCoeff] = useState<number>(INITIAL_COMPARE_SYSTEMS.normativeCoefficient);
  const [systemXCap, setSystemXCap] = useState<number>(INITIAL_COMPARE_SYSTEMS.systems[0].capitalInvestment);
  const [systemXCost, setSystemXCost] = useState<number>(INITIAL_COMPARE_SYSTEMS.systems[0].annualOperatingCosts);
  const [systemYCap, setSystemYCap] = useState<number>(INITIAL_COMPARE_SYSTEMS.systems[1].capitalInvestment);
  const [systemYCost, setSystemYCost] = useState<number>(INITIAL_COMPARE_SYSTEMS.systems[1].annualOperatingCosts);

  // App layout navigation tab state: dashboard / data / calculator / glossary
  const [activeTab, setActiveTab] = useState<"dashboard" | "data" | "calculator" | "glossary">("dashboard");

  // --- Reset handler ---
  const handleResetToBaseline = () => {
    setProfitData(INITIAL_PROFIT_DATA);
    setCashFlowData(INITIAL_CASH_FLOW_DATA);
    setStatsData(INITIAL_STATS_DATA);
    setBreakevenConfig(INITIAL_BREAKEVEN_CONFIG);
    setNormativeCoeff(INITIAL_COMPARE_SYSTEMS.normativeCoefficient);
    setSystemXCap(INITIAL_COMPARE_SYSTEMS.systems[0].capitalInvestment);
    setSystemXCost(INITIAL_COMPARE_SYSTEMS.systems[0].annualOperatingCosts);
    setSystemYCap(INITIAL_COMPARE_SYSTEMS.systems[1].capitalInvestment);
    setSystemYCost(INITIAL_COMPARE_SYSTEMS.systems[1].annualOperatingCosts);
  };

  // --- Derived Calculations (Computed live based on current state arrays) ---
  
  // 1. Payback Period
  const paybackInfo = useMemo(() => {
    return calculatePaybackPeriod(cashFlowData);
  }, [cashFlowData]);

  // 2. Annual ROI
  const roiInfo = useMemo(() => {
    const netProfitsArray = profitData.map((item) => item.netProfit);
    return calculateROI(netProfitsArray, paybackInfo.investmentAmount || 7500);
  }, [profitData, paybackInfo.investmentAmount]);

  // 3. Breakeven
  const breakevenInfo = useMemo(() => {
    return calculateBreakeven(breakevenConfig);
  }, [breakevenConfig]);

  // 4. Descriptive Statistics
  const statsCalculations = useMemo(() => {
    const revenueArray = statsData.map((item) => item.revenue);
    return calculateDescriptiveStats(revenueArray);
  }, [statsData]);

  // 5. Advanced System Reduced Cost comparison ($C + E_n \cdot K$)
  const systemXCosts = useMemo(() => {
    return calculateReducedCosts(systemXCap, systemXCost, normativeCoeff);
  }, [systemXCap, systemXCost, normativeCoeff]);

  const systemYCosts = useMemo(() => {
    return calculateReducedCosts(systemYCap, systemYCost, normativeCoeff);
  }, [systemYCap, systemYCost, normativeCoeff]);

  const optimalSystemName = systemXCosts < systemYCosts ? "Система X" : "Система Y";
  const optimalSystemReducedCosts = Math.min(systemXCosts, systemYCosts);

  // 6. Total Net Profit summation over planning years
  const totalProfitSum = useMemo(() => {
    return profitData.reduce((sum, item) => sum + item.netProfit, 0);
  }, [profitData]);

  return (
    <div className="relative min-h-screen text-slate-800 antialiased font-sans flex flex-col justify-between selection:bg-indigo-600/15" id="app-root">
      
      {/* Background Video (Index page wrapper) - No gradient overlays */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover -z-10 pointer-events-none"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_065045_c44942da-53c6-4804-b734-f9e07fc22e08.mp4"
      />

      {/* Top Professional Executive Header */}
      <header className="bg-white/92 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-40" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-900 text-white p-2.5 rounded-xl flex items-center justify-center">
              <Building className="w-5.5 h-5.5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Аналитический Дашборд Проекта
              </h1>
              <p className="text-xs text-gray-500">Сводка экономических показателей: Прибыль, ROI, Окупаемость, Системный анализ и Статистика</p>
            </div>
          </div>

          {/* Global Exports / Resets */}
          <div className="flex items-center gap-2.5 self-start md:self-center">
            <button
              onClick={handleResetToBaseline}
              className="px-3 py-2 bg-slate-100/80 hover:bg-slate-200/90 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors backdrop-blur-xs"
              title="Сбросить все внесенные изменения к исходным Excel значениям"
              id="reset-dashboard-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Восстановить базовые данные
            </button>

            {/* Premium Exporter Module Modal Trigger */}
            <ExportReport
              profitData={profitData}
              cashFlowData={cashFlowData}
              statsData={statsData}
              statsCalculations={statsCalculations}
              paybackPeriodLabel={paybackInfo.label}
              roiRate={roiInfo.rate}
              roiJustified={roiInfo.isJustified}
              breakevenUnits={breakevenInfo.units}
              breakevenRevenue={breakevenInfo.revenue}
              systemXCosts={systemXCosts}
              systemYCosts={systemYCosts}
              optimalSystemName={optimalSystemName}
              optimalSystemReducedCosts={optimalSystemReducedCosts}
            />
          </div>
        </div>
      </header>

      {/* Main Structural Layout Wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8 relative z-10" id="dashboard-main-content">
        
        {/* Dynamic Navigation Rail Tabs */}
        <div className="flex flex-wrap border-b border-slate-200/60 mb-6 gap-1" id="nav-tabs-rail">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold font-sans uppercase tracking-wider rounded-t-xl transition-all border-t-2 border-x ${
              activeTab === "dashboard"
                ? "bg-white/95 backdrop-blur-md border-indigo-600 text-indigo-700 font-extrabold border-slate-200/60"
                : "bg-slate-50/50 hover:bg-slate-50/80 backdrop-blur-xs border-transparent text-slate-600 hover:text-slate-800"
            }`}
            id="tab-btn-dashboard"
          >
            <LayoutDashboard className="w-4 h-4" />
            Интерфейс дашборда
          </button>

          <button
            onClick={() => setActiveTab("data")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold font-sans uppercase tracking-wider rounded-t-xl transition-all border-t-2 border-x ${
              activeTab === "data"
                ? "bg-white/95 backdrop-blur-md border-indigo-600 text-indigo-700 font-extrabold border-slate-200/60"
                : "bg-slate-50/50 hover:bg-slate-50/80 backdrop-blur-xs border-transparent text-slate-600 hover:text-slate-800"
            }`}
            id="tab-btn-data"
          >
            <Table className="w-4 h-4" />
            Редактор таблиц
          </button>

          <button
            onClick={() => setActiveTab("calculator")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold font-sans uppercase tracking-wider rounded-t-xl transition-all border-t-2 border-x ${
              activeTab === "calculator"
                ? "bg-white/95 backdrop-blur-md border-indigo-600 text-indigo-700 font-extrabold border-slate-200/60"
                : "bg-slate-50/50 hover:bg-slate-50/80 backdrop-blur-xs border-transparent text-slate-600 hover:text-slate-800"
            }`}
            id="tab-btn-calculator"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Симуляторы-калькуляторы
          </button>

          <button
            onClick={() => setActiveTab("glossary")}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-bold font-sans uppercase tracking-wider rounded-t-xl transition-all border-t-2 border-x ${
              activeTab === "glossary"
                ? "bg-white/95 backdrop-blur-md border-indigo-600 text-indigo-700 font-extrabold border-slate-200/60"
                : "bg-slate-50/50 hover:bg-slate-50/80 backdrop-blur-xs border-transparent text-slate-600 hover:text-slate-800"
            }`}
            id="tab-btn-glossary"
          >
            <BookOpen className="w-4 h-4" />
            Методический глоссарий
          </button>
        </div>

        {/* Dynamic Transition Router Viewport */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CORE DASHBOARD */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Stat Widgets */}
              <MetricCards
                roiRate={roiInfo.rate}
                roiJustified={roiInfo.isJustified}
                alternativeRate={roiInfo.alternativeRate}
                paybackPeriodLabel={paybackInfo.label}
                investmentAmount={paybackInfo.investmentAmount}
                breakevenUnits={breakevenInfo.units}
                breakevenRevenue={breakevenInfo.revenue}
                averageAnnualProfit={roiInfo.averageAnnualProfit}
                totalProfit={totalProfitSum}
                optimalSystemName={optimalSystemName}
                optimalSystemReducedCosts={optimalSystemReducedCosts}
              />

              {/* Recharts Grid */}
              <DashboardOverview
                profitData={profitData}
                cashFlowData={cashFlowData}
                statsData={statsData}
                statsCalculations={statsCalculations}
                systemXCosts={systemXCosts}
                systemYCosts={systemYCosts}
              />

              {/* Weekly Descriptive Stats Section detailed breakdown */}
              <StatsAnalyzer stats={statsCalculations} dataLength={statsData.length} />
            </motion.div>
          )}

          {/* TAB 2: DATA MANAGER TABLE EDITOR */}
          {activeTab === "data" && (
            <motion.div
              key="data-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <DataManager
                profitData={profitData}
                setProfitData={setProfitData}
                cashFlowData={cashFlowData}
                setCashFlowData={setCashFlowData}
                statsData={statsData}
                setStatsData={setStatsData}
                onResetToBaseline={handleResetToBaseline}
              />
            </motion.div>
          )}

          {/* TAB 3: ADVANCED SCENARIO CALCULATOR */}
          {activeTab === "calculator" && (
            <motion.div
              key="calculator-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <InteractiveCalculator
                breakevenConfig={breakevenConfig}
                setBreakevenConfig={setBreakevenConfig}
                normativeCoeff={normativeCoeff}
                setNormativeCoeff={setNormativeCoeff}
                systemXCap={systemXCap}
                setSystemXCap={setSystemXCap}
                systemXCost={systemXCost}
                setSystemXCost={setSystemXCost}
                systemYCap={systemYCap}
                setSystemYCap={setSystemYCap}
                systemYCost={systemYCost}
                setSystemYCost={setSystemYCost}
                paybackPeriodLabel={paybackInfo.label}
                roiRate={roiInfo.rate}
                roiJustified={roiInfo.isJustified}
              />
            </motion.div>
          )}

          {/* TAB 4: ECONOMICS GLOSSARY & STUDY REFERENCE */}
          {activeTab === "glossary" && (
            <motion.div
              key="glossary-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6"
              id="glossary-document-view"
            >
              <div className="border-b border-gray-100 pb-4 mb-2">
                <h2 className="text-lg font-bold text-slate-800">Методический справочник экономических формул</h2>
                <p className="text-xs text-gray-400">Формализованный академический базис, лежащий в основе алгоритмов калькуляции дашборда</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 leading-relaxed">
                
                <div className="space-y-2.5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-950 text-sm flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    ROI (Коэффициент окупаемости инвестиций)
                  </h3>
                  <p>
                    <strong>Годовая рентабельность инвестиций (Return on Investment)</strong> определяет эффективность вложения капитала в исследуемый проект. Расчитывается как процентное отношение среднегодовой чистой прибыли к первоначальному объему инвестиций.
                  </p>
                  <code className="block bg-slate-950 text-slate-200 p-2 rounded-lg font-mono text-[11px] text-center">
                    ROI = (Среднегодовая прибыль / Первичные Инвестиции) × 100%
                  </code>
                  <p>
                    В соответствии с общепринятыми критериями, инвестиция считается целесообразной, если полученный процент ROI превосходит альтернативную безрисковую ставку доходности (в наших расчетах установленную как <strong>15%</strong>).
                  </p>
                </div>

                <div className="space-y-2.5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-950 text-sm flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    {"Приведенные дисконтированные затраты ($E_{прив}$)"}
                  </h3>
                  <p>
                    <strong>Приведенные затраты</strong> используются в инженерно-экономических дисциплинах для выявления лучшего технического решения при сравнении различных вариантов создания и владения системами с разным удельным весом единовременных и периодических трат.
                  </p>
                  <code className="block bg-slate-950 text-slate-200 p-2 rounded-lg font-mono text-[11px] text-center">
                    E прив = C + (E n × K)
                  </code>
                  <p>
                    Где <strong>C</strong> — ежегодные издержки (себестоимость); <strong>K</strong> — общие капиталовложения; <strong>En</strong> — коэффициент эффективности (0.15). Из представленных вариантов выбирается система, у которой приведенные затраты оказываются <strong>наименьшими</strong>.
                  </p>
                </div>

                <div className="space-y-2.5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-950 text-sm flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5">
                    <BookmarkCheck className="w-4 h-4 text-amber-600" />
                    Анализ безубыточности (CVP-анализ)
                  </h3>
                  <p>
                    CVP-анализ (Cost-Volume-Profit) отображает взаимосвязь между ценой, себестоимостью, объемами продаж и доходом. Он рассчитывает физический уровень продаж (в штуках) для бездефицитного прохождения точки окупаемости (прибыль = 0).
                  </p>
                  <code className="block bg-slate-950 text-slate-200 p-2 rounded-lg font-mono text-[11px] text-center">
                    Точка в ед. = Постоянные Затраты / (Цена ед. - Переменные на ед.)
                  </code>
                  <code className="block bg-slate-950 text-slate-200 p-2 rounded-lg font-mono text-[11px] text-center mt-1">
                    Запас Финансовой Прочности = ((Объем - ТБУ) / Объем) × 100%
                  </code>
                  <p>
                    Запас прочности показывает, на сколько процентов проект может снизить продажи до порога ухода в операционный убыток.
                  </p>
                </div>

                <div className="space-y-2.5 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <h3 className="font-bold text-slate-950 text-sm flex items-center gap-1.5 border-b border-slate-200/60 pb-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                    Описательная статистика и колебания (CV)
                  </h3>
                  <p>
                    Позволяет оценить характер изменчивости еженедельной выручки с помощью математического ожидания (среднего значения x̄) и величины среднего разброса (СКО, $\sigma$). Мера стабильности определяется коэффициентом вариации (CV):
                  </p>
                  <code className="block bg-slate-950 text-slate-200 p-2 rounded-lg font-mono text-[11px] text-center">
                    CV = (Стандартное Отклонение / Среднее) × 100%
                  </code>
                  <p>
                    В планах сбыта значение CV ниже 10% фиксирует абсолютную однородность выручки; от 10% до 33% — нормативный контролируемый уровень колебаний; выше 33% — сигнал о высокой рискованности прогнозов.
                  </p>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      {/* Elegant Standard Slate Footer */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center text-xs text-slate-400 font-mono mt-12" id="main-footer">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Финансово-аналитический Дашборд Проекта</p>
          <p className="mt-1 text-[11px] text-slate-300">Разработано в соответствии с государственными стандартами РФ по ТЭО инвестиций</p>
        </div>
      </footer>

    </div>
  );
}
