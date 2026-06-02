/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Copy,
  Printer,
  Check,
  X,
  FileCheck2,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import {
  AnnualProfitItem,
  CashFlowItem,
  WeeklyRevenueItem,
  StatsCalculations
} from "../types";

interface ExportReportProps {
  profitData: AnnualProfitItem[];
  cashFlowData: CashFlowItem[];
  statsData: WeeklyRevenueItem[];
  statsCalculations: StatsCalculations;
  paybackPeriodLabel: string;
  roiRate: number;
  roiJustified: boolean;
  breakevenUnits: number;
  breakevenRevenue: number;
  systemXCosts: number;
  systemYCosts: number;
  optimalSystemName: string;
  optimalSystemReducedCosts: number;
}

export default function ExportReport({
  profitData,
  cashFlowData,
  statsData,
  statsCalculations,
  paybackPeriodLabel,
  roiRate,
  roiJustified,
  breakevenUnits,
  breakevenRevenue,
  systemXCosts,
  systemYCosts,
  optimalSystemName,
  optimalSystemReducedCosts
}: ExportReportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate markdown report text
  const generateMarkdownReport = () => {
    const today = new Date().toLocaleDateString("ru-RU");
    
    let markdown = `# ФИНАНСОВО-АНАЛИТИЧЕСКИЙ ОТЧЕТ ПО ПРОЕКТУ\n`;
    markdown += `Дата генерации: ${today}\n`;
    markdown += `-----------------------------------------------\n\n`;
    
    markdown += `## 1. КЛЮЧЕВЫЕ ПОКАЗАТЕЛИ ЭФФЕКТИВНОСТИ\n`;
    markdown += `- Годовой показатель ROI: ${roiRate}% (Требуемая альтернатива: 15% - ${roiJustified ? "ИНВЕСТИЦИИ ОПРАВДАНЫ" : "ИНВЕСТИЦИИ НЕ ОПРАВДАНЫ"})\n`;
    markdown += `- Ожидаемый период окупаемости: ${paybackPeriodLabel}\n`;
    markdown += `- Точка безубыточности в объемах: ${breakevenUnits} ед.\n`;
    markdown += `- Безубыточная выручка проекта: ${breakevenRevenue.toLocaleString("ru-RU")} тыс. руб.\n`;
    markdown += `- Выбранное лучшее решение (Приведенные затраты): ${optimalSystemName} (Затраты: ${optimalSystemReducedCosts.toLocaleString("ru-RU")} тыс. руб.)\n\n`;

    markdown += `## 2. СРАВНИТЕЛЬНЫЙ АНАЛИЗ ПРИВЕДЕННЫХ ЗАТРАТ\n`;
    markdown += `- Система X: ${systemXCosts.toLocaleString("ru-RU")} тыс. руб.\n`;
    markdown += `- Система Y: ${systemYCosts.toLocaleString("ru-RU")} тыс. руб.\n`;
    markdown += `*Преимущество ${optimalSystemName} перед конкурентом: ${Math.abs(systemXCosts - systemYCosts).toLocaleString("ru-RU")} тыс. руб. в год.*\n\n`;

    markdown += `## 3. ДИНАМИКА ПРИБЫЛИ ПО ГОДАМ (ТЫС. РУБ.)\n`;
    markdown += `| Год | Доходы | Расходы | Чистая прибыль |\n`;
    markdown += `| :--- | :--- | :--- | :--- |\n`;
    profitData.forEach(item => {
      markdown += `| ${item.year} | ${item.income} | ${item.expenses} | ${item.netProfit} |\n`;
    });
    markdown += `\n`;

    markdown += `## 4. ДНД И НАКОПЛЕННЫЙ КЭШ-ФЛО (ТЫС. РУБ.)\n`;
    markdown += `| Период | Чистый приток | Накопленный поток |\n`;
    markdown += `| :--- | :--- | :--- |\n`;
    cashFlowData.forEach(item => {
      markdown += `| ${item.year} | ${item.netFlow} | ${item.accumulatedFlow} |\n`;
    });
    markdown += `\n`;

    markdown += `## 5. ОПИСАТЕЛЬНАЯ СТАТИСТИКА ПРОДАЖ (12 недель)\n`;
    markdown += `- Средненедельная выручка (x̄): ${statsCalculations.mean} тыс. руб.\n`;
    markdown += `- Медианная выручка (Me): ${statsCalculations.median} тыс. руб.\n`;
    markdown += `- Стандартное отклонение выручки (σ): ${statsCalculations.stdDev} тыс. руб.\n`;
    markdown += `- Коэффициент вариации выручки (CV): ${statsCalculations.coeffVar}%\n`;
    markdown += `*Степень стабильности структуры продаж: ${statsCalculations.coeffVar < 10 ? "высокая однородность" : statsCalculations.coeffVar <= 33 ? "умеренная стабильность" : "высокая колеблемость рисков"}*\n\n`;

    markdown += `Конец отчета. Сформировано автоматически интерактивным дашбордом.`;
    return markdown;
  };

  const handleCopy = () => {
    const text = generateMarkdownReport();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="export-report-container">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
        id="open-report-modal-btn"
      >
        <FileText className="w-4 h-4" />
        Сгенерировать сводный отчет
      </button>

      {/* Modal dialog overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100"
              id="report-modal-window"
            >
              
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white flex-shrink-0">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-5 h-5 text-indigo-400" />
                  <span className="font-bold text-sm tracking-tight">
                    Экспорт аналитического заключения
                  </span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                  id="close-report-modal-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-slate-50 flex-shrink-0">
                <span className="text-xs text-gray-500 font-semibold">Выберите формат действий:</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-indigo-600 border border-gray-200 hover:border-indigo-200 rounded-lg text-xs font-semibold transition-all"
                    id="copy-markdown-btn"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        Скопировано!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Скопировать Markdown
                      </>
                    )}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-700 transition-colors"
                    id="print-report-btn"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Распечатать отчет (PDF)
                  </button>
                </div>
              </div>

              {/* Printable Body */}
              <div className="flex-1 overflow-y-auto p-8 font-sans text-gray-800 space-y-8" id="printable-report-area">
                
                {/* Visual Letterhead for printing */}
                <div className="text-center pb-6 border-b border-slate-200 text-slate-800">
                  <h1 className="text-2xl font-black uppercase tracking-tight">Экономический паспорт проекта</h1>
                  <p className="text-xs text-slate-500 mt-1">Окончательные расчёты и оценка финансовой целесообразности инвестиций</p>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md inline-block mt-2">
                    Создано: {new Date().toLocaleDateString("ru-RU")}
                  </span>
                </div>

                {/* Section 1: KPI Grid */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 border-l-4 border-indigo-600 pl-2">
                    1. Ключевые инвестиционные дескрипторы
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                    <div className="p-3.5 bg-slate-50 rounded-xl leading-tight border border-slate-100">
                      <span className="text-[10px] text-gray-400 font-bold block mb-1">CРЕДНЕГОДОВОЙ ROI</span>
                      <strong className="text-sm text-gray-800 font-mono block">{roiRate}%</strong>
                      <span className="text-[9px] text-slate-500 block">Ставка барьера: 15%</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl leading-tight border border-slate-100">
                      <span className="text-[10px] text-gray-400 font-bold block mb-1">СРОК ОКУПАЕМОСТИ</span>
                      <strong className="text-sm text-gray-800 font-mono block">{paybackPeriodLabel}</strong>
                      <span className="text-[9px] text-slate-500 block">DND без дисконтирования</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl leading-tight border border-slate-100">
                      <span className="text-[10px] text-gray-400 font-bold block mb-1">ТОЧКА БЕЗУБЫТОЧНОСТИ</span>
                      <strong className="text-sm text-gray-800 font-mono block">{breakevenUnits} ед.</strong>
                      <span className="text-[9px] text-slate-500 block">Выручка ТБУ: {breakevenRevenue.toLocaleString("ru-RU")} т.р.</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl leading-tight border border-slate-100">
                      <span className="text-[10px] text-gray-400 font-bold block mb-1">ОПТИМАЛЬНАЯ СИСТЕМА</span>
                      <strong className="text-sm text-emerald-700 font-extrabold block">{optimalSystemName}</strong>
                      <span className="text-[9px] text-slate-500 block">Приведенные затраты</span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Financial Tables */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
                  
                  {/* Table A: Income/Expenses */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800 border-l-2 border-indigo-400 pl-2">
                      2. Динамика прибыли проекта по годам
                    </h4>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase text-gray-500">
                          <th className="py-2 px-3">Год</th>
                          <th className="py-2 px-3 text-right">Доходы (т.р.)</th>
                          <th className="py-2 px-3 text-right">Расходы (т.р.)</th>
                          <th className="py-2 px-3 text-right text-emerald-700">Прибыль (т.р.)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {profitData.map((item, id) => (
                          <tr key={id} className="hover:bg-slate-50/30">
                            <td className="py-2 px-3 font-semibold text-gray-700">{item.year}</td>
                            <td className="py-2 px-3 text-right font-mono">{item.income}</td>
                            <td className="py-2 px-3 text-right font-mono">{item.expenses}</td>
                            <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600">{item.income - item.expenses}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Table B: Cash flow */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-800 border-l-2 border-indigo-400 pl-2">
                      3. Динамика движения денежных средств (Кэш-фло)
                    </h4>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase text-gray-500">
                          <th className="py-2 px-3">Период</th>
                          <th className="py-2 px-3 text-right">Приток (т.р.)</th>
                          <th className="py-2 px-3 text-right text-indigo-700">Накопленный (т.р.)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {cashFlowData.map((item, id) => (
                          <tr key={id} className="hover:bg-slate-50/30">
                            <td className="py-2 px-3 font-semibold text-gray-700">{item.year}</td>
                            <td className={`py-2 px-3 text-right font-mono font-semibold ${item.netFlow < 0 ? "text-red-500" : "text-gray-800"}`}>{item.netFlow}</td>
                            <td className={`py-2 px-3 text-right font-mono font-bold ${item.accumulatedFlow < 0 ? "text-amber-600" : "text-emerald-600"}`}>{item.accumulatedFlow}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Section 3: Descriptive Stats and Comparisons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed">
                  
                  {/* Stats Column */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 border-l-2 border-indigo-400 pl-2">
                      4. Статистика и изменчивость еженедельной выручки
                    </h4>
                    <ul className="space-y-2 list-none p-0 text-slate-600">
                      <li>• Среднее арифметическое выручки (x̄): <strong>{statsCalculations.mean} тыс. руб.</strong></li>
                      <li>• СКО отклонение выручки (σ): <strong>{statsCalculations.stdDev} тыс. руб.</strong></li>
                      <li>• Размах вариации (R): <strong>{statsCalculations.range} тыс. руб.</strong></li>
                      <li>• Коэффициент относительной вариации (CV): <strong className="text-indigo-600">{statsCalculations.coeffVar}%</strong></li>
                    </ul>
                    <p className="bg-slate-50 p-2.5 rounded text-[11px] leading-snug border border-slate-100">
                      Показатель {statsCalculations.coeffVar}% попадает в рамки{" "}
                      {statsCalculations.coeffVar < 10
                        ? "высокой устойчивости, продажи идут ровно без перепадов."
                        : statsCalculations.coeffVar <= 33
                        ? "нормальной коммерческой изменчивости (допустимый риск)."
                        : "высокого риска, что указывает на крайне неупорядоченный спрос."}
                    </p>
                  </div>

                  {/* Systems reduced costs comparison */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 border-l-2 border-indigo-400 pl-2">
                      5. Обоснование выбора инженерной системы
                    </h4>
                    <p className="text-slate-600 mb-2">
                      Сравнивались два конкурирующих предложения на основе теории приведенных дисконтных затрат с единым нормокоэффициентом эффективности:
                    </p>
                    <table className="w-full border shadow-2xs text-[11px]">
                      <tbody>
                        <tr className="border-b bg-slate-50 font-bold">
                          <td className="p-2">Решение</td>
                          <td className="p-2 text-right">Значение приведенных затрат</td>
                        </tr>
                        <tr>
                          <td className="p-2">Система X</td>
                          <td className="p-2 text-right font-mono">{systemXCosts.toLocaleString("ru-RU")} тыс. руб.</td>
                        </tr>
                        <tr className="bg-slate-50/50">
                          <td className="p-2">Система Y</td>
                          <td className="p-2 text-right font-mono">{systemYCosts.toLocaleString("ru-RU")} тыс. руб.</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="bg-emerald-50 text-emerald-800 p-2.5 rounded text-[11px] leading-snug border border-emerald-100 font-semibold mt-2">
                      Вывод: Рекомендован вариант {optimalSystemName}. Годовой приведенный экономический эффект составляет {Math.abs(systemXCosts - systemYCosts).toLocaleString("ru-RU")} тыс. руб. по сравнению с альтернативой.
                    </p>
                  </div>

                </div>

                {/* Footer line */}
                <div className="pt-8 border-t border-slate-200 text-center text-[10px] text-gray-400 leading-tight">
                  <p>Проект одобрен финансово-аналитической комиссией.</p>
                  <p className="mt-1">Экспертное заключение сгенерировано системой автоматического проектирования.</p>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
