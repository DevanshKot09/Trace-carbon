import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lightbulb, 
  Sparkles, 
  TrendingDown, 
  Flame, 
  Car, 
  Zap, 
  Plane, 
  ShoppingBag,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function RecommendationsPage() {
  const { recommendations, stats, user, updateCurrentUserProfile, addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [adoptedIds, setAdoptedIds] = useState<string[]>([]);

  const getDifficultyColor = (diff: string) => {
    if (diff === 'Easy') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400';
    if (diff === 'Medium') return 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400';
    return 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400';
  };

  const getCategoryIcon = (cat: string) => {
    if (cat === 'Transportation') return <Car className="h-5 w-5 text-sky-500 shrink-0" />;
    if (cat === 'Electricity') return <Zap className="h-5 w-5 text-yellow-500 shrink-0" />;
    if (cat === 'Food') return <Flame className="h-5 w-5 text-orange-500 shrink-0" />;
    if (cat === 'Travel') return <Plane className="h-5 w-5 text-purple-500 shrink-0" />;
    return <ShoppingBag className="h-5 w-5 text-teal-400 shrink-0" />;
  };

  // Adopt dynamic recommendation handler
  const handleAdopt = async (id: string, co2: number) => {
    if (adoptedIds.includes(id)) return;
    setAdoptedIds([...adoptedIds, id]);
    
    // Simulate updating score and adding reduction percentage
    if (user) {
      const currentScore = user.sustainabilityScore;
      const currentSavings = user.stats.reductionPercentage;
      
      const newScore = Math.min(99, currentScore + 4);
      const newReduction = Math.round((currentSavings + 1.2) * 10) / 10;
      
      await updateCurrentUserProfile({
        sustainabilityScore: newScore,
        stats: {
          ...user.stats,
          reductionPercentage: newReduction
        }
      });
      addToast(`Adopted recommendation! Sustainability Score +4`, 'success');
    }
  };

  const filteredRecs = selectedCategory === 'All' 
    ? recommendations 
    : recommendations.filter(r => r.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          EcoAction Recommendations
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-sans">
          Recommended environmental actions personalized to your consumption profiles.
        </p>
      </div>

      {/* Interactive categorization selection tab blocks */}
      <div className="flex flex-wrap gap-2">
        {['All', 'Transportation', 'Electricity', 'Food', 'Shopping'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-tight transition-all duration-150 cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10' 
                : 'bg-white text-gray-600 border border-gray-150 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-850'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid listing recommendations cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredRecs.map(rec => {
          const adopted = adoptedIds.includes(rec.id);
          return (
            <div 
              key={rec.id} 
              className={`rounded-2xl border bg-white p-5 shadow-xs dark:bg-gray-900 flex flex-col justify-between transition-all duration-200 ${
                adopted ? 'border-emerald-500/40 bg-emerald-500/2 opacity-75' : 'border-gray-100 dark:border-gray-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-gray-50 dark:bg-gray-950 p-2 border border-gray-500/10 shrink-0">
                      {getCategoryIcon(rec.category)}
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">{rec.category}</span>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getDifficultyColor(rec.difficulty)}`}>
                    {rec.difficulty}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-sm font-extrabold text-gray-900 dark:text-white leading-snug">
                  {rec.title}
                </h3>
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                  {rec.description}
                </p>
              </div>

              <div className="mt-6 border-t border-gray-500/10 pt-4 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-semibold uppercase text-gray-400">Est. Savings Ratio</span>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                    <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
                    -{rec.co2Savings} kg CO₂ / mo
                  </span>
                </div>

                <button
                  onClick={() => handleAdopt(rec.id, rec.co2Savings)}
                  disabled={adopted}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                    adopted 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400'
                  }`}
                >
                  {adopted ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Adopted!</span>
                    </>
                  ) : (
                    'Adopt Habit'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic tip card */}
      <div className="rounded-2xl bg-linear-to-r from-emerald-500/10 via-teal-500/10 to-transparent p-5 border border-emerald-500/15 flex gap-4 items-center">
        <Sparkles className="h-6 w-6 text-emerald-500 shrink-0" />
        <div>
          <h4 className="font-display font-extrabold text-sm text-gray-900 dark:text-white">Did you know?</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans mt-0.5">
            Adopting small regular green behaviors like switching standard home appliances, carpooling with standard hybrid setups, and preferring raw plant luncheons contributes to cutting household footprint offsets by up to 2,400 kg annually! It is all about micro-limits.
          </p>
        </div>
      </div>
    </div>
  );
}
