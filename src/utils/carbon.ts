/**
 * Carbon footprint calculator utility functions.
 * Extracted as pure, deterministic functions to ensure type-safety,
 * modularity, high efficiency, and comprehensive testability.
 */

import { Activity, ActivityCategory } from '../types';

/**
 * Computes a user's sustainability score out of 100 based on monthly emissions.
 * Standard monthly emissions target budget is 600kg. Less emissions = higher score.
 * 
 * @param monthlyTotal - Total monthly logged CO2 emissions (in kg)
 * @param baseMonthlyBudget - Target budget threshold (default: 600 kg)
 * @returns An integer score between 15 and 98.
 */
export function calculateSustainabilityScore(monthlyTotal: number, baseMonthlyBudget = 600): number {
  if (monthlyTotal < 0) return 98;
  const score = 100 - (monthlyTotal / baseMonthlyBudget * 50);
  const rounded = Math.round(score);
  return Math.max(15, Math.min(98, rounded));
}

/**
 * Calculates carbon footprint reduction percentage compared to a historical baseline.
 * 
 * @param monthlyTotal - Total monthly logged CO2 emissions (in kg)
 * @param baseline - Base monthly average comparison (default: 450 kg)
 * @returns Rounded percentage reduction (0 if emissions exceeded baseline).
 */
export function calculateReductionPercentage(monthlyTotal: number, baseline = 450): number {
  if (monthlyTotal <= 0) return 100;
  if (monthlyTotal >= baseline) return 0;
  const reduction = ((baseline - monthlyTotal) / baseline) * 100;
  return Math.round(reduction * 10) / 10;
}

/**
 * Calculates a user's gamification level and current progress towards the next level.
 * Each level requires a fixed number of completed activity logs.
 * 
 * @param activitiesCount - Total number of logged activity objects
 * @param levelRequirement - Activities required per level (default: 3)
 * @returns Level integer and remaining level progress page percent.
 */
export function calculateLevelAndProgress(activitiesCount: number, levelRequirement = 3): { level: number, levelProgress: number } {
  const count = Math.max(0, activitiesCount);
  const level = Math.floor(count / levelRequirement) + 1;
  const levelProgress = Math.round(((count % levelRequirement) / levelRequirement) * 100);
  return { level, levelProgress };
}

/**
 * Parameters for the multi-input carbon footprint calculator assessment.
 */
export interface CalculatorInput {
  vehicleType: string;
  fuelType: string;
  distance: number;
  electricity: number;
  acUsage: number;
  lpgUsage: number;
  diet: 'vegetarian' | 'non-vegetarian' | 'vegan';
  domesticFlights: number;
  intlFlights: number;
  clothingCount: number;
  electronicsCount: number;
}

/**
 * Estimates carbon footprint details using research-backed coefficient values.
 * 
 * @param data - Raw inputs from the user's questionnaire
 * @returns Cumulative CO2 emission total and categorized breakdown.
 */
export function calculateCarbonAssessment(data: CalculatorInput): { total: number; breakdown: Record<ActivityCategory, number> } {
  // 1. Transportation
  let transportFactor = 0.25;
  if (data.fuelType === 'diesel') transportFactor = 0.28;
  if (data.fuelType === 'electricity') transportFactor = 0.04;
  if (data.fuelType === 'hybrid') transportFactor = 0.11;
  const transCO2 = data.distance * transportFactor;

  // 2. Household Energy emissions
  const elecCO2 = (data.electricity * 0.45) + (data.acUsage * 0.8) + (data.lpgUsage * 42);

  // 3. Diet selection impact
  let dietValue = 150;
  if (data.diet === 'non-vegetarian') dietValue = 310;
  if (data.diet === 'vegan') dietValue = 85;

  // 4. Flight travel emissions
  const travelCO2 = (data.domesticFlights * 180) + (data.intlFlights * 720);

  // 5. Shopping habits
  const shoppingCO2 = (data.clothingCount * 7.5) + (data.electronicsCount * 75);

  const computedTotal = transCO2 + elecCO2 + dietValue + travelCO2 + shoppingCO2;

  return {
    total: Math.round(computedTotal * 10) / 10,
    breakdown: {
      Transportation: Math.round(transCO2 * 10) / 10,
      Electricity: Math.round(elecCO2 * 10) / 10,
      Food: Math.round(dietValue * 10) / 10,
      Travel: Math.round(travelCO2 * 10) / 10,
      Shopping: Math.round(shoppingCO2 * 10) / 10
    }
  };
}

/**
 * Aggregates cumulative logged CO2 footprint across all historical items.
 */
export function calculateTotalEmissions(activities: Activity[]): number {
  const sum = activities.reduce((acc, current) => acc + (current.emissionValue || 0), 0);
  return Math.round(sum * 10) / 10;
}

/**
 * Aggregates CO2 logged in the current calendar month for active comparison.
 */
export function calculateMonthlyEmissions(activities: Activity[], targetDate: Date = new Date()): number {
  const targetMonth = targetDate.getMonth();
  const targetYear = targetDate.getFullYear();

  const monthlySum = activities.reduce((acc, current) => {
    if (!current.date) return acc;
    const actDate = new Date(current.date);
    if (actDate.getMonth() === targetMonth && actDate.getFullYear() === targetYear) {
      return acc + (current.emissionValue || 0);
    }
    return acc;
  }, 0);

  return Math.round(monthlySum * 10) / 10;
}
