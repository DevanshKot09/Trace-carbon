import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  Calculator, 
  Activity, 
  Lightbulb, 
  Target, 
  FileBarChart2, 
  Trophy, 
  Settings, 
  X,
  Compass,
  TrendingDown
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user } = useApp();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Carbon Calculator', path: '/calculator', icon: Calculator },
    { name: 'Activity Log', path: '/tracker', icon: Activity },
    { name: 'Recommendations', path: '/recommendations', icon: Lightbulb },
    { name: 'Sustainability Goals', path: '/goals', icon: Target },
    { name: 'Reports & Export', path: '/reports', icon: FileBarChart2 },
    { name: 'Achievements', path: '/achievements', icon: Trophy },
    { name: 'Profile Settings', path: '/settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-white dark:bg-[#07130D] p-4">
      {/* Upper Navigation Sections */}
      <div>
        {/* Onboarding Profile Status Header inside Sidebar */}
        {user && (
          <div className="mb-6 rounded-2xl bg-[#F1F9F5] p-4 border border-[#E2EAE5] dark:bg-[#0D2118] dark:border-emerald-900/20">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-400">
                Lvl {user.level || 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#0F291E] dark:text-[#E2EAE5]">
                  {user.name || 'Anonymous Eco'}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-emerald-800/80 dark:text-[#E2EAE5]/60 border shadow-2xs border-[#E2EAE5]/40 rounded-lg px-1.5 py-0.5 bg-white/50 w-max dark:bg-[#07130D]/50">
                  <TrendingDown className="h-3 w-3 text-emerald-600" />
                  <span>-{user.stats?.reductionPercentage || 0}% footprint</span>
                </div>
              </div>
            </div>
            
            {/* Level progression index bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] text-emerald-800 dark:text-[#E2EAE5]/60">
                <span>XP Progress</span>
                <span>{user.levelProgress || 0}%</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-white dark:bg-[#07130D]/70 overflow-hidden border border-[#E2EAE5]/40 dark:border-emerald-950/20">
                <div 
                  className="h-full rounded-full bg-emerald-600 dark:bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${user.levelProgress || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <nav className="space-y-1">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-3.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150
                  ${isActive 
                    ? 'bg-[#EAF5EF] text-emerald-800 font-semibold border-l-4 border-emerald-600 dark:bg-[#122D1F] dark:text-[#E2EAE5] dark:border-emerald-500 shadow-3xs' 
                    : 'text-slate-600 hover:bg-[#F1F9F5] hover:text-emerald-800 dark:text-[#E2EAE5]/70 dark:hover:bg-emerald-950/20 dark:hover:text-white'
                  }
                `}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sustainable footer quote inside sidebar rail */}
      <div className="border-t border-gray-500/10 pt-4 text-center">
        <p className="text-[11px] text-gray-400 dark:text-gray-500 font-sans tracking-wide">
          Streak: <span className="font-bold text-amber-500">🔥 {user?.streakCount || 0} Days Active</span>
        </p>
        <p className="mt-1 text-[10px] text-gray-400">
          CarbonWise Client v1.0.0
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Slide-under Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity lg:hidden"
        ></div>
      )}

      {/* Mobile-oriented Sliding Tray Side panel */}
      <aside 
        className={`
          fixed top-16 bottom-0 left-0 z-40 w-64 border-r border-[#E2EAE5] bg-white shadow-xl transition-transform duration-300 dark:border-emerald-900/30 dark:bg-[#07130D] lg:sticky lg:top-16 lg:z-30 lg:translate-x-0 lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Mobile-only close triggers */}
        <div className="absolute top-4 right-4 z-50 lg:hidden">
          <button 
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-full overflow-y-auto">
          {sidebarContent}
        </div>
      </aside>
    </>
  );
}
