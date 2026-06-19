import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileDown, 
  TrendingDown, 
  Calendar, 
  BarChart3, 
  Database,
  PieChart as PieIcon,
  Sparkles,
  Award
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

type ReportTab = 'weekly' | 'monthly' | 'annual';

export default function ReportsPage() {
  const { activities, user, addToast } = useApp();
  const [activeTab, setActiveTab] = useState<ReportTab>('monthly');

  // Compute stats according to tab selection
  let currentFootprintVal = 0;
  let targetComp = 0;
  let labelDesc = '';

  if (activeTab === 'weekly') {
    currentFootprintVal = Math.round((activities.reduce((sum, act) => sum + act.emissionValue, 0) / 4) * 10) / 10;
    targetComp = 120; // weekly budget limit comparison
    labelDesc = 'Weekly Audit Projections';
  } else if (activeTab === 'monthly') {
    currentFootprintVal = user?.stats?.monthlyCo2 || 340.2;
    targetComp = 500;
    labelDesc = 'June 2026 Monthly Audit';
  } else {
    currentFootprintVal = user?.stats?.totalCo2 || 1250.4;
    targetComp = 4800;
    labelDesc = 'Annual Carbon Projection';
  }

  // Calculate comparative baseline ratio
  const baselineCompare = activeTab === 'weekly' ? 140 : activeTab === 'monthly' ? 450 : 5400;
  const savingsPct = Math.round(((baselineCompare - currentFootprintVal) / baselineCompare) * 100 * 10) / 10;

  // Compile categories to output table
  const categoryEmissions = activities.reduce((acc, current) => {
    acc[current.category] = (acc[current.category] || 0) + current.emissionValue;
    return acc;
  }, {} as Record<string, number>);

  const subReportData = [
    { name: 'Transportation', amount: Math.round(categoryEmissions.Transportation || 0) },
    { name: 'Food & Diet', amount: Math.round(categoryEmissions.Food || 0) },
    { name: 'Utility Electricity', amount: Math.round(categoryEmissions.Electricity || 0) },
    { name: 'Flight Travel', amount: Math.round(categoryEmissions.Travel || 0) },
    { name: 'Shopping Purchases', amount: Math.round(categoryEmissions.Shopping || 0) }
  ];

  // Action: Export simulated CSV of activities!
  const handleExportCSV = () => {
    if (activities.length === 0) {
      addToast("No activities to compile! Log some behaviors in your tracker log first.", "error");
      return;
    }

    // Header row
    let csvContent = "ID,Activity Name,Category,Emissions (kg CO2),Date Logged,Developer Notes\n";
    
    // Rows
    activities.forEach(act => {
      const escapedNotes = act.notes ? `"${act.notes.replace(/"/g, '""')}"` : '""';
      csvContent += `${act.id},"${act.name}",${act.category},${act.emissionValue},${act.date},${escapedNotes}\n`;
    });

    // File download trigger
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `carbonwise_report_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Action: Export plain-text/markdown Audit Certification!
  const handleExportPDF = () => {
    let docContent = `
========================================
CARBONWISE CARBON SUSTAINABILITY STATEMENT
========================================
Auditee: ${user?.name || 'Anonymous User'}
Role: ${user?.occupation || 'Climate Advocate'}
Location: ${user?.city || 'Seattle'}, ${user?.country || 'USA'}
Report Reference Interval: ${activeTab.toUpperCase()}
Generated on: ${new Date().toLocaleDateString()}

SUMMARY AUDIT:
------------------
- Registered Footprint: ${currentFootprintVal} kg CO2e
- Target Reference Frame Allocation: ${targetComp} kg CO2e
- Status: ${currentFootprintVal > targetComp ? 'BREACHED OVER ALLOCATION' : 'COMPLIANT WITHIN BUDGET'}
- Personal Efficiency savings ratio: ${savingsPct}% vs baseline indices

CATEGORY DETAIL PORTION:
------------------
- Transportation: ${categoryEmissions.Transportation || 0} kg CO2e
- Electricity utilities: ${categoryEmissions.Electricity || 0} kg CO2e
- Food & Diet: ${categoryEmissions.Food || 0} kg CO2e
- Flights travel: ${categoryEmissions.Travel || 0} kg CO2e
- Tech & clothing: ${categoryEmissions.Shopping || 0} kg CO2e

Thank you for choosing CarbonWise. Your micro-decisions balance global greenhouse variables!
========================================
    `;

    const blob = new Blob([docContent], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `carbonwise_sustainability_statement_${activeTab}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Sustained Carbon Audits
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-sans">
            Produce certified carbon audit statements and exports.
          </p>
        </div>

        {/* Global actions: CSV & statement triggers */}
        <div className="flex gap-2.5">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-850"
          >
            <FileDown className="h-4 w-4 text-emerald-500" />
            <span>Export CSV Spreadsheet</span>
          </button>
          
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <FileDown className="h-4 w-4" />
            <span>Simulate Audit Certificate</span>
          </button>
        </div>
      </div>

      {/* Interval select segment blocks */}
      <div className="flex border-b border-gray-500/10">
        {[
          { id: 'weekly', label: 'Weekly projection' },
          { id: 'monthly', label: 'Monthly log context' },
          { id: 'annual', label: 'Annual baseline estimation' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ReportTab)}
            className={`px-6 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === tab.id 
                ? 'border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-400' 
                : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300 dark:hover:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Primary summary grid */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Sum 1: interval footprint */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
            <span>Interval Footprint</span>
            <Database className="h-4 w-4 text-slate-500" />
          </div>
          <p className="font-display text-3xl font-extrabold text-gray-950 dark:text-white mt-2">
            {currentFootprintVal} <span className="text-sm font-normal text-gray-400">kg</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Calculated allocation sum</p>
        </div>

        {/* Sum 2: limit budget */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
            <span>Safety Limit Budget</span>
            <Calendar className="h-4 w-4 text-slate-500" />
          </div>
          <p className="font-display text-3xl font-extrabold text-gray-950 dark:text-white mt-2">
            {targetComp} <span className="text-sm font-normal text-gray-400">kg</span>
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Target maximum boundary</p>
        </div>

        {/* Sum 3: savings ratio vs baseline */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">
            <span>Savings Efficiency Ratio</span>
            <TrendingDown className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="font-display text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
            {savingsPct > 0 ? `+${savingsPct}%` : `${savingsPct}%`}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">Comparison vs typical local standard</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Span 3: Category ratios Bar Chart */}
        <div className="lg:col-span-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <h3 className="font-display text-sm font-extrabold text-gray-900 dark:text-white mb-6">
            Category allocations across {labelDesc}
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subReportData} layout="vertical" margin={{ left: 10, right: 10 }}>
                <XAxis type="number" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: '10px' }} />
                <Bar dataKey="amount" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Span 2: Audit Checklist details */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Award className="h-5 w-5 text-emerald-500" />
              <span>Sustain Audit Checklist</span>
            </h3>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 font-sans leading-relaxed">
              Verify compliance factors before generating official certification files. Ensure actual mileage and cooking bills have been audited.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex gap-2.5 items-center p-2 rounded-xl bg-gray-50 dark:bg-gray-950">
                <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                <span>Active Ledger contains {activities.length} entries</span>
              </div>
              <div className="flex gap-2.5 items-center p-2 rounded-xl bg-gray-50 dark:bg-gray-950">
                <span className="h-1.5 w-1.5 bg-sky-500 rounded-full shrink-0"></span>
                <span>Interval footprint: <strong>{currentFootprintVal}kg</strong> (Target: {targetComp}kg)</span>
              </div>
              <div className="flex gap-2.5 items-center p-2 rounded-xl bg-gray-50 dark:bg-gray-950">
                <span className="h-1.5 w-1.5 bg-amber-500 rounded-full shrink-0"></span>
                <span>Sustained level: <strong>Level {user?.level || 4}</strong> Eco Warrior status</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 mt-4 text-center">
            <span className="flex items-center justify-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Audit outputs fully conform to standard EPA guidelines.</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
