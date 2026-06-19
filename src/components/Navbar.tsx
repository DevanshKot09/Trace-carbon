import { useApp } from '../context/AppContext';
import { Sun, Moon, Bell, Menu, User as UserIcon, LogOut, Compass, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, theme, toggleTheme, logout } = useApp();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [notificationItems, setNotificationItems] = useState([
    { id: 1, text: "Weekly report is ready for download!", type: "report" },
    { id: 2, text: "You unlocked the 'Eco Warrior' Badge!", type: "badge" },
    { id: 3, text: "Comm commute activity logged successfully.", type: "log" }
  ]);

  return (
    <header id="nav_header" className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#E2EAE5] bg-white/90 backdrop-blur-md px-4 shadow-xs dark:border-emerald-900/30 dark:bg-[#07130D]/90 lg:px-6">
      {/* Sidebar mobile toggle trigger */}
      <div className="flex items-center gap-3">
        <button
          id="btn_mob_sidebar_toggle"
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-emerald-800 hover:bg-[#EAF5EF] dark:text-[#E2EAE5] dark:hover:bg-emerald-950/40 lg:hidden"
          aria-label="Toggle mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand logo link */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 font-display font-bold text-white shadow-lg shadow-emerald-200 dark:bg-emerald-500 dark:shadow-none">
            <Compass className="h-5 w-5 animate-spin-slow text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-[#0F291E] dark:text-white">
            Carbon<span className="text-emerald-600 dark:text-emerald-400">Wise</span>
          </span>
        </Link>
      </div>

      {/* Secondary Controls: Notifications, theme toggling, profile drawers */}
      <div className="flex items-center gap-2">
        {/* Theme Switcher Button */}
        <button
          id="btn_theme_toggle"
          onClick={toggleTheme}
          className="rounded-lg p-2.5 text-gray-500 hover:bg-gray-100 hover:text-emerald-500 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-emerald-400"
          title={theme === 'dark' ? 'Activate Light Mode' : 'Activate Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notifications Toggle Button */}
        <div className="relative">
          <button
            id="btn_notifications_toggle"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setHasUnread(false);
            }}
            className="relative rounded-lg p-2.5 text-gray-500 hover:bg-gray-100 hover:text-emerald-500 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-emerald-400"
          >
            <Bell className="h-5 w-5" />
            {hasUnread && (
              <span className="absolute top-2 right-2 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div id="notifications_dropdown" className="absolute right-0 mt-2 w-80 rounded-xl border border-gray-100 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900 z-50">
              <div className="border-b border-gray-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Recent Notifications
              </div>
              <div className="divide-y divide-gray-500/10 max-h-64 overflow-y-auto">
                {notificationItems.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-400 dark:text-gray-550">
                    No unread notifications
                  </div>
                ) : (
                  notificationItems.map(item => (
                    <div key={item.id} className="flex gap-2.5 p-3 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50 rounded-lg">
                      <ShieldAlert className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                      <div>{item.text}</div>
                    </div>
                  ))
                )}
              </div>
              <div className="border-t border-gray-500/10 p-2 text-center text-xs">
                <button 
                  onClick={() => {
                    setHasUnread(false);
                    setNotificationItems([]);
                    setShowNotifications(false);
                  }} 
                  className="text-emerald-500 hover:underline cursor-pointer"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User profile details & Log out */}
        {user ? (
          <div className="relative">
            <button
              id="btn_profile_menu_toggle"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-gray-100 dark:hover:bg-gray-900"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="hidden text-sm font-semibold text-gray-700 dark:text-gray-300 md:block">
                {user.name || 'Account'}
              </span>
            </button>

            {showProfileMenu && (
              <div id="profile_dropdown" className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <div className="border-b border-gray-500/10 px-3 py-2.5">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50"
                  >
                    <UserIcon className="h-4 w-4" /> App Settings
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
                  >
                    <LogOut className="h-4 w-4" /> Logout Session
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:text-emerald-500 dark:text-gray-300 dark:hover:text-emerald-400">
              Login
            </Link>
            <Link to="/login?mode=signup" className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 shadow-md shadow-emerald-500/10">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
