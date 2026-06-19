export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  country?: string;
  city?: string;
  occupation?: string;
  onboardingCompleted: boolean;
  sustainabilityScore: number; // 0 to 100
  streakCount: number;
  level: number;
  levelProgress: number; // percentage completed in current level
  stats: {
    totalCo2: number; // in kg
    monthlyCo2: number; // in kg for current month
    reductionPercentage: number;
  };
  transportationHabits?: string;
  foodHabits?: string;
  electricityUsage?: string;
  flightFrequency?: string;
  notificationsEnabled: boolean;
  weeklyDigestEnabled: boolean;
  theme: 'light' | 'dark';
}

export type ActivityCategory = 'Transportation' | 'Food' | 'Electricity' | 'Travel' | 'Shopping';

export interface Activity {
  id: string;
  name: string;
  category: ActivityCategory;
  emissionValue: number; // in kg CO2
  date: string; // ISO String
  notes?: string;
}

export interface Goal {
  id: string;
  title: string;
  category: ActivityCategory | 'Overall';
  targetValue: number; // Target monthly footprint or target reduction
  currentValue: number; // Current level achieved
  deadline: string;
  unit: string; // e.g., "kg CO2", "%"
  completed: boolean;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  co2Savings: number; // kg per month
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  unlockedAt?: string | null;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number; // 0 - 100
  unlocked: boolean;
  rewardPoints: number;
}
