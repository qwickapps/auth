/**
 * Authentication helper utilities for backend services
 * 
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 */

import { AuthError, AuthErrorType, AuthResult } from '../types/auth';
import { getLogger } from '@qwickapps/logging';

const logger = getLogger('AuthHelpers');

/**
 * Create an authentication error
 */
export function createAuthError(type: AuthErrorType, message: string, details?: any): AuthError {
  logger.debug('Creating auth error', { type, message, details });
  return { type, message, details };
}

/**
 * Create a successful authentication result
 */
export function createAuthSuccess<T>(data: T): AuthResult<T> {
  logger.debug('Creating successful auth result');
  return { data, error: null };
}

/**
 * Create a failed authentication result
 */
export function createAuthFailure<T = any>(error: AuthError): AuthResult<T> {
  logger.debug('Creating failed auth result', { error });
  return { data: null, error };
}

/**
 * Check if an error is an authentication error
 */
export function isAuthError(error: any): error is AuthError {
  return error && typeof error === 'object' && 'type' in error && 'message' in error;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  logger.debug('Email validation', { email: email.substring(0, 3) + '***', isValid });
  return isValid;
}

/**
 * Sanitize user input by removing potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  // Remove control characters and normalize whitespace
  const sanitized = input
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .trim()
    .replace(/\s+/g, ' '); // Normalize whitespace
  
  logger.debug('Input sanitized', { 
    originalLength: input.length, 
    sanitizedLength: sanitized.length 
  });
  
  return sanitized;
}

/**
 * Generate a secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  // Use crypto.getRandomValues if available, fallback to Math.random
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      token += chars[array[i] % chars.length];
    }
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  
  logger.debug('Secure token generated', { length });
  return token;
}

/**
 * Hash a password using a simple hash function (platform agnostic)
 * Note: In production, use proper hashing libraries like bcrypt, argon2, etc.
 */
export async function hashPassword(password: string, salt?: string): Promise<string> {
  logger.debug('Hashing password');
  
  // Generate salt if not provided
  if (!salt) {
    salt = generateSecureToken(16);
  }
  
  // Simple hash implementation using TextEncoder and crypto.subtle if available
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `${salt}:${hashHex}`;
  }
  
  // Fallback simple hash (not cryptographically secure - use in development only)
  let hash = 0;
  const str = password + salt;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  logger.warn('Using fallback hash function - not suitable for production');
  return `${salt}:${Math.abs(hash).toString(16)}`;
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  logger.debug('Verifying password');
  
  const [salt, storedHash] = hash.split(':');
  if (!salt || !storedHash) {
    logger.debug('Invalid hash format');
    return false;
  }
  
  const newHash = await hashPassword(password, salt);
  const [, newHashValue] = newHash.split(':');
  
  const isValid = newHashValue === storedHash;
  logger.debug('Password verification complete', { isValid });
  return isValid;
}

/**
 * Generate a JWT-like token (simplified implementation)
 * Note: In production, use proper JWT libraries
 */
export function generateToken(payload: Record<string, any>, secret: string, expiresIn: number = 3600): string {
  logger.debug('Generating token', { expiresIn });
  
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  };
  
  // Simple base64 encoding (not cryptographically secure - use proper JWT library in production)
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(tokenPayload));
  const signature = btoa(`${encodedHeader}.${encodedPayload}.${secret}`);
  
  logger.warn('Using simplified token generation - use proper JWT library in production');
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Decode a JWT-like token (simplified implementation)
 */
export function decodeToken(token: string): Record<string, any> | null {
  logger.debug('Decoding token');
  
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) {
      logger.debug('Invalid token format');
      return null;
    }
    
    const decodedPayload = JSON.parse(atob(payload));
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && decodedPayload.exp < now) {
      logger.debug('Token expired');
      return null;
    }
    
    logger.debug('Token decoded successfully');
    return decodedPayload;
  } catch (error) {
    logger.debug('Token decode failed', { error });
    return null;
  }
}