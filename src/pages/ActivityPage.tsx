import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Activity, ActivityCategory } from '../types';
import { 
  Activity as ActIcon, 
  Search, 
  Filter, 
  Trash2, 
  Plus, 
  Car, 
  Zap, 
  Flame, 
  Plane, 
  ShoppingBag, 
  Calendar, 
  FileText,
  X,
  Sparkles
} from 'lucide-react';
import ActivityFormModal from '../components/ActivityFormModal';

export default function ActivityPage() {
  const { activities, addActivity, deleteActivity } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeDetailActivity, setActiveDetailActivity] = useState<Activity | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Category Colors
  const COLORS = {
    Transportation: '#0ea5e9',
    Electricity: '#eab308',
    Food: '#f97316',
    Travel: '#8b5cf6',
    Shopping: '#10b981'
  };

  const getIcon = (cat: string) => {
    switch (cat) {
      case 'Transportation': return <Car className="h-4 w-4 text-sky-500" />;
      case 'Electricity': return <Zap className="h-4 w-4 text-yellow-500" />;
      case 'Food': return <Flame className="h-4 w-4 text-orange-500" />;
      case 'Travel': return <Plane className="h-4 w-4 text-purple-500" />;
      default: return <ShoppingBag className="h-4 w-4 text-emerald-500" />;
    }
  };

  // Filter & Search Logic
  const filteredActivities = activities.filter(act => {
    const matchesSearch = act.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (act.notes && act.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || act.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#0F291E] dark:text-[#E2EAE5] sm:text-3xl">
            Activity Ledger Tracking
          </h1>
          <p className="text-sm text-emerald-800 dark:text-[#E2EAE5]/70 mt-1 font-sans">
            Audit and filter your historic greenhouse activities.
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/10 hover:bg-emerald-600 hover:scale-[1.01] transition-all shrink-0 dark:bg-emerald-600 dark:hover:bg-emerald-500 dark:shadow-none"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>Record Footprint Activity</span>
        </button>
      </div>

      {/* Control Drawer: Search, filters */}
      <div className="grid gap-4 md:grid-cols-3 bg-white dark:bg-[#0C1E14] p-4 rounded-2xl border border-[#E2EAE5] dark:border-emerald-900/30">
        
        {/* Search Input bar */}
        <div className="relative">
          <label htmlFor="search_input" className="sr-only">Search activities or notes</label>
          <Search className="absolute top-3 left-3 h-4 w-4 text-emerald-800/60 dark:text-[#E2EAE5]/50" />
          <input
            id="search_input"
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search activities or notes..."
            aria-label="Search activities or notes"
            className="w-full rounded-xl border border-[#E2EAE5] bg-transparent pl-9 pr-4 py-2.5 text-xs outline-hidden focus:border-emerald-600 dark:border-emerald-900/30"
          />
        </div>

        {/* Filter categories dropdown */}
        <div className="relative">
          <label htmlFor="category_filter_select" className="sr-only">Filter by Category</label>
          <Filter className="absolute top-3 left-3 h-4 w-4 text-emerald-800/60 dark:text-[#E2EAE5]/50" />
          <select
            id="category_filter_select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            aria-label="Filter activities by Category"
            className="w-full rounded-xl border border-[#E2EAE5] bg-white pl-9 pr-4 py-2.5 text-xs dark:border-emerald-900/30 dark:bg-[#07130D] focus:border-emerald-600 outline-hidden text-[#1A2E22] dark:text-[#E2EAE5]"
          >
            <option value="All">Filter by Category (All)</option>
            <option value="Transportation">Transportation</option>
            <option value="Electricity">Electricity & utility</option>
            <option value="Food">Food & Diet</option>
            <option value="Travel">Long travel flights</option>
            <option value="Shopping">Shopping details</option>
          </select>
        </div>

        {/* Active Ledger stats mini counter */}
        <div className="bg-[#EAF5EF] border border-[#E2EAE5] rounded-xl px-4 py-2 flex items-center justify-between text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900/20 dark:text-emerald-400">
          <span>Active Filter Logs:</span>
          <span>{filteredActivities.length} logs matching</span>
        </div>
      </div>

      {/* List content table */}
      <div className="rounded-2xl border border-[#E2EAE5] bg-white shadow-xs dark:border-[#1A3326] dark:bg-[#0C1E14] overflow-hidden">
        {filteredActivities.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm divide-y divide-gray-500/10">
              <thead className="bg-[#F1F9F5]/60 dark:bg-[#1A3326]/40 text-xs font-semibold uppercase tracking-wider text-emerald-850 dark:text-[#E2EAE5]/60">
                <tr>
                  <th className="p-4 pl-6">Activity Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Date logged</th>
                  <th className="p-3.5 text-right">CO₂ burden</th>
                  <th className="p-3.5 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500/10 font-sans text-[#1A2E22] dark:text-[#E2EAE5]">
                {filteredActivities.map(act => (
                  <tr 
                    key={act.id} 
                    className="hover:bg-[#F1F9F5]/45 dark:hover:bg-emerald-950/15 cursor-pointer transition-colors"
                  >
                    {/* Trigger details modal on clicking the row */}
                    <td 
                      onClick={() => setActiveDetailActivity(act)}
                      className="p-4 pl-6 font-bold text-[#0F291E] dark:text-[#E2EAE5]"
                    >
                      {act.name}
                    </td>
                    <td 
                      onClick={() => setActiveDetailActivity(act)}
                      className="p-4"
                    >
                      <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold" style={{ backgroundColor: `${COLORS[act.category as keyof typeof COLORS]}10`, color: COLORS[act.category as keyof typeof COLORS] }}>
                        {getIcon(act.category)}
                        {act.category}
                      </span>
                    </td>
                    <td 
                      onClick={() => setActiveDetailActivity(act)}
                      className="p-4 text-emerald-800 dark:text-[#E2EAE5]/60 text-xs"
                    >
                      {new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td 
                      onClick={() => setActiveDetailActivity(act)}
                      className="p-4 text-right font-mono font-bold text-[#0F291E] dark:text-white text-xs"
                    >
                      {act.emissionValue} kg
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteActivity(act.id);
                        }}
                        className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-650 dark:hover:bg-red-950/20"
                        title="Delete this entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-gray-400 dark:bg-gray-950">
              <ActIcon className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display font-medium text-sm text-[#0F291E] dark:text-white">No Activities Located</p>
              <p className="text-xs text-gray-500 mt-1">There are no records matching your active filters or searches.</p>
            </div>
          </div>
        )}
      </div>

      {/* 1. Activity Details modal popup */}
      {activeDetailActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div 
            id="activity_details_modal"
            className="w-full max-w-md rounded-2xl border border-[#E2EAE5] bg-white p-6 shadow-2xl dark:border-emerald-900/30 dark:bg-[#0C1E14]"
          >
            <div className="flex items-center justify-between border-b border-gray-500/10 pb-4">
              <h3 className="font-display text-sm font-extrabold text-[#0F291E] dark:text-[#E2EAE5] flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-emerald-600" />
                <span>Activity Specification Details</span>
              </h3>
              <button 
                onClick={() => setActiveDetailActivity(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 font-sans text-xs sm:text-sm">
              <div>
                <span className="block text-[10px] font-semibold text-emerald-800/80 dark:text-[#E2EAE5]/60 uppercase tracking-wider">Activity Name</span>
                <p className="font-bold text-[#0F291E] dark:text-white text-base mt-0.5">{activeDetailActivity.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] font-semibold text-emerald-800/80 dark:text-[#E2EAE5]/60 uppercase tracking-wider">Category Scope</span>
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5">{activeDetailActivity.category}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-emerald-800/80 dark:text-[#E2EAE5]/60 uppercase tracking-wider">Logging Reference Date</span>
                  <p className="font-semibold text-gray-700 dark:text-gray-300 mt-0.5">
                    {new Date(activeDetailActivity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-[#EAF5EF] p-4 text-center border border-[#E2EAE5] dark:bg-emerald-950/30 dark:border-emerald-900/20">
                <span className="block text-[10px] font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Carbon Burden Index</span>
                <p className="font-display text-3xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                  {activeDetailActivity.emissionValue} kg CO₂e
                </p>
              </div>

              {activeDetailActivity.notes && (
                <div>
                  <span className="block text-[10px] font-semibold text-emerald-800/80 dark:text-[#E2EAE5]/60 uppercase tracking-wider">Personal Annotations</span>
                  <p className="text-gray-600 dark:text-gray-300 bg-slate-50 dark:bg-[#07130D] p-3 rounded-xl border border-[#E2EAE5] dark:border-emerald-950/20 mt-1 leading-relaxed">
                    {activeDetailActivity.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  deleteActivity(activeDetailActivity.id);
                  setActiveDetailActivity(null);
                }}
                className="w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-500 shadow-md shadow-red-500/10"
              >
                Delete Log Record
              </button>
              <button
                onClick={() => setActiveDetailActivity(null)}
                className="w-full rounded-xl border border-[#E2EAE5] py-2.5 text-xs font-semibold text-gray-700 hover:bg-[#F1F9F5] dark:border-emerald-950/30 dark:text-gray-300 dark:hover:bg-emerald-950/30"
              >
                Close details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. New Activity logger Modal form */}
      <ActivityFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={addActivity}
      />
    </div>
  );
}
