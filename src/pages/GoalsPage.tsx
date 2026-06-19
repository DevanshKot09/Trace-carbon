import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Goal, ActivityCategory } from '../types';
import { 
  Target, 
  Plus, 
  Trash2, 
  Calendar, 
  Car, 
  Zap, 
  Flame, 
  Plane, 
  ShoppingBag,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Gauge
} from 'lucide-react';
import GoalFormModal from '../components/GoalFormModal';

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Transportation': return <Car className="h-4 w-4 text-sky-500 shrink-0" />;
      case 'Electricity': return <Zap className="h-4 w-4 text-yellow-500 shrink-0" />;
      case 'Food': return <Flame className="h-4 w-4 text-orange-500 shrink-0" />;
      case 'Travel': return <Plane className="h-4 w-4 text-purple-500 shrink-0" />;
      case 'Shopping': return <ShoppingBag className="h-4 w-4 text-emerald-500 shrink-0" />;
      default: return <Target className="h-4 w-4 text-pink-500 shrink-0" />;
    }
  };

  const handleAdjustProgress = async (id: string, currentVal: number, step: number) => {
    const newVal = Math.max(0, currentVal + step);
    await updateGoal(id, newVal);
  };

  const totalGoalsCount = goals.length;
  const completedGoalsCount = goals.filter(g => g.completed).length;
  const percentComplete = totalGoalsCount > 0 
    ? Math.round((completedGoalsCount / totalGoalsCount) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Mitigation Goals
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-sans">
            Set and monitor monthly emissions limits to systematically force your carbon footprints down.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-xl shadow-emerald-500/10 hover:bg-emerald-500 hover:scale-101 shrink-0 dark:bg-emerald-500 dark:hover:bg-emerald-400"
        >
          <Target className="h-4.5 w-4.5" />
          <span>Establish Carbon Target</span>
        </button>
      </div>

      {/* Grid summary statistics on goals */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Set Targets Caps</span>
            <p className="font-display text-3xl font-extrabold text-gray-950 dark:text-white mt-1">
              {totalGoalsCount}
            </p>
          </div>
          <div className="rounded-xl bg-indigo-500/5 p-3 text-indigo-500 border border-indigo-500/10">
            <Target className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Limit Breaches Met</span>
            <p className="font-display text-3xl font-extrabold text-red-500 mt-1">
              {goals.filter(g => g.completed).length}
            </p>
          </div>
          <div className="rounded-xl bg-red-500/5 p-3 text-red-500 border border-red-500/10">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Risk Threshold</span>
            <span className="text-xs font-bold text-emerald-500">{percentComplete}% breached</span>
          </div>
          <div className="mt-3.5 h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div 
              className="h-full rounded-full bg-red-500 transition-all duration-300" 
              style={{ width: `${percentComplete}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Grid listing goals cards */}
      <div className="grid gap-6 sm:grid-cols-2">
        {goals.map(goal => {
          const ratio = goal.currentValue / goal.targetValue;
          const ratioPct = Math.min(100, Math.round(ratio * 100));
          return (
            <div 
              key={goal.id} 
              className={`rounded-2xl border bg-white p-5 shadow-xs dark:bg-gray-900 flex flex-col justify-between ${
                goal.completed ? 'border-red-500/30' : 'border-gray-100 dark:border-gray-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-950 p-2 border border-gray-500/10">
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div>
                      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{goal.category} Limit</span>
                      <h3 className="font-display text-sm font-extrabold text-gray-900 dark:text-white mt-0.5 leading-snug">
                        {goal.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Log Consumption</span>
                    <strong className="text-gray-900 dark:text-white">
                      {goal.currentValue} / {goal.targetValue} {goal.unit}
                    </strong>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${goal.completed ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}
                      style={{ width: `${ratioPct}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Expires: {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                    <span className={`font-bold uppercase tracking-wider ${goal.completed ? 'text-red-500' : 'text-emerald-500'}`}>
                      {ratioPct}% Allocated
                    </span>
                  </div>
                </div>
              </div>

              {/* Adjust Goal offset controls dynamically! */}
              <div className="mt-6 border-t border-gray-500/10 pt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Refactor offset:</span>
                <div className="flex gap-2.5">
                  <button
                    onClick={() => handleAdjustProgress(goal.id, goal.currentValue, -20)}
                    className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-850"
                  >
                    -20kg
                  </button>
                  <button
                    onClick={() => handleAdjustProgress(goal.id, goal.currentValue, 20)}
                    className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-850"
                  >
                    +20kg
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <GoalFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={addGoal}
      />
    </div>
  );
}
