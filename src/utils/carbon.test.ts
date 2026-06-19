import { describe, it, expect } from 'vitest';
import { 
  calculateSustainabilityScore, 
  calculateReductionPercentage, 
  calculateLevelAndProgress,
  calculateCarbonAssessment,
  calculateTotalEmissions,
  calculateMonthlyEmissions
} from './carbon';
import { Activity } from '../types';

describe('Carbon Footprint Calculation Utilities', () => {
  
  describe('calculateSustainabilityScore', () => {
    it('should return 98 if user has zero emissions', () => {
      expect(calculateSustainabilityScore(0)).toBe(98);
    });

    it('should return a higher score for low emissions', () => {
      // 300kg / 600kg * 50 = 25 reduction => 100 - 25 = 75
      expect(calculateSustainabilityScore(300)).toBe(75);
    });

    it('should cap the score at 15 for extremely high emissions', () => {
      // 2000kg / 600kg * 50 = 166.6 => 100 - 166.6 = -66.6, capped at 15
      expect(calculateSustainabilityScore(2000)).toBe(15);
    });

    it('should handle negative values by returning max score', () => {
      expect(calculateSustainabilityScore(-50)).toBe(98);
    });
  });

  describe('calculateReductionPercentage', () => {
    it('should show 100% reduction if monthly emissions are 0', () => {
      expect(calculateReductionPercentage(0)).toBe(100);
    });

    it('should compute the correct reduction percentage against default baseline', () => {
      // (450 - 225) / 450 = 50%
      expect(calculateReductionPercentage(225)).toBe(50);
    });

    it('should return 0% if monthly emissions exceed baseline', () => {
      expect(calculateReductionPercentage(500)).toBe(0);
    });

    it('should round to 1 decimal place', () => {
      // (450 - 300) / 450 = 33.333333% => 33.3%
      expect(calculateReductionPercentage(300)).toBe(33.3);
    });
  });

  describe('calculateLevelAndProgress', () => {
    it('should start at level 1 with 0% progress when activitiesCount is 0', () => {
      const result = calculateLevelAndProgress(0);
      expect(result.level).toBe(1);
      expect(result.levelProgress).toBe(0);
    });

    it('should calculate level progression correctly on exact boundary', () => {
      // 3 activities / 3 req = Level 2, 0% progress
      const result = calculateLevelAndProgress(3);
      expect(result.level).toBe(2);
      expect(result.levelProgress).toBe(0);
    });

    it('should calculate intermediate progress accurately', () => {
      // 5 activities = Level 2 (starts from 3), progress = (2 / 3) * 100 = 67%
      const result = calculateLevelAndProgress(5);
      expect(result.level).toBe(2);
      expect(result.levelProgress).toBe(67);
    });

    it('should safely handle negative activity values', () => {
      const result = calculateLevelAndProgress(-10);
      expect(result.level).toBe(1);
      expect(result.levelProgress).toBe(0);
    });
  });

  describe('calculateCarbonAssessment', () => {
    it('should accurately calculate emissions with typical inputs', () => {
      const sampleInput = {
        vehicleType: 'sedan',
        fuelType: 'petrol',
        distance: 100, // 100 * 0.25 = 25
        electricity: 200, // 200 * 0.45 = 90
        acUsage: 10, // 10 * 0.8 = 8
        lpgUsage: 1, // 1 * 42 = 42
        diet: 'vegetarian' as const, // 150
        domesticFlights: 1, // 180
        intlFlights: 0, // 0
        clothingCount: 2, // 2 * 7.5 = 15
        electronicsCount: 1 // 1 * 75 = 75
      };

      // transCO2 = 25
      // elecCO2 = 90 + 8 + 42 = 140
      // dietValue = 150
      // travelCO2 = 180
      // shoppingCO2 = 15 + 75 = 90
      // total = 25 + 140 + 150 + 180 + 90 = 585
      const result = calculateCarbonAssessment(sampleInput);
      expect(result.total).toBe(585);
      expect(result.breakdown.Transportation).toBe(25);
      expect(result.breakdown.Electricity).toBe(140);
      expect(result.breakdown.Food).toBe(150);
      expect(result.breakdown.Travel).toBe(180);
      expect(result.breakdown.Shopping).toBe(90);
    });

    it('should apply appropriate factors for hybrid and diesel fuels', () => {
      const dieselInput = {
        vehicleType: 'sedan',
        fuelType: 'diesel',
        distance: 100, // 100 * 0.28 = 28
        electricity: 0,
        acUsage: 0,
        lpgUsage: 0,
        diet: 'vegan' as const, // 85
        domesticFlights: 0,
        intlFlights: 0,
        clothingCount: 0,
        electronicsCount: 0
      };
      const result = calculateCarbonAssessment(dieselInput);
      expect(result.breakdown.Transportation).toBe(28);
      expect(result.total).toBe(113); // 28 + 85
    });

    it('should handle vegan with electric vehicle and zero flights', () => {
      const input = {
        vehicleType: 'sedan',
        fuelType: 'electricity',
        distance: 100, // 100 * 0.04 = 4
        electricity: 100, // 100 * 0.45 = 45
        acUsage: 0,
        lpgUsage: 0,
        diet: 'vegan' as const, // 85
        domesticFlights: 0,
        intlFlights: 0,
        clothingCount: 0,
        electronicsCount: 0
      };
      const result = calculateCarbonAssessment(input);
      expect(result.total).toBe(134); // 4 + 45 + 85
    });
  });

  describe('calculateTotalEmissions', () => {
    it('should return 0 for empty activity logs', () => {
      expect(calculateTotalEmissions([])).toBe(0);
    });

    it('should aggregate cumulative logged emissions accurately', () => {
      const logs: Activity[] = [
        { id: '1', name: 'Commute', category: 'Transportation', emissionValue: 12.5, date: '2026-06-10' },
        { id: '2', name: 'Meal', category: 'Food', emissionValue: 3.2, date: '2026-06-11' },
        { id: '3', name: 'Laundry', category: 'Electricity', emissionValue: 5.0, date: '2026-06-12' }
      ];
      expect(calculateTotalEmissions(logs)).toBe(20.7);
    });
  });

  describe('calculateMonthlyEmissions', () => {
    it('should only sum activities in the target calendar Month and Year', () => {
      const logs: Activity[] = [
        { id: '1', name: 'June Commute 1', category: 'Transportation', emissionValue: 10, date: '2026-06-10' },
        { id: '2', name: 'June Commute 2', category: 'Transportation', emissionValue: 15, date: '2026-06-15' },
        { id: '3', name: 'May Commute', category: 'Transportation', emissionValue: 30, date: '2026-05-18' },
        { id: '4', name: 'June Commute next year', category: 'Transportation', emissionValue: 50, date: '2027-06-15' }
      ];
      const targetDate = new Date('2026-06-18');
      expect(calculateMonthlyEmissions(logs, targetDate)).toBe(25);
    });
  });
});
