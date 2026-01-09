/**
 * Environment detection utilities for backend authentication
 *
 * Copyright © 2025 QwickApps.com. All rights reserved.
 * This software is proprietary and confidential.
 */
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
export declare class Environment {
    private static _current;
    /**
     * Get the current runtime environment
     */
    static get current(): RuntimeEnvironment;
    /**
     * Check if running in Node.js
     */
    static get isNode(): boolean;
    /**
     * Check if running in Deno
     */
    static get isDeno(): boolean;
    /**
     * Check if running in Bun
     */
    static get isBun(): boolean;
    /**
     * Get environment variable
     */
    static getEnv(key: string): string | undefined;
    /**
     * Set environment variable (where supported)
     */
    static setEnv(key: string, value: string): void;
    /**
     * Check if environment variable exists
     */
    static hasEnv(key: string): boolean;
}
export declare const isNode: boolean;
export declare const isDeno: boolean;
export declare const isBun: boolean;
export declare const getEnv: typeof Environment.getEnv;
export declare const setEnv: typeof Environment.setEnv;
export declare const hasEnv: typeof Environment.hasEnv;
