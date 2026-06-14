export * from './MockData';
export * from './StorageAdapter';
export * from './MockApi';
export * from './saasService';

// Create a default singleton instance for convenience
import { MockEngine } from './MockApi';
export const mockEngine = new MockEngine();
