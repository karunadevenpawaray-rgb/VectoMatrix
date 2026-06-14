export interface StorageAdapterInterface {
  getItem(key: string): string | null | Promise<string | null>;
  setItem(key: string, value: string): void | Promise<void>;
}

class BrowserStorageAdapter implements StorageAdapterInterface {
  getItem(key: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  }
  
  setItem(key: string, value: string) {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  }
}

export class StorageManager {
  private adapter: StorageAdapterInterface;

  constructor(customAdapter?: StorageAdapterInterface) {
    this.adapter = customAdapter || new BrowserStorageAdapter();
  }

  async get<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const stored = await this.adapter.getItem(key);
      if (stored) {
        return JSON.parse(stored) as T;
      }
    } catch (e) {
      console.warn(`[MockEngine] Failed to read ${key} from storage`, e);
    }
    return defaultValue;
  }

  async set<T>(key: string, value: T): Promise<void> {
    try {
      const stringified = JSON.stringify(value);
      await this.adapter.setItem(key, stringified);
    } catch (e) {
      console.warn(`[MockEngine] Failed to write ${key} to storage`, e);
    }
  }
}
