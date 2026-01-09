/**
 * QwickApps Authentication Backend Library
 * 
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 * 
 * Pure TypeScript authentication logic for backend services.
 * Platform agnostic - works with Node.js, Deno, Bun, and edge functions.
 */

// Types - Core authentication types
export type {
  AuthUser,
  AuthSession,
  AuthError,
  AuthErrorType,
  SignUpCredentials,
  SignInCredentials,
  PasswordResetRequest,
  PasswordUpdateRequest,
  UserProfileUpdate,
  SocialProvider,
  SocialSignInOptions,
  AuthEvent,
  AuthEventType,
  AuthEventListener,
  AuthResult,
  EmailVerificationResult,
  PasswordStrengthResult,
  BackendAuthConfig,
  AuthenticationType,
  AuthServiceClient,
  SocialProviderConfig,
  AuthClientConfig,
} from './types/auth';

// Interfaces
export type { AuthProvider } from './interfaces/auth-provider';

// Password validation utilities
export {
  PasswordValidator,
  createPasswordValidator,
  validatePassword,
  generateSecurePassword,
  DEFAULT_PASSWORD_REQUIREMENTS,
} from './utils/password-validation';
export type { PasswordRequirements } from './utils/password-validation';

// Environment utilities
export {
  Environment,
  isNode,
  isDeno,
  isBun,
  getEnv,
  setEnv,
  hasEnv,
} from './utils/environment';
export type { RuntimeEnvironment } from './utils/environment';

// Authentication helpers
export {
  createAuthError,
  createAuthSuccess,
  createAuthFailure,
  isAuthError,
  isValidEmail,
  sanitizeInput,
  generateSecureToken,
  hashPassword,
  verifyPassword,
  generateToken,
  decodeToken,
} from './utils/auth-helpers';

// Constants
export const QWICKAPPS_AUTH_BACKEND_VERSION = '1.0.0';

// Helper functions for common operations
import type { AuthError, AuthErrorType } from './types/auth';
import { 
  createAuthError as _createAuthError, 
  isValidEmail as _isValidEmail,
  sanitizeInput as _sanitizeInput,
} from './utils/auth-helpers';

/**
 * Validate and sanitize user registration data
 */
export function validateRegistrationData(data: {
  email?: string;
  password?: string;
  name?: string;
}): { isValid: boolean; errors: string[]; sanitized: { email: string; password: string; name?: string } } {
  const errors: string[] = [];
  
  // Handle undefined/null email
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  }
  
  // Handle undefined/null password
  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  }
  
  // Early return if missing required fields
  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      sanitized: { email: data.email || '', password: data.password || '', name: data.name },
    };
  }

  const sanitized = {
    email: _sanitizeInput(data.email!.toLowerCase()),
    password: data.password!, // Don't sanitize passwords
    name: data.name ? _sanitizeInput(data.name) : undefined,
  };

  if (!_isValidEmail(sanitized.email)) {
    errors.push('Invalid email format');
  }

  if (sanitized.password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (sanitized.name && sanitized.name.length < 1) {
    errors.push('Name cannot be empty');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Validate sign-in credentials
 */
export function validateSignInData(data: {
  email?: string;
  password?: string;
}): { isValid: boolean; errors: string[]; sanitized: { email: string; password: string } } {
  const errors: string[] = [];
  
  // Handle undefined/null email
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
    return {
      isValid: false,
      errors,
      sanitized: { email: '', password: data.password || '' },
    };
  }
  
  // Handle undefined/null password
  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
    return {
      isValid: false,
      errors,
      sanitized: { email: data.email, password: '' },
    };
  }

  const sanitized = {
    email: _sanitizeInput(data.email.toLowerCase()),
    password: data.password,
  };

  if (!_isValidEmail(sanitized.email)) {
    errors.push('Invalid email format');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitized,
  };
}

/**
 * Standard authentication error messages
 */
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists with this email',
  EMAIL_NOT_VERIFIED: 'Please verify your email before signing in',
  PASSWORD_TOO_WEAK: 'Password does not meet security requirements',
  INVALID_EMAIL: 'Invalid email format',
  SIGNUP_DISABLED: 'User registration is currently disabled',
  TOKEN_EXPIRED: 'Token has expired',
  NETWORK_ERROR: 'Network error occurred',
  PROVIDER_ERROR: 'Authentication provider error',
  NOT_IMPLEMENTED: 'This feature is not implemented for the current provider',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;

/**
 * Create standard authentication errors with consistent messages
 */
export function createStandardAuthError(type: AuthErrorType, details?: any): AuthError {
  const message = AUTH_ERRORS[type] || AUTH_ERRORS.UNKNOWN_ERROR;
  return _createAuthError(type, message, details);
}

// Default export for convenience
export default {
  validateRegistrationData,
  validateSignInData,
  createStandardAuthError,
  AUTH_ERRORS,
};