# @qwickapps/auth-backend

Pure TypeScript authentication logic for QwickApps backend services. Platform agnostic - works with Node.js, Deno, Bun, and edge functions.

## Features

- 🔒 **Pure Backend Logic** - No browser dependencies, server-side focused
- 🌐 **Platform Agnostic** - Works with Node.js, Deno, Bun, and edge runtimes
- 🛡️ **Security First** - Password validation, secure token generation, input sanitization
- 📝 **TypeScript** - Full type safety with comprehensive interfaces
- 🎯 **Modular** - Import only what you need
- ⚡ **Zero Dependencies** - Lightweight with minimal external dependencies

## Installation

```bash
npm install @qwickapps/auth-backend
```

## Quick Start

```typescript
import { 
  validateRegistrationData, 
  validateSignInData,
  hashPassword,
  verifyPassword,
  createStandardAuthError 
} from '@qwickapps/auth-backend';

// Validate user registration
const { isValid, errors, sanitized } = validateRegistrationData({
  email: 'user@example.com',
  password: 'SecurePass123!',
  name: 'John Doe'
});

if (!isValid) {
  console.error('Validation errors:', errors);
}

// Hash password for storage
const hashedPassword = await hashPassword(sanitized.password);

// Verify password during login
const isCorrectPassword = await verifyPassword('SecurePass123!', hashedPassword);
```

## Core Types

```typescript
interface AuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  lastSignInAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: Date;
  tokenType: string;
}

interface AuthResult<T = any> {
  data: T | null;
  error: AuthError | null;
}
```

## Password Validation

```typescript
import { validatePassword, generateSecurePassword } from '@qwickapps/auth-backend';

// Validate password strength
const result = validatePassword('MyPassword123!');
console.log(result.isValid); // true/false
console.log(result.score);   // 0-4 strength score
console.log(result.feedback); // Array of suggestions

// Generate secure password
const securePassword = generateSecurePassword(16);
```

## Environment Detection

```typescript
import { Environment, isNode, isDeno, isBun } from '@qwickapps/auth-backend';

console.log(Environment.current); // 'node' | 'deno' | 'bun' | 'unknown'
console.log(isNode); // boolean
console.log(isDeno); // boolean

// Get environment variables (works across runtimes)
const dbUrl = Environment.getEnv('DATABASE_URL');
```

## Auth Provider Interface

Implement the `AuthProvider` interface for your specific backend:

```typescript
import { AuthProvider, AuthResult, AuthUser } from '@qwickapps/auth-backend';

class MyAuthProvider implements AuthProvider {
  async initialize(): Promise<void> {
    // Initialize your auth provider
  }

  async signUp(credentials: SignUpCredentials): Promise<AuthResult<AuthUser>> {
    // Implement user registration
  }

  async verifyCredentials(credentials: SignInCredentials): Promise<AuthResult<AuthUser>> {
    // Implement credential verification
  }

  // ... implement other required methods
}
```

## Error Handling

```typescript
import { createStandardAuthError, AUTH_ERRORS } from '@qwickapps/auth-backend';

// Create consistent error responses
const error = createStandardAuthError('INVALID_CREDENTIALS');
console.log(error.message); // "Invalid email or password"

// All available error types
console.log(AUTH_ERRORS.USER_NOT_FOUND); // "User not found"
console.log(AUTH_ERRORS.EMAIL_NOT_VERIFIED); // "Please verify your email..."
```

## Platform Support

- ✅ **Node.js** 16+
- ✅ **Deno** 1.28+  
- ✅ **Bun** 1.0+
- ✅ **Edge Functions** (Supabase, Vercel, Cloudflare Workers)

## Security Features

- Password strength validation with customizable requirements
- Secure token generation using crypto APIs
- Input sanitization to prevent injection attacks
- Constant-time password verification
- JWT-like token utilities (simplified - use proper JWT libs in production)

## Development vs Production

This library includes simplified implementations of cryptographic functions for development and prototyping. In production:

- Use proper bcrypt/argon2 for password hashing
- Use established JWT libraries (jsonwebtoken, jose)  
- Use proper CSRF protection
- Implement rate limiting
- Use secure session storage

## License

Copyright (c) 2025 QwickApps.com. All rights reserved.
This software is proprietary and confidential.