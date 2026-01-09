/**
 * Core authentication provider interface for backend services
 * 
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 */

import {
  AuthUser,
  AuthSession,
  AuthResult,
  SignUpCredentials,
  SignInCredentials,
  PasswordResetRequest,
  PasswordUpdateRequest,
  UserProfileUpdate,
  SocialSignInOptions,
} from '../types/auth';

/**
 * Base authentication provider interface for backend services
 * Platform-agnostic authentication operations
 */
export interface AuthProvider {
  /**
   * Initialize the authentication provider
   */
  initialize(): Promise<void>;

  /**
   * Get user by ID
   */
  getUserById(id: string): Promise<AuthUser | null>;

  /**
   * Get user by email
   */
  getUserByEmail(email: string): Promise<AuthUser | null>;

  /**
   * Sign up a new user with email and password
   */
  signUp(credentials: SignUpCredentials): Promise<AuthResult<AuthUser>>;

  /**
   * Verify sign in credentials
   */
  verifyCredentials(credentials: SignInCredentials): Promise<AuthResult<AuthUser>>;

  /**
   * Create session for authenticated user
   */
  createSession(user: AuthUser): Promise<AuthResult<AuthSession>>;

  /**
   * Verify and refresh session
   */
  verifySession(accessToken: string): Promise<AuthResult<AuthSession>>;

  /**
   * Refresh session with refresh token
   */
  refreshSession(refreshToken: string): Promise<AuthResult<AuthSession>>;

  /**
   * Invalidate session (logout)
   */
  invalidateSession(accessToken: string): Promise<AuthResult<null>>;

  /**
   * Send password reset email
   */
  sendPasswordResetEmail(request: PasswordResetRequest): Promise<AuthResult<null>>;

  /**
   * Verify password reset token
   */
  verifyPasswordResetToken(token: string): Promise<AuthResult<{ email: string }>>;

  /**
   * Update user password with reset token
   */
  updatePasswordWithToken(token: string, newPassword: string): Promise<AuthResult<null>>;

  /**
   * Update user password (authenticated)
   */
  updatePassword(userId: string, request: PasswordUpdateRequest): Promise<AuthResult<null>>;

  /**
   * Update user profile
   */
  updateProfile(userId: string, update: UserProfileUpdate): Promise<AuthResult<AuthUser>>;

  /**
   * Send email verification
   */
  sendEmailVerification(userId: string): Promise<AuthResult<null>>;

  /**
   * Verify email with token
   */
  verifyEmail(token: string): Promise<AuthResult<AuthUser>>;

  /**
   * Clean up resources
   */
  dispose(): Promise<void>;
}