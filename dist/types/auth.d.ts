/**
 * Core authentication types and interfaces for QwickApps Auth Backend
 *
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 */
/**
 * Represents a user in the authentication system
 */
export interface AuthUser {
    id: string;
    email: string;
    emailVerified: boolean;
    name?: string | undefined;
    avatarUrl?: string | undefined;
    phoneNumber?: string | undefined;
    lastSignInAt?: Date | undefined;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any> | undefined;
}
/**
 * User session information
 */
export interface AuthSession {
    user: AuthUser;
    accessToken: string;
    refreshToken?: string | undefined;
    expiresAt?: Date | undefined;
    tokenType: string;
    providerToken?: string | undefined;
    providerRefreshToken?: string | undefined;
}
/**
 * Authentication error types
 */
export type AuthErrorType = 'INVALID_CREDENTIALS' | 'USER_NOT_FOUND' | 'USER_ALREADY_EXISTS' | 'EMAIL_NOT_VERIFIED' | 'PASSWORD_TOO_WEAK' | 'INVALID_EMAIL' | 'SIGNUP_DISABLED' | 'TOKEN_EXPIRED' | 'NETWORK_ERROR' | 'PROVIDER_ERROR' | 'NOT_IMPLEMENTED' | 'UNKNOWN_ERROR';
/**
 * Authentication error
 */
export interface AuthError {
    type: AuthErrorType;
    message: string;
    details?: any;
}
/**
 * Sign up credentials
 */
export interface SignUpCredentials {
    email: string;
    password: string;
    name?: string;
    metadata?: Record<string, any>;
}
/**
 * Sign in credentials
 */
export interface SignInCredentials {
    email: string;
    password: string;
    rememberMe?: boolean;
}
/**
 * Password reset request
 */
export interface PasswordResetRequest {
    email: string;
    redirectTo?: string;
}
/**
 * Password update request
 */
export interface PasswordUpdateRequest {
    currentPassword?: string;
    newPassword: string;
}
/**
 * User profile update request
 */
export interface UserProfileUpdate {
    name?: string;
    avatarUrl?: string;
    phoneNumber?: string;
    metadata?: Record<string, any>;
}
/**
 * Social authentication providers
 */
export type SocialProvider = 'google' | 'facebook' | 'github' | 'twitter' | 'linkedin';
/**
 * Social sign in options
 */
export interface SocialSignInOptions {
    provider: SocialProvider;
    redirectTo?: string;
    scopes?: string[];
}
/**
 * Authentication event types
 */
export type AuthEventType = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'PASSWORD_RECOVERY';
/**
 * Authentication event
 */
export interface AuthEvent {
    type: AuthEventType;
    session: AuthSession | null;
    user: AuthUser | null;
    error?: AuthError | undefined;
}
/**
 * Authentication event listener
 */
export type AuthEventListener = (event: AuthEvent) => void;
/**
 * Authentication result
 */
export interface AuthResult<T = any> {
    data: T | null;
    error: AuthError | null;
}
/**
 * Email verification result
 */
export interface EmailVerificationResult {
    verified: boolean;
    message: string;
}
/**
 * Password strength validation result
 */
export interface PasswordStrengthResult {
    isValid: boolean;
    score: number;
    feedback: string[];
    requirements: {
        minLength: boolean;
        hasUppercase: boolean;
        hasLowercase: boolean;
        hasNumbers: boolean;
        hasSymbols: boolean;
    };
}
/**
 * Backend-specific authentication configuration
 */
export interface BackendAuthConfig {
    /**
     * Application ID - used to create unique storage keys and prevent conflicts
     */
    appId: string;
    /**
     * Password requirements
     */
    passwordRequirements?: {
        minLength: number;
        requireUppercase: boolean;
        requireLowercase: boolean;
        requireNumbers: boolean;
        requireSymbols: boolean;
    };
    /**
     * Email configuration for password reset, etc.
     */
    email?: {
        fromAddress: string;
        fromName?: string;
    };
    /**
     * JWT configuration
     */
    jwt?: {
        secret: string;
        expiresIn: string;
        refreshExpiresIn: string;
    };
}
/**
 * Authentication types supported by the system
 */
export type AuthenticationType = 'email-password' | 'social-google' | 'social-twitter' | 'oauth' | 'magic-link' | 'anonymous';
/**
 * Auth service client interface - abstraction for different auth backends
 */
export interface AuthServiceClient {
    /** Get current session from service */
    getCurrentSession(): Promise<AuthSession | null>;
    /** Sign in with credentials */
    signIn(credentials: SignInCredentials): Promise<AuthResult<AuthSession>>;
    /** Sign up new user */
    signUp(credentials: SignUpCredentials): Promise<AuthResult<AuthUser>>;
    /** Sign out current user */
    signOut(): Promise<AuthResult<null>>;
    /** Request password reset */
    resetPassword(request: PasswordResetRequest): Promise<AuthResult<null>>;
    /** Update user profile */
    updateProfile(update: Partial<AuthUser>): Promise<AuthResult<AuthUser>>;
    /** Refresh current session */
    refreshSession(): Promise<AuthResult<AuthSession>>;
    /** Sign in with social provider */
    signInWithProvider(options: SocialSignInOptions): Promise<AuthResult<AuthSession>>;
    /** Set up auth state change listener */
    onAuthStateChange(callback: (session: AuthSession | null, error?: AuthError) => void): () => void;
    /** Get headers for API requests (provider-specific implementation) */
    getHeaders(): HeadersInit;
}
/**
 * Base social provider configuration (UI-agnostic)
 */
export interface SocialProviderConfig {
    id: SocialProvider;
    name: string;
    enabled: boolean;
}
/**
 * Base authentication client configuration (UI-agnostic)
 */
export interface AuthClientConfig {
    /**
     * Auth service endpoint URL
     */
    serviceEndpoint: string;
    /**
     * Supabase anonymous key for Edge Functions authentication
     */
    supabaseAnonKey: string;
    /**
     * Authentication types this app supports
     */
    supportedAuthTypes: AuthenticationType[];
    /**
     * Default authentication type to show first
     */
    defaultAuthType: AuthenticationType;
    /**
     * App configuration
     */
    appName?: string;
    /**
     * Redirect URLs for client-side routing
     */
    redirectUrls?: {
        afterSignIn?: string;
        afterSignOut?: string;
        afterSignUp?: string;
        passwordReset?: string;
    };
    /**
     * Social providers configuration (if social auth supported)
     */
    socialProviders?: SocialProviderConfig[];
    /**
     * Feature flags
     */
    features?: {
        socialLogin?: boolean;
        emailVerification?: boolean;
        passwordReset?: boolean;
        registration?: boolean;
    };
}
