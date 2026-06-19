import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trophy, 
  Flame, 
  Award, 
  CheckCircle, 
  Lock, 
  Sparkles, 
  User, 
  ShieldAlert, 
  Crown, 
  Leaf, 
  ShieldCheck, 
  Star 
} from 'lucide-react';

export default function GamificationPage() {
  const { user, badges } = useApp();

  const getBadgeIcon = (iconName: string) => {
    if (iconName === 'Leaf') return <Leaf className="h-6 w-6 text-emerald-500" />;
    if (iconName === 'ShieldAlert') return <Award className="h-6 w-6 text-sky-500" />;
    return <Crown className="h-6 w-6 text-amber-500" />;
  };

  const achievements = [
    { id: 1, title: 'Carbon Pioneer', rValue: 30, desc: 'Calculate your first bulk carbon index parameters', progress: 100, unlocked: true },
    { id: 2, title: 'Consolidated Commute', rValue: 50, desc: 'Log 5 distinct hybrid/EV/transit commuter logs', progress: 60, unlocked: false },
    { id: 3, title: 'Dietary Discipline', rValue: 70, desc: 'Adhere completely to a plant-based vegetarian limit', progress: 100, unlocked: true },
    { id: 4, title: 'Guardian of the Grid', rValue: 100, desc: 'Lock electricity allocations below 150kg for a month', progress: 40, unlocked: false }
  ];

  const activeUser = user || {
    name: 'Alex Rivera',
    level: 4,
    streakCount: 5,
    levelProgress: 40
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          Gamified Arena & Badges
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-sans">
          Climb sustainability levels, maintain daily tracking streaks, and earn achievements.
        </p>
      </div>

      {/* Hero level status widget */}
      <div className="rounded-3xl bg-linear-to-r from-emerald-600 via-teal-600 to-sky-700 p-6 sm:p-8 text-white shadow-xl shadow-emerald-500/10 relative overflow-hidden">
        {/* Absolute decoration details */}
        <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-10 pointer-events-none">
          <Trophy className="h-44 w-44" />
        </div>

        <div className="grid gap-6 sm:grid-cols-3 items-center">
          {/* Level indicators */}
          <div className="text-center sm:text-left space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-100">Active Champion Status</span>
            <p className="font-display text-3xl font-black">Level {activeUser.level} Climate Guard</p>
            <p className="text-xs text-emerald-100 mt-1 font-sans">XP multiplier active: <strong>1.5x</strong> bonus</p>
          </div>

          {/* XP progress bars */}
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex justify-between text-xs font-semibold text-emerald-100">
              <span>Next Level XP Progress</span>
              <span>{activeUser.levelProgress}% Done</span>
            </div>
            <div className="h-3 w-full rounded-full bg-white/20 overflow-hidden">
              <div 
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${activeUser.levelProgress}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-right text-emerald-100 font-medium">
              Log {3 - Math.round((activeUser.levelProgress / 100) * 3)} more activities to reach Level {activeUser.level + 1}!
            </p>
          </div>
        </div>
      </div>

      {/* Grid content: badges on left, achievements on right */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Span 2: Badges Collection UI */}
        <div className="lg:col-span-2 space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div>
            <h3 className="font-display text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Award className="h-5 w-5 text-emerald-500" />
              <span>Badge Museum Case</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">Milestones unlocked based on environmental trackers</p>
          </div>

          <div className="divide-y divide-gray-500/10 font-sans">
            {badges.map(badge => {
              const unlocked = !!badge.unlockedAt;
              return (
                <div key={badge.id} className="py-4 flex gap-4 items-center">
                  <div className={`p-3.5 rounded-2xl ${unlocked ? 'bg-emerald-500/10 border border-emerald-500/15' : 'bg-gray-50 dark:bg-gray-950 opacity-40'} shrink-0`}>
                    {getBadgeIcon(badge.iconName)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                        {badge.name}
                      </h4>
                      {unlocked ? (
                        <span className="rounded-full bg-emerald-100 font-semibold px-2 py-0.5 text-[8px] text-emerald-800 dark:bg-emerald-950/45 dark:text-emerald-400 uppercase tracking-wider">Unlocked</span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-[8px] font-bold text-gray-400 uppercase tracking-wider"><Lock className="h-2 w-2" /> Locked</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{badge.description}</p>
                    {unlocked && (
                      <p className="text-[9px] text-emerald-500 mt-1">
                        Unlocked on {new Date(badge.unlockedAt!).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Span 3: Achievements List */}
        <div className="lg:col-span-3 space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900">
          <div>
            <h3 className="font-display text-base font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
              <Star className="h-5 w-5 text-emerald-500" />
              <span>Target Achievements Portfolio</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">Unlock rewards by keeping habits aligned with thresholds</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {achievements.map(ach => (
              <div 
                key={ach.id} 
                className={`rounded-2xl border p-4.5 flex flex-col justify-between transition-all ${
                  ach.unlocked 
                    ? 'border-emerald-500/10 bg-emerald-500/2' 
                    : 'border-gray-100 dark:border-gray-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <h4 className={`text-xs sm:text-sm font-bold ${ach.unlocked ? 'text-gray-950 dark:text-white' : 'text-gray-400'}`}>
                      {ach.title}
                    </h4>
                    {ach.unlocked ? (
                      <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                    ) : (
                      <span className="text-[9px] font-semibold text-gray-400">+{ach.rValue} XP</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{ach.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-500/10">
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>Scope progress</span>
                    <span>{ach.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden mt-1">
                    <div 
                      className={`h-full rounded-full ${ach.unlocked ? 'bg-emerald-500' : 'bg-slate-400'}`} 
                      style={{ width: `${ach.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Streak notification indicator block */}
          <div className="rounded-2xl bg-amber-500/5 p-4.5 border border-amber-500/15 flex gap-3.5 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 animate-bounce">
                <Flame className="h-5.5 w-5.5" />
              </div>
              <div>
                <h4 className="font-display font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white">5-Day Tracker Streak!</h4>
                <p className="text-xs text-gray-400">Log any mileage tomorrow to expand to 6 days!</p>
              </div>
            </div>
            <p className="text-xs font-bold text-amber-500">🔥 Streak Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
