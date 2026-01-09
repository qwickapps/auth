/**
 * Authentication helper utilities for backend services
 *
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 */
import { AuthError, AuthErrorType, AuthResult } from '../types/auth';
/**
 * Create an authentication error
 */
export declare function createAuthError(type: AuthErrorType, message: string, details?: any): AuthError;
/**
 * Create a successful authentication result
 */
export declare function createAuthSuccess<T>(data: T): AuthResult<T>;
/**
 * Create a failed authentication result
 */
export declare function createAuthFailure<T = any>(error: AuthError): AuthResult<T>;
/**
 * Check if an error is an authentication error
 */
export declare function isAuthError(error: any): error is AuthError;
/**
 * Validate email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Sanitize user input by removing potentially dangerous characters
 */
export declare function sanitizeInput(input: string): string;
/**
 * Generate a secure random token
 */
export declare function generateSecureToken(length?: number): string;
/**
 * Hash a password using a simple hash function (platform agnostic)
 * Note: In production, use proper hashing libraries like bcrypt, argon2, etc.
 */
export declare function hashPassword(password: string, salt?: string): Promise<string>;
/**
 * Verify a password against a hash
 */
export declare function verifyPassword(password: string, hash: string): Promise<boolean>;
/**
 * Generate a JWT-like token (simplified implementation)
 * Note: In production, use proper JWT libraries
 */
export declare function generateToken(payload: Record<string, any>, secret: string, expiresIn?: number): string;
/**
 * Decode a JWT-like token (simplified implementation)
 */
export declare function decodeToken(token: string): Record<string, any> | null;
