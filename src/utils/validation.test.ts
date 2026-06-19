import { describe, it, expect } from 'vitest';
import { 
  validateEmail, 
  validatePhone, 
  validateNumericInput, 
  sanitizeTextInput,
  validateGoalThresholds
} from './validation';

describe('Sanitation and Validation Utilities', () => {

  describe('validateEmail', () => {
    it('should approve valid standard emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+label@sub.domain.org')).toBe(true);
    });

    it('should reject email formats missing @ symbol', () => {
      expect(validateEmail('testdomain.com')).toBe(false);
    });

    it('should reject spaces and blank input', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail('u s e r@domain.com')).toBe(false);
    });

    it('should reject emails without proper domain TLD structure', () => {
      expect(validateEmail('user@localhost')).toBe(false);
      expect(validateEmail('user@domain.')).toBe(false);
    });

    it('should respect max length limitations of email specification', () => {
      const veryLong = 'a'.repeat(65) + '@example.com';
      expect(validateEmail(veryLong)).toBe(false);
    });
  });

  describe('validatePhone', () => {
    it('should approve standard international phone formats', () => {
      expect(validatePhone('+14155552671')).toBe(true);
      expect(validatePhone('447911123456')).toBe(true);
    });

    it('should ignore decorative delimiters like hyphens or parentheses', () => {
      expect(validatePhone('+1 (415) 555-2671')).toBe(true);
    });

    it('should reject inputs containing alphanumeric alphabetics', () => {
      expect(validatePhone('+1415555abcd')).toBe(false);
    });

    it('should reject blank or extremely short numbers', () => {
      expect(validatePhone('')).toBe(false);
      expect(validatePhone('+44')).toBe(false);
    });
  });

  describe('validateNumericInput', () => {
    it('should properly parse numbers and string numbers', () => {
      const res1 = validateNumericInput('150.55');
      expect(res1.isValid).toBe(true);
      expect(res1.value).toBe(150.55);

      const res2 = validateNumericInput(245);
      expect(res2.isValid).toBe(true);
      expect(res2.value).toBe(245);
    });

    it('should capture negative numbers and reject lower bounds', () => {
      const res = validateNumericInput('-10', { min: 0 });
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('cannot be less than 0');
    });

    it('should cap extremely large inputs beyond defined thresholds', () => {
      const res = validateNumericInput('2000000', { max: 500000 });
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('cannot exceed safety');
    });

    it('should handle completely invalid strings safely', () => {
      const res = validateNumericInput('not_a_number');
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('must be a number');
    });
  });

  describe('sanitizeTextInput', () => {
    it('should strip potential embedded HTML tag exploits', () => {
      const payload = 'Hello <script>alert("hack")</script> World';
      expect(sanitizeTextInput(payload)).toBe('Hello alert("hack") World');
    });

    it('should trim surrounding whitespace', () => {
      expect(sanitizeTextInput('   Eco Tracker   ')).toBe('Eco Tracker');
    });

    it('should safely limit string length to parameter requirements', () => {
      expect(sanitizeTextInput('abcdefgh', 4)).toBe('abcd');
    });
  });

  describe('validateGoalThresholds', () => {
    it('should reject negative goals', () => {
      const res = validateGoalThresholds(-5, 'Food');
      expect(res.isValid).toBe(false);
    });

    it('should approve valid targets within realistic bounds', () => {
      const res = validateGoalThresholds(350, 'Transportation');
      expect(res.isValid).toBe(true);
    });

    it('should warn for ridiculously high goal target capacities', () => {
      const res = validateGoalThresholds(5000, 'Food');
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('exceeds standard extreme caps');
    });
  });
});
