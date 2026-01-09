/**
 * Password validation utilities for backend authentication
 *
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 */
import { PasswordStrengthResult } from '../types/auth';
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
export declare const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirements;
/**
 * Password validation class
 */
export declare class PasswordValidator {
    private requirements;
    constructor(requirements?: Partial<PasswordRequirements>);
    /**
     * Validate a password against the requirements
     */
    validate(password: string): PasswordStrengthResult;
    /**
     * Generate a secure password that meets the requirements
     */
    generateSecure(length?: number): string;
}
/**
 * Create a password validator instance
 */
export declare function createPasswordValidator(requirements?: Partial<PasswordRequirements>): PasswordValidator;
/**
 * Quick password validation function
 */
export declare function validatePassword(password: string, requirements?: Partial<PasswordRequirements>): PasswordStrengthResult;
/**
 * Generate a secure password
 */
export declare function generateSecurePassword(length?: number, requirements?: Partial<PasswordRequirements>): string;
