import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Activity, Goal, Badge, Recommendation } from '../types';
import { apiService } from '../services/api';
import { auth, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface AppContextType {
  user: User | null;
  loading: boolean;
  toasts: Toast[];
  activities: Activity[];
  goals: Goal[];
  badges: Badge[];
  recommendations: Recommendation[];
  theme: 'light' | 'dark';
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  login: (email: string, passOrPhone?: string) => Promise<void>;
  register: (name: string, email: string, password?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  verifyOTP: (phone: string, otp: string) => Promise<void>;
  logout: () => void;
  submitOnboarding: (data: Partial<User>) => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id'>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'completed' | 'currentValue'>) => Promise<void>;
  updateGoal: (id: string, value: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  toggleTheme: () => void;
  updateCurrentUserProfile: (profile: Partial<User>) => Promise<void>;
  triggerReload: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark';
    if (saved === 'light' || saved === 'dark') return saved;
    try {
      const userStr = localStorage.getItem('ecotrack_user');
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.theme === 'light' || u.theme === 'dark') return u.theme;
      }
    } catch {}
    return 'dark';
  });
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);

  // Load initial data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          let currentUser: User | null = null;
          try {
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              currentUser = userDocSnap.data() as User;
            }
          } catch (docErr) {
            console.error("Firestore user fetch failed on auth change, using fallback", docErr);
          }
          
          if (!currentUser) {
            // Build a valid user object to prevent black screens/hangs
            const email = firebaseUser.email || 'user@gmail.com';
            currentUser = {
              id: firebaseUser.uid,
              email,
              name: firebaseUser.displayName || email.split('@')[0],
              onboardingCompleted: false,
              sustainabilityScore: 50,
              streakCount: 1,
              level: 1,
              levelProgress: 0,
              stats: {
                totalCo2: 0,
                monthlyCo2: 0,
                reductionPercentage: 0
              },
              notificationsEnabled: true,
              weeklyDigestEnabled: false,
              theme: 'dark'
            };
          }

          setUser(currentUser);
          setTheme(currentUser.theme || 'dark');
          localStorage.setItem('theme', currentUser.theme || 'dark');
          localStorage.setItem('ecotrack_user', JSON.stringify(currentUser));
        } else {
          // Fallback to local session check if no active Firebase session found
          const currentUser = await apiService.auth.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            setTheme(currentUser.theme || 'dark');
            localStorage.setItem('theme', currentUser.theme || 'dark');
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Session load error', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch contextual user data on state change
  useEffect(() => {
    async function fetchUserData() {
      if (!user) {
        setActivities([]);
        setGoals([]);
        return;
      }
      try {
        const [actList, goalList, recsList, badgeList] = await Promise.all([
          apiService.activities.list(),
          apiService.goals.list(),
          apiService.recommendations.list(),
          apiService.gamification.listBadges()
        ]);
        setActivities(actList);
        setGoals(goalList);
        setRecommendations(recsList);
        setBadges(badgeList);
      } catch (err) {
        console.error('Failed to load user data context', err);
      }
    }
    fetchUserData();
  }, [user, reloadTrigger]);

  // Apply dark class directly to raw HTML tag for Tailwind native theme support
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);

  const addToast = (message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (user) {
      const updatedUser = { ...user, theme: newTheme };
      setUser(updatedUser);
      localStorage.setItem('ecotrack_user', JSON.stringify(updatedUser));
      await apiService.theme.save(newTheme);
    }
    addToast(`Theme switched to ${newTheme} mode`, 'info');
  };

  const login = async (email: string, passOrPhone?: string) => {
    try {
      setLoading(true);
      const res = await apiService.auth.login(email, passOrPhone);
      setUser(res.user);
      const userTheme = res.user.theme || 'dark';
      setTheme(userTheme);
      localStorage.setItem('theme', userTheme);
      addToast(`Welcome back, ${res.user.name || 'User'}!`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Login failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password?: string) => {
    try {
      setLoading(true);
      const res = await apiService.auth.register(name, email, password);
      setUser(res.user);
      setTheme('dark');
      addToast('Account created successfully!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Credentials invalid', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const res = await apiService.auth.loginWithGoogle();
      setUser(res.user);
      setTheme(res.user.theme || 'dark');
      addToast('Logged in with Google successfully!', 'success');
    } catch (err: any) {
      addToast('Google login failed', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (phone: string, otp: string) => {
    try {
      setLoading(true);
      const res = await apiService.auth.verifyPhoneOTP(phone, otp);
      setUser(res.user);
      setTheme(res.user.theme || 'dark');
      addToast('Phone number verified successfully', 'success');
    } catch (err: any) {
      addToast('Incorrect OTP. Try again.', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await apiService.auth.logout();
    setUser(null);
    addToast('Logged out of session', 'info');
  };

  const submitOnboarding = async (data: Partial<User>) => {
    try {
      setLoading(true);
      const updated = await apiService.onboarding.submit(data);
      setUser(updated);
      addToast('Onboarding profiles synchronized!', 'success');
    } catch (err: any) {
      addToast('Failed to complete onboarding steps', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activityData: Omit<Activity, 'id'>) => {
    try {
      setLoading(true);
      await apiService.activities.create(activityData);
      triggerReload();
      addToast('Carbon footprint activity recorded', 'success');
    } catch (err: any) {
      addToast('Failed to record activity', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      setLoading(true);
      await apiService.activities.delete(id);
      triggerReload();
      addToast('Activity log cleared', 'info');
    } catch (err: any) {
      addToast('Could not clear activity', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async (goalData: Omit<Goal, 'id' | 'completed' | 'currentValue'>) => {
    try {
      setLoading(true);
      await apiService.goals.create(goalData);
      triggerReload();
      addToast('New sustainability goal set!', 'success');
    } catch (err: any) {
      addToast('Could not establish goal', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (id: string, value: number) => {
    try {
      setLoading(true);
      await apiService.goals.update(id, { currentValue: value });
      triggerReload();
      addToast('Goal progress synchronized', 'success');
    } catch (err: any) {
      addToast('Could not sync goal progress', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      setLoading(true);
      await apiService.goals.delete(id);
      triggerReload();
      addToast('Sustainability goal deleted', 'info');
    } catch (err: any) {
      addToast('Could not delete goal', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentUserProfile = async (profileData: Partial<User>) => {
    try {
      setLoading(true);
      const updatedUser = { ...user, ...profileData } as User;
      localStorage.setItem('ecotrack_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      addToast('Profile configuration updated successfully', 'success');
    } catch (err: any) {
      addToast('Could not save configuration details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const triggerReload = () => {
    setReloadTrigger(prev => prev + 1);
  };

  return (
    <AppContext.Provider value={{
      user,
      loading,
      toasts,
      activities,
      goals,
      badges,
      recommendations,
      theme,
      addToast,
      removeToast,
      login,
      register,
      loginWithGoogle,
      verifyOTP,
      logout,
      submitOnboarding,
      addActivity,
      deleteActivity,
      addGoal,
      updateGoal,
      deleteGoal,
      toggleTheme,
      updateCurrentUserProfile,
      triggerReload
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be utilized inside an AppProvider');
  }
  return context;
}
