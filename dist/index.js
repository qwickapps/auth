'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var logging = require('@qwickapps/logging');

/**
 * Password validation utilities for backend authentication
 *
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 */
const logger$1 = logging.getLogger('PasswordValidator');
/**
 * Default password requirements
 */
const DEFAULT_PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: false,
  maxLength: 128,
  forbiddenPasswords: ['password', '12345678', 'password123', 'admin', 'qwerty', 'letmein'],
  forbiddenPatterns: [/(.)\1{3,}/,
  // Repeated characters (aaaa)
  /^(?:012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)/ // Sequential patterns
  ]
};
/**
 * Password validation class
 */
class PasswordValidator {
  constructor(requirements = {}) {
    this.requirements = {
      ...DEFAULT_PASSWORD_REQUIREMENTS,
      ...requirements
    };
    logger$1.debug('PasswordValidator initialized', {
      requirements: this.requirements
    });
  }
  /**
   * Validate a password against the requirements
   */
  validate(password) {
    var _this$requirements$fo, _this$requirements$fo2;
    logger$1.debug('Validating password strength');
    const feedback = [];
    const requirements = {
      minLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumbers: false,
      hasSymbols: false
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
    if ((_this$requirements$fo = this.requirements.forbiddenPasswords) !== null && _this$requirements$fo !== void 0 && _this$requirements$fo.includes(password.toLowerCase())) {
      feedback.push('Password is too common and not allowed');
    }
    // Check forbidden patterns
    if ((_this$requirements$fo2 = this.requirements.forbiddenPatterns) !== null && _this$requirements$fo2 !== void 0 && _this$requirements$fo2.some(pattern => pattern.test(password))) {
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
    logger$1.debug('Password validation complete', {
      isValid,
      score,
      feedbackCount: feedback.length,
      requirements
    });
    return {
      isValid,
      score: Math.floor(score),
      feedback,
      requirements
    };
  }
  /**
   * Generate a secure password that meets the requirements
   */
  generateSecure(length = this.requirements.minLength) {
    logger$1.debug('Generating secure password', {
      length
    });
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
    logger$1.debug('Secure password generated successfully');
    return shuffled;
  }
}
/**
 * Create a password validator instance
 */
function createPasswordValidator(requirements) {
  return new PasswordValidator(requirements);
}
/**
 * Quick password validation function
 */
function validatePassword(password, requirements) {
  const validator = createPasswordValidator(requirements);
  return validator.validate(password);
}
/**
 * Generate a secure password
 */
function generateSecurePassword(length, requirements) {
  const validator = createPasswordValidator(requirements);
  return validator.generateSecure(length);
}

/**
 * Environment detection utilities for backend authentication
 *
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 */
/**
 * Environment detection utilities
 */
class Environment {
  /**
   * Get the current runtime environment
   */
  static get current() {
    var _process$versions;
    if (this._current) return this._current;
    // Detect Deno
    if (typeof globalThis !== 'undefined' && 'Deno' in globalThis) {
      this._current = 'deno';
      return this._current;
    }
    // Detect Bun
    if (typeof globalThis !== 'undefined' && 'Bun' in globalThis) {
      this._current = 'bun';
      return this._current;
    }
    // Detect Node.js
    if (typeof process !== 'undefined' && (_process$versions = process.versions) !== null && _process$versions !== void 0 && _process$versions.node) {
      this._current = 'node';
      return this._current;
    }
    this._current = 'unknown';
    return this._current;
  }
  /**
   * Check if running in Node.js
   */
  static get isNode() {
    return this.current === 'node';
  }
  /**
   * Check if running in Deno
   */
  static get isDeno() {
    return this.current === 'deno';
  }
  /**
   * Check if running in Bun
   */
  static get isBun() {
    return this.current === 'bun';
  }
  /**
   * Get environment variable
   */
  static getEnv(key) {
    if (this.isDeno) {
      return Deno.env.get(key);
    }
    if (this.isNode || this.isBun) {
      return process.env[key];
    }
    return undefined;
  }
  /**
   * Set environment variable (where supported)
   */
  static setEnv(key, value) {
    if (this.isDeno) {
      Deno.env.set(key, value);
      return;
    }
    if (this.isNode || this.isBun) {
      process.env[key] = value;
      return;
    }
    throw new Error(`Setting environment variables not supported in ${this.current}`);
  }
  /**
   * Check if environment variable exists
   */
  static hasEnv(key) {
    return this.getEnv(key) !== undefined;
  }
}
Environment._current = null;
// Convenience exports
const isNode = Environment.isNode;
const isDeno = Environment.isDeno;
const isBun = Environment.isBun;
const getEnv = Environment.getEnv.bind(Environment);
const setEnv = Environment.setEnv.bind(Environment);
const hasEnv = Environment.hasEnv.bind(Environment);

/**
 * Authentication helper utilities for backend services
 *
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 */
const logger = logging.getLogger('AuthHelpers');
/**
 * Create an authentication error
 */
function createAuthError(type, message, details) {
  logger.debug('Creating auth error', {
    type,
    message,
    details
  });
  return {
    type,
    message,
    details
  };
}
/**
 * Create a successful authentication result
 */
function createAuthSuccess(data) {
  logger.debug('Creating successful auth result');
  return {
    data,
    error: null
  };
}
/**
 * Create a failed authentication result
 */
function createAuthFailure(error) {
  logger.debug('Creating failed auth result', {
    error
  });
  return {
    data: null,
    error
  };
}
/**
 * Check if an error is an authentication error
 */
function isAuthError(error) {
  return error && typeof error === 'object' && 'type' in error && 'message' in error;
}
/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  logger.debug('Email validation', {
    email: email.substring(0, 3) + '***',
    isValid
  });
  return isValid;
}
/**
 * Sanitize user input by removing potentially dangerous characters
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  // Remove control characters and normalize whitespace
  const sanitized = input.replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
  .trim().replace(/\s+/g, ' '); // Normalize whitespace
  logger.debug('Input sanitized', {
    originalLength: input.length,
    sanitizedLength: sanitized.length
  });
  return sanitized;
}
/**
 * Generate a secure random token
 */
function generateSecureToken(length = 32) {
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
  logger.debug('Secure token generated', {
    length
  });
  return token;
}
/**
 * Hash a password using a simple hash function (platform agnostic)
 * Note: In production, use proper hashing libraries like bcrypt, argon2, etc.
 */
async function hashPassword(password, salt) {
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
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  logger.warn('Using fallback hash function - not suitable for production');
  return `${salt}:${Math.abs(hash).toString(16)}`;
}
/**
 * Verify a password against a hash
 */
async function verifyPassword(password, hash) {
  logger.debug('Verifying password');
  const [salt, storedHash] = hash.split(':');
  if (!salt || !storedHash) {
    logger.debug('Invalid hash format');
    return false;
  }
  const newHash = await hashPassword(password, salt);
  const [, newHashValue] = newHash.split(':');
  const isValid = newHashValue === storedHash;
  logger.debug('Password verification complete', {
    isValid
  });
  return isValid;
}
/**
 * Generate a JWT-like token (simplified implementation)
 * Note: In production, use proper JWT libraries
 */
function generateToken(payload, secret, expiresIn = 3600) {
  logger.debug('Generating token', {
    expiresIn
  });
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn
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
function decodeToken(token) {
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
    logger.debug('Token decode failed', {
      error
    });
    return null;
  }
}

/**
 * QwickApps Authentication Backend Library
 *
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 *
 * Pure TypeScript authentication logic for backend services.
 * Platform agnostic - works with Node.js, Deno, Bun, and edge functions.
 */
// Password validation utilities
// Constants
const QWICKAPPS_AUTH_BACKEND_VERSION = '1.0.0';
/**
 * Validate and sanitize user registration data
 */
function validateRegistrationData(data) {
  const errors = [];
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
      sanitized: {
        email: data.email || '',
        password: data.password || '',
        name: data.name
      }
    };
  }
  const sanitized = {
    email: sanitizeInput(data.email.toLowerCase()),
    password: data.password,
    // Don't sanitize passwords
    name: data.name ? sanitizeInput(data.name) : undefined
  };
  if (!isValidEmail(sanitized.email)) {
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
    sanitized
  };
}
/**
 * Validate sign-in credentials
 */
