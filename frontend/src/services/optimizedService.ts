// Optimized services with caching and debouncing
import axios from "axios";
import { LoadingManager } from "@/lib/apiUtils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Create axios instance with optimizations
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for loading states
api.interceptors.request.use((config) => {
  const loadingKey = `${config.method?.toUpperCase()}_${config.url}`;
  LoadingManager.setLoading(loadingKey, true);
  return config;
});

// Response interceptor for loading states and caching
api.interceptors.response.use(
  (response) => {
    const loadingKey = `${response.config.method?.toUpperCase()}_${response.config.url}`;
    LoadingManager.setLoading(loadingKey, false);
    
    // Add cache headers to responses
    if (response.config.method === 'get') {
      response.headers['cache-control'] = 'public, max-age=300'; // 5 min cache
    }
    
    return response;
  },
  (error) => {
    const loadingKey = `${error.config?.method?.toUpperCase()}_${error.config?.url}`;
    LoadingManager.setLoading(loadingKey, false);
    return Promise.reject(error);
  }
);

// Memory cache for frequently accessed data
class MemoryCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 300000) { // 5 min default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear() {
    this.cache.clear();
  }
}

export const memoryCache = new MemoryCache();

// Optimized service factory
export function createOptimizedService<T>(serviceConfig: {
  baseEndpoint: string;
  cacheTTL?: number;
  useMemoryCache?: boolean;
}) {
  const { baseEndpoint, cacheTTL = 300000, useMemoryCache = true } = serviceConfig;

  return {
    async get<R = T>(endpoint: string = "", params?: any): Promise<R> {
      const cacheKey = `${baseEndpoint}${endpoint}_${JSON.stringify(params)}`;
      
      // Check memory cache first
      if (useMemoryCache) {
        const cached = memoryCache.get(cacheKey);
        if (cached) return cached;
      }
      
      const response = await api.get(`${baseEndpoint}${endpoint}`, { params });
      const data = response.data;
      
      // Cache the result
      if (useMemoryCache) {
        memoryCache.set(cacheKey, data, cacheTTL);
      }
      
      return data;
    },

    async post<R = T>(endpoint: string = "", data?: any): Promise<R> {
      // Clear related cache entries on mutations
      if (useMemoryCache) {
        // Clear cache entries that start with the same base endpoint
        for (const [key] of memoryCache['cache']) {
          if (key.startsWith(baseEndpoint)) {
            memoryCache['cache'].delete(key);
          }
        }
      }
      
      const response = await api.post(`${baseEndpoint}${endpoint}`, data);
      return response.data;
    },

    async put<R = T>(endpoint: string = "", data?: any): Promise<R> {
      // Clear cache on updates
      if (useMemoryCache) {
        for (const [key] of memoryCache['cache']) {
          if (key.startsWith(baseEndpoint)) {
            memoryCache['cache'].delete(key);
          }
        }
      }
      
      const response = await api.put(`${baseEndpoint}${endpoint}`, data);
      return response.data;
    },

    async delete<R = T>(endpoint: string = ""): Promise<R> {
      // Clear cache on deletes
      if (useMemoryCache) {
        for (const [key] of memoryCache['cache']) {
          if (key.startsWith(baseEndpoint)) {
            memoryCache['cache'].delete(key);
          }
        }
      }
      
      const response = await api.delete(`${baseEndpoint}${endpoint}`);
      return response.data;
    },
  };
}

export { api };
