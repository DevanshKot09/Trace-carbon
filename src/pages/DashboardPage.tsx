import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingDown, 
  Leaf, 
  Calendar, 
  Smile, 
  TrendingUp, 
  Plus, 
  Flame, 
  Car, 
  Zap, 
  ShoppingBag, 
  Plane,
  ChevronRight,
  Sparkles,
  Award,
  ArrowUpRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import ActivityFormModal from '../components/ActivityFormModal';
import { CardSkeleton } from '../components/Skeletons';

// Colors for category breakdown chart
const COLORS = {
  Transportation: '#0ea5e9', // Sky Blue
  Electricity: '#eab308',     // Electric Yellow
  Food: '#f97316',            // Warm Orange
  Travel: '#8b5cf6',          // Travel Purple
  Shopping: '#10b981'         // Eco Green
};

export default function DashboardPage() {
  const { user, activities, goals, addActivity, loading } = useApp();
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);

  // Group emissions by category for standard Pie Chart
  const categoryEmissions = activities.reduce((acc, current) => {
    acc[current.category] = (acc[current.category] || 0) + current.emissionValue;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(COLORS).map(cat => ({
    name: cat,
    value: Math.round((categoryEmissions[cat] || 0) * 10) / 10
  })).filter(item => item.value > 0);

  // Fallback pie data if empty, to keep the dashboard look premium
  const displayPieData = pieData.length > 0 ? pieData : [
    { name: 'Transportation', value: 120 },
    { name: 'Electricity', value: 180 },
    { name: 'Food', value: 95 },
    { name: 'Travel', value: 0 },
    { name: 'Shopping', value: 45 }
  ];

  // Simulated trend data across past months
  const monthlyBarData = [
    { month: 'Jan', Footprint: 450, Target: 400 },
    { month: 'Feb', Footprint: 410, Target: 400 },
    { month: 'Mar', Footprint: 390, Target: 380 },
    { month: 'Apr', Footprint: 380, Target: 350 },
    { month: 'May', Footprint: 355, Target: 350 },
    { month: 'Jun', Footprint: Math.round((user?.stats?.monthlyCo2 || 340.2) * 10) / 10, Target: 320 }
  ];

  // Daily emission trend line data
  const trendLineData = [
    { date: '06-10', co2: 12 },
    { date: '06-11', co2: 8 },
    { date: '06-12', co2: 45 },
    { date: '06-13', co2: 14 },
    { date: '06-14', co2: 34 },
    { date: '06-15', co2: 40.9 },
    { date: '06-16', co2: 50.2 },
    { date: '06-17', co2: 4.2 }
  ];

  const getCategoryIcon = (cat: string) => {
    if (cat === 'Transportation') return <Car className="h-4 w-4" style={{ color: COLORS.Transportation }} />;
    if (cat === 'Electricity') return <Zap className="h-4 w-4" style={{ color: COLORS.Electricity }} />;
    if (cat === 'Food') return <Flame className="h-4 w-4" style={{ color: COLORS.Food }} />;
    if (cat === 'Travel') return <Plane className="h-4 w-4" style={{ color: COLORS.Travel }} />;
    return <ShoppingBag className="h-4 w-4" style={{ color: COLORS.Shopping }} />;
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return { label: 'Outstanding Eco Index!', color: 'text-emerald-500' };
    if (score >= 60) return { label: 'Good Carbon Habit', color: 'text-teal-500' };
    return { label: 'Above average energy foot', color: 'text-amber-500' };
  };

  // Safe fetch checking
  if (loading && !user) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded bg-gray-200 animate-pulse dark:bg-gray-800"></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <CardSkeleton /> <CardSkeleton /> <CardSkeleton /> <CardSkeleton />
        </div>
      </div>
    );
  }

  const activeUser = user || {
    name: 'Alex Rivera',
    sustainabilityScore: 75,
    streakCount: 5,
    stats: { totalCo2: 1250, monthlyCo2: 340, reductionPercentage: 18.5 }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic welcome greeting banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#0F291E] dark:text-[#E2EAE5] sm:text-3xl">
            Welcome back, {activeUser.name}!
          </h1>
          <p className="text-sm text-emerald-800 dark:text-[#E2EAE5]/70 font-sans mt-1">
            Maintain your carbon-savings offset. Here is your environmental standing.
          </p>
        </div>
        
        {/* Quick Modal Trigger action */}
        <button
          id="btn_open_quick_log"
          onClick={() => setIsActivityModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 hover:bg-emerald-650 hover:scale-[1.01] active:scale-[0.99] transition-all shrink-0 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:shadow-none"
        >
          <Plus className="h-4 w-4" />
          <span>Record New Activity</span>
        </button>
      </div>

      {/* 4 Essential Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Summary 1: Total Footprint */}
        <div className="rounded-2xl border border-[#E2EAE5] bg-white p-5 shadow-xs dark:border-emerald-950/40 dark:bg-[#0C1E14]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800/80 dark:text-[#E2EAE5]/60">Total Carbon Logged</span>
            <div className="rounded-lg bg-[#EAF5EF] p-2 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Leaf className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-display text-3xl font-extrabold text-[#0F291E] dark:text-[#E2EAE5]">
              {activeUser.stats?.totalCo2 || 0} <span className="text-sm font-normal text-emerald-600/70">kg</span>
            </p>
            <p className="mt-1 text-xs text-emerald-800/60 dark:text-[#E2EAE5]/50">Cumulative all-time tracker sum</p>
          </div>
        </div>

        {/* Summary 2: Monthly Footprint */}
        <div className="rounded-2xl border border-[#E2EAE5] bg-white p-5 shadow-xs dark:border-emerald-950/40 dark:bg-[#0C1E14]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800/80 dark:text-[#E2EAE5]/60">Current Month (June)</span>
            <div className="rounded-lg bg-[#EAF5EF] p-2 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-display text-3xl font-extrabold text-[#0F291E] dark:text-[#E2EAE5]">
              {activeUser.stats?.monthlyCo2 || 0} <span className="text-sm font-normal text-emerald-600/70">kg</span>
            </p>
            <p className="mt-1 text-xs text-teal-700 dark:text-teal-400 flex items-center gap-1">
              <TrendingDown className="h-3.5 w-3.5 text-emerald-600" />
              <span>Target max allocation budget: 500kg</span>
            </p>
          </div>
        </div>

        {/* Summary 3: Score */}
        <div className="rounded-2xl border border-[#E2EAE5] bg-white p-5 shadow-xs dark:border-emerald-950/40 dark:bg-[#0C1E14]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800/80 dark:text-[#E2EAE5]/60">Sustainability Rating</span>
            <div className="rounded-lg bg-amber-100/70 p-2 text-amber-900 dark:bg-amber-950/30 dark:text-amber-400">
              <Smile className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-display text-3xl font-extrabold text-[#0F291E] dark:text-[#E2EAE5]">
              {activeUser.sustainabilityScore || 0}<span className="text-sm font-normal text-emerald-600/70">/100</span>
            </p>
            <p className={`mt-1 text-xs font-bold ${getScoreDescription(activeUser.sustainabilityScore || 0).color}`}>
              {getScoreDescription(activeUser.sustainabilityScore || 0).label}
            </p>
          </div>
        </div>

        {/* Summary 4: Saved % */}
        <div className="rounded-2xl border border-[#E2EAE5] bg-white p-5 shadow-xs dark:border-emerald-950/40 dark:bg-[#0C1E14]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800/80 dark:text-[#E2EAE5]/60">Saved Offsets Ratio</span>
            <div className="rounded-lg bg-teal-100/70 p-2 text-teal-900 dark:bg-teal-950/35 dark:text-teal-400">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="font-display text-3xl font-extrabold text-teal-700 dark:text-[#E2EAE5]">
              -{activeUser.stats?.reductionPercentage || 0}%
            </p>
            <p className="mt-1 text-xs text-emerald-800/60 dark:text-[#E2EAE5]/50">Less than typical local baseline index</p>
          </div>
        </div>
      </div>

      {/* Grid containing charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Emissions Compare Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E2EAE5] bg-white p-5 shadow-xs dark:border-emerald-950/40 dark:bg-[#0C1E14]">
          <h3 className="font-display text-sm font-extrabold text-[#0F291E] dark:text-[#E2EAE5]">
            Monthly Footprint vs Safety Target Allocation (kg CO₂e)
          </h3>
          <div className="mt-6 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#0F291E', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                />
                <Legend iconSize={10} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="Footprint" fill="#15803d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Target" fill="#E2EAE5" opacity={0.6} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="rounded-2xl border border-[#E2EAE5] bg-white p-5 shadow-xs dark:border-emerald-950/40 dark:bg-[#0C1E14] flex flex-col justify-between">
          <div>
            <h3 className="font-display text-sm font-extrabold text-[#0F291E] dark:text-[#E2EAE5]">
              Category Emissions Ratio
            </h3>
            <p className="text-xs text-emerald-800/60 dark:text-[#E2EAE5]/50 mt-1">Current logged proportions by active volume</p>
          </div>

          <div className="my-4 h-48 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={displayPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {displayPieData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.name as keyof typeof COLORS] || '#10b981'} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} kg`} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center score indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-extrabold text-[#0F291E] dark:text-[#E2EAE5]">
                {activities.length}
              </span>
              <span className="text-[10px] text-emerald-800/60 dark:text-[#E2EAE5]/50 uppercase tracking-widest leading-none">Logs</span>
            </div>
          </div>

          {/* Custom legend drawer */}
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            {Object.keys(COLORS).map(cat => {
              const val = categoryEmissions[cat] || 0;
              return (
                <div key={cat} className="flex items-center gap-1.5 text-emerald-950/80 dark:text-[#E2EAE5]/80">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[cat as keyof typeof COLORS] }}></span>
                  <span className="truncate">{cat}: <strong>{Math.round(val)}kg</strong></span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid third layer: Trend progress lines & Quick Goals checklist */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Trend line widget */}
        <div className="rounded-2xl border border-[#E2EAE5] bg-white p-5 shadow-xs dark:border-emerald-950/40 dark:bg-[#0C1E14]">
          <h3 className="font-display text-sm font-extrabold text-[#0F291E] dark:text-[#E2EAE5]">
            Daily Emission Velocity Trend
          </h3>
          <div className="mt-5 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendLineData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: '10px' }} />
                <Line type="monotone" dataKey="co2" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Goals widget drawer */}
        <div className="lg:col-span-2 rounded-2xl border border-[#E2EAE5] bg-white p-5 shadow-xs dark:border-emerald-950/40 dark:bg-[#0C1E14] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-extrabold text-[#0F291E] dark:text-[#E2EAE5]">
                Active Sustainability Caps & Progress
              </h3>
              <ArrowUpRight className="h-4.5 w-4.5 text-emerald-800" />
            </div>
            
            <div className="mt-4 space-y-3.5">
              {goals.map(goal => (
                <div key={goal.id} className="text-xs">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-emerald-950 dark:text-[#E2EAE5]/90 flex items-center gap-1.5">
                      {getCategoryIcon(goal.category)}
                      {goal.title}
                    </span>
                    <span className="text-[#1A2E22]/60 dark:text-[#E2EAE5]/65">
                      {goal.currentValue} / <strong className="text-[#0F291E] dark:text-white">{goal.targetValue} {goal.unit}</strong>
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-slate-100 dark:bg-[#0D2118] overflow-hidden border border-[#E2EAE5]/40 dark:border-emerald-950/20">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${goal.completed ? 'bg-red-500 animate-pulse' : 'bg-emerald-600'}`}
                      style={{ width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 105)}%` }}
                    ></div>
                  </div>
                  <p className="text-[9px] text-[#1A2E22]/65 dark:text-[#E2EAE5]/50 mt-0.5">
                    {goal.completed ? '⚠️ limit breached! Reduce allocations' : '✅ safe within budget constraints'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-500/10 pt-3 mt-4 text-center">
            <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Hitting your target caps grants extra sustainability level points</span>
            </p>
          </div>
        </div>
      </div>

      {/* Record Footprint Modal instance */}
      <ActivityFormModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onSubmit={addActivity}
      />
    </div>
  );
}
