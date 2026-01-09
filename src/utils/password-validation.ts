/**
 * Password validation utilities for backend authentication
 * 
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 */

import { PasswordStrengthResult } from '../types/auth';
import { getLogger } from '@qwickapps/logging';

const logger = getLogger('PasswordValidator');

/**
 * Password requirements configuration
 */
export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  maxLength?: number;
  forbiddenPasswords?: string[];
  forbiddenPatterns?: RegExp[];
}

/**
 * Default password requirements
 */
export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: false,
  maxLength: 128,
  forbiddenPasswords: [
    'password',
    '12345678',
    'password123',
    'admin',
    'qwerty',
    'letmein',
  ],
  forbiddenPatterns: [
    /(.)\1{3,}/, // Repeated characters (aaaa)
    /^(?:012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)/, // Sequential patterns
  ],
};

/**
 * Password validation class
 */
export class PasswordValidator {
  private requirements: PasswordRequirements;

  constructor(requirements: Partial<PasswordRequirements> = {}) {
    this.requirements = { ...DEFAULT_PASSWORD_REQUIREMENTS, ...requirements };
    logger.debug('PasswordValidator initialized', { requirements: this.requirements });
  }

  /**
   * Validate a password against the requirements
   */
  validate(password: string): PasswordStrengthResult {
    logger.debug('Validating password strength');
    
    const feedback: string[] = [];
    const requirements = {
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumbers: false,
      hasSymbols: false,
    };

    // Check length
    if (password.length < this.requirements.minLength) {
      feedback.push(`Password must be at least ${this.requirements.minLength} characters long`);
    } else {
      requirements.minLength = true;
    }

    if (this.requirements.maxLength && password.length > this.requirements.maxLength) {
      feedback.push(`Password must be no more than ${this.requirements.maxLength} characters long`);
    }

    // Check character requirements
    if (this.requirements.requireUppercase && !/[A-Z]/.test(password)) {
      feedback.push('Password must contain at least one uppercase letter');
    } else {
      requirements.hasUppercase = true;
    }

    if (this.requirements.requireLowercase && !/[a-z]/.test(password)) {
      feedback.push('Password must contain at least one lowercase letter');
    } else {
      requirements.hasLowercase = true;
    }

    if (this.requirements.requireNumbers && !/[0-9]/.test(password)) {
      feedback.push('Password must contain at least one number');
    } else {
      requirements.hasNumbers = true;
    }

    if (this.requirements.requireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      feedback.push('Password must contain at least one symbol');
    } else {
      requirements.hasSymbols = true;
    }

    // Check forbidden passwords
    if (this.requirements.forbiddenPasswords?.includes(password.toLowerCase())) {
      feedback.push('Password is too common and not allowed');
    }

    // Check forbidden patterns
    if (this.requirements.forbiddenPatterns?.some(pattern => pattern.test(password))) {
      feedback.push('Password contains a forbidden pattern');
    }

    // Calculate score (0-4)
    let score = 0;
    if (requirements.minLength) score++;
    if (requirements.hasUppercase || !this.requirements.requireUppercase) score++;
    if (requirements.hasLowercase || !this.requirements.requireLowercase) score++;
    if (requirements.hasNumbers || !this.requirements.requireNumbers) score++;
    if (requirements.hasSymbols || !this.requirements.requireSymbols) score++;

    // Bonus points for length and complexity
    if (password.length >= 12) score = Math.min(5, score + 0.5);
    if (password.length >= 16) score = Math.min(5, score + 0.5);

    const isValid = feedback.length === 0;
    
    logger.debug('Password validation complete', { 
      isValid, 
      score, 
      feedbackCount: feedback.length,
      requirements 
    });

    return {
      isValid,
      score: Math.floor(score),
      feedback,
      requirements,
    };
  }

  /**
   * Generate a secure password that meets the requirements
   */
  generateSecure(length: number = this.requirements.minLength): string {
    logger.debug('Generating secure password', { length });
    
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let chars = '';
    let password = '';

    // Ensure required character types are included
    if (this.requirements.requireLowercase) {
      chars += lowercase;
      password += lowercase[Math.floor(Math.random() * lowercase.length)];
    }

    if (this.requirements.requireUppercase) {
      chars += uppercase;
      password += uppercase[Math.floor(Math.random() * uppercase.length)];
    }

    if (this.requirements.requireNumbers) {
      chars += numbers;
      password += numbers[Math.floor(Math.random() * numbers.length)];
    }

    if (this.requirements.requireSymbols) {
      chars += symbols;
      password += symbols[Math.floor(Math.random() * symbols.length)];
    }

    // If no specific requirements, include all character types
    if (!chars) {
      chars = lowercase + uppercase + numbers;
    }

    // Fill the rest of the password length
    for (let i = password.length; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }

    // Shuffle the password to avoid predictable patterns
    const shuffled = password.split('').sort(() => Math.random() - 0.5).join('');
    
    logger.debug('Secure password generated successfully');
    return shuffled;
  }
}

/**
 * Create a password validator instance
 */
export function createPasswordValidator(requirements?: Partial<PasswordRequirements>): PasswordValidator {
  return new PasswordValidator(requirements);
}

/**
 * Quick password validation function
 */
export function validatePassword(password: string, requirements?: Partial<PasswordRequirements>): PasswordStrengthResult {
  const validator = createPasswordValidator(requirements);
  return validator.validate(password);
}

/**
 * Generate a secure password
 */
export function generateSecurePassword(length?: number, requirements?: Partial<PasswordRequirements>): string {
  const validator = createPasswordValidator(requirements);
  return validator.generateSecure(length);
}