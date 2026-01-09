/**
 * QwickApps Authentication Backend Library
 *
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 *
 * Pure TypeScript authentication logic for backend services.
 * Platform agnostic - works with Node.js, Deno, Bun, and edge functions.
 */
export type { AuthUser, AuthSession, AuthError, AuthErrorType, SignUpCredentials, SignInCredentials, PasswordResetRequest, PasswordUpdateRequest, UserProfileUpdate, SocialProvider, SocialSignInOptions, AuthEvent, AuthEventType, AuthEventListener, AuthResult, EmailVerificationResult, PasswordStrengthResult, BackendAuthConfig, AuthenticationType, AuthServiceClient, SocialProviderConfig, AuthClientConfig, } from './types/auth';
export type { AuthProvider } from './interfaces/auth-provider';
export { PasswordValidator, createPasswordValidator, validatePassword, generateSecurePassword, DEFAULT_PASSWORD_REQUIREMENTS, } from './utils/password-validation';
export type { PasswordRequirements } from './utils/password-validation';
export { Environment, isNode, isDeno, isBun, getEnv, setEnv, hasEnv, } from './utils/environment';
export type { RuntimeEnvironment } from './utils/environment';
export { createAuthError, createAuthSuccess, createAuthFailure, isAuthError, isValidEmail, sanitizeInput, generateSecureToken, hashPassword, verifyPassword, generateToken, decodeToken, } from './utils/auth-helpers';
export declare const QWICKAPPS_AUTH_BACKEND_VERSION = "1.0.0";
import type { AuthError, AuthErrorType } from './types/auth';
/**
 * Validate and sanitize user registration data
 */
export declare function validateRegistrationData(data: {
    email?: string;
    password?: string;
    name?: string;
}): {
    isValid: boolean;
    errors: string[];
    sanitized: {
        email: string;
        password: string;
        name?: string;
    };
};
/**
 * Validate sign-in credentials
 */
export declare function validateSignInData(data: {
    email?: string;
    password?: string;
}): {
    isValid: boolean;
    errors: string[];
    sanitized: {
        email: string;
        password: string;
    };
};
/**
 * Standard authentication error messages
 */
export declare const AUTH_ERRORS: {
    readonly INVALID_CREDENTIALS: "Invalid email or password";
    readonly USER_NOT_FOUND: "User not found";
    readonly USER_ALREADY_EXISTS: "User already exists with this email";
    readonly EMAIL_NOT_VERIFIED: "Please verify your email before signing in";
    readonly PASSWORD_TOO_WEAK: "Password does not meet security requirements";
    readonly INVALID_EMAIL: "Invalid email format";
    readonly SIGNUP_DISABLED: "User registration is currently disabled";
    readonly TOKEN_EXPIRED: "Token has expired";
    readonly NETWORK_ERROR: "Network error occurred";
    readonly PROVIDER_ERROR: "Authentication provider error";
    readonly NOT_IMPLEMENTED: "This feature is not implemented for the current provider";
    readonly UNKNOWN_ERROR: "An unknown error occurred";
};
/**
 * Create standard authentication errors with consistent messages
 */
export declare function createStandardAuthError(type: AuthErrorType, details?: any): AuthError;
declare const _default: {
    validateRegistrationData: typeof validateRegistrationData;
    validateSignInData: typeof validateSignInData;
    createStandardAuthError: typeof createStandardAuthError;
    AUTH_ERRORS: {
        readonly INVALID_CREDENTIALS: "Invalid email or password";
        readonly USER_NOT_FOUND: "User not found";
        readonly USER_ALREADY_EXISTS: "User already exists with this email";
        readonly EMAIL_NOT_VERIFIED: "Please verify your email before signing in";
        readonly PASSWORD_TOO_WEAK: "Password does not meet security requirements";
        readonly INVALID_EMAIL: "Invalid email format";
        readonly SIGNUP_DISABLED: "User registration is currently disabled";
        readonly TOKEN_EXPIRED: "Token has expired";
        readonly NETWORK_ERROR: "Network error occurred";
        readonly PROVIDER_ERROR: "Authentication provider error";
        readonly NOT_IMPLEMENTED: "This feature is not implemented for the current provider";
        readonly UNKNOWN_ERROR: "An unknown error occurred";
    };
};
export default _default;
