/**
 * Input validation and sanitation utilities.
 * Keeps components clean, secure, and easily testable.
 */

/**
 * Validates whether an email format is RFC-compliant and syntactically correct.
 */
export function validateEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  
  // Basic RFC e-mail regex
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(email)) return false;

  // Additional sanity checks
  const [local, domain] = email.split('@');
  if (!local || !domain) return false;
  if (local.length > 64) return false;

  const parts = domain.split('.');
  if (parts.length < 2) return false; // Needs at least a TLD (e.g. domain.com)
  return parts.every(part => part.length >= 1 && part.length <= 63);
}

/**
 * Validates dynamic phone numbers to ensure standard international compatibility.
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  // Remove formatting characters (spaces, hyphens, parentheses, periods)
  const cleaned = phone.replace(/[\s\-\(\)\.]/g, '');
  // Must match standard E.164-like phone numbering: optional +, then 6-15 digits
  const strictRegex = /^\+?[1-9]\d{5,14}$/;
  return strictRegex.test(cleaned);
}

/**
 * Safe parser for numeric carbon logging fields.
 * Strips invalid input, guards against negative values, infinite limits, or giant entries.
 */
export interface NumberValidationResult {
  isValid: boolean;
  value: number;
  error?: string;
}

export function validateNumericInput(
  inputValue: string | number,
  config: { min?: number; max?: number; fieldName?: string } = {}
): NumberValidationResult {
  const { min = 0, max = 1000000, fieldName = 'Field value' } = config;

  if (inputValue === undefined || inputValue === null || inputValue === '') {
    return { isValid: false, value: 0, error: `${fieldName} is required.` };
  }

  const parsed = typeof inputValue === 'number' ? inputValue : parseFloat(inputValue);

  if (isNaN(parsed)) {
    return { isValid: false, value: 0, error: `${fieldName} must be a number.` };
  }

  if (parsed < min) {
    return { isValid: false, value: parsed, error: `${fieldName} cannot be less than ${min}.` };
  }

  if (parsed > max) {
    return { isValid: false, value: parsed, error: `${fieldName} cannot exceed safety baseline limit of ${max}.` };
  }

  return {
    isValid: true,
    value: Math.round(parsed * 100) / 100 // standard 2-decimal rounded precision
  };
}

/**
 * Strips raw tags and limits characters to prevent XSS embeddings.
 */
export function sanitizeTextInput(text: string, maxLength = 300): string {
  if (!text) return '';
  const trimmed = text.trim();
  // Strip HTML tag syntax
  const tagsRegex = /<[^>]*>/g;
  const clean = trimmed.replace(tagsRegex, '');
  return clean.slice(0, maxLength);
}

/**
 * Checks overall goal thresholds to avoid illogical limits.
 */
export function validateGoalThresholds(
  targetValue: number,
  category: string
): { isValid: boolean; error?: string } {
  if (targetValue <= 0) {
    return { isValid: false, error: 'Reduction target goal threshold must be positive.' };
  }
  const maxSafeAllocations: Record<string, number> = {
    Transportation: 3000,
    Electricity: 5000,
    Food: 1500,
    Travel: 25000,
    Shopping: 3000
  };

  const limit = maxSafeAllocations[category] || 10000;
  if (targetValue > limit) {
    return { 
      isValid: false, 
      error: `Notice: your target of ${targetValue}kg CO2 for ${category} exceeds standard extreme caps of ${limit}kg. Please choose a realistic sustainability ceiling.` 
    };
  }

  return { isValid: true };
}