function validateSignInData(data) {
  const errors = [];
  // Handle undefined/null email
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
    return {
      isValid: false,
      errors,
      sanitized: {
        email: '',
        password: data.password || ''
      }
    };
  }
  // Handle undefined/null password
  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
    return {
      isValid: false,
      errors,
      sanitized: {
        email: data.email,
        password: ''
      }
    };
  }
  const sanitized = {
    email: sanitizeInput(data.email.toLowerCase()),
    password: data.password
  };
  if (!isValidEmail(sanitized.email)) {
    errors.push('Invalid email format');
  }
  return {
    isValid: errors.length === 0,
    errors,
    sanitized
  };
}
/**
 * Standard authentication error messages
 */
const AUTH_ERRORS = {
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
  UNKNOWN_ERROR: 'An unknown error occurred'
};
/**
 * Create standard authentication errors with consistent messages
 */
function createStandardAuthError(type, details) {
  const message = AUTH_ERRORS[type] || AUTH_ERRORS.UNKNOWN_ERROR;
  return createAuthError(type, message, details);
}
// Default export for convenience
var index = {
  validateRegistrationData,
  validateSignInData,
  createStandardAuthError,
  AUTH_ERRORS
};

exports.AUTH_ERRORS = AUTH_ERRORS;
exports.DEFAULT_PASSWORD_REQUIREMENTS = DEFAULT_PASSWORD_REQUIREMENTS;
exports.Environment = Environment;
exports.PasswordValidator = PasswordValidator;
exports.QWICKAPPS_AUTH_BACKEND_VERSION = QWICKAPPS_AUTH_BACKEND_VERSION;
exports.createAuthError = createAuthError;
exports.createAuthFailure = createAuthFailure;
exports.createAuthSuccess = createAuthSuccess;
exports.createPasswordValidator = createPasswordValidator;
exports.createStandardAuthError = createStandardAuthError;
exports.decodeToken = decodeToken;
exports.default = index;
exports.generateSecurePassword = generateSecurePassword;
exports.generateSecureToken = generateSecureToken;
exports.generateToken = generateToken;
exports.getEnv = getEnv;
exports.hasEnv = hasEnv;
exports.hashPassword = hashPassword;
exports.isAuthError = isAuthError;
exports.isBun = isBun;
exports.isDeno = isDeno;
exports.isNode = isNode;
exports.isValidEmail = isValidEmail;
exports.sanitizeInput = sanitizeInput;
exports.setEnv = setEnv;
exports.validatePassword = validatePassword;
exports.validateRegistrationData = validateRegistrationData;
exports.validateSignInData = validateSignInData;
exports.verifyPassword = verifyPassword;
//# sourceMappingURL=index.js.map
