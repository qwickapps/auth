/**
 * Environment detection utilities for backend authentication
 * 
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 */

// Type declarations for runtime globals
declare global {
  const Deno: {
    env: {
      get(key: string): string | undefined;
      set(key: string, value: string): void;
    };
  };
  const Bun: any;
}

/**
 * Runtime environment types
 */
export type RuntimeEnvironment = 'node' | 'deno' | 'bun' | 'unknown';

/**
 * Environment detection utilities
 */
export class Environment {
  private static _current: RuntimeEnvironment | null = null;

  /**
   * Get the current runtime environment
   */
  static get current(): RuntimeEnvironment {
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
    if (typeof process !== 'undefined' && process.versions?.node) {
      this._current = 'node';
      return this._current;
    }

    this._current = 'unknown';
    return this._current;
  }

  /**
   * Check if running in Node.js
   */
  static get isNode(): boolean {
    return this.current === 'node';
  }

  /**
   * Check if running in Deno
   */
  static get isDeno(): boolean {
    return this.current === 'deno';
  }

  /**
   * Check if running in Bun
   */
  static get isBun(): boolean {
    return this.current === 'bun';
  }

  /**
   * Get environment variable
   */
  static getEnv(key: string): string | undefined {
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
  static setEnv(key: string, value: string): void {
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
  static hasEnv(key: string): boolean {
    return this.getEnv(key) !== undefined;
  }
}

// Convenience exports
export const isNode = Environment.isNode;
export const isDeno = Environment.isDeno;
export const isBun = Environment.isBun;
export const getEnv = Environment.getEnv.bind(Environment);
export const setEnv = Environment.setEnv.bind(Environment);
export const hasEnv = Environment.hasEnv.bind(Environment);