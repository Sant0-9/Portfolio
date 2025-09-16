'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  loadingProgress: number;
  setLoadingProgress: (progress: number) => void;
  registerLoader: (id: string) => void;
  markLoaderComplete: (id: string) => void;
}

const LoadingContext = createContext<LoadingContextType | null>(null);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}

interface LoadingProviderProps {
  children: ReactNode;
  minDurationMs?: number; // minimum time to keep loading screen visible
  maxDurationMs?: number; // hard cap to avoid being stuck forever
}

export function LoadingProvider({ children, minDurationMs = 1000, maxDurationMs = 8000 }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loaders, setLoaders] = useState<Set<string>>(new Set());
  const [completedLoaders, setCompletedLoaders] = useState<Set<string>>(new Set());
  const [startedAt] = useState<number>(() => Date.now());

  const registerLoader = (id: string) => {
    setLoaders(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  const markLoaderComplete = (id: string) => {
    setCompletedLoaders(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
  };

  // Calculate progress based on completed loaders
  useEffect(() => {
    if (loaders.size === 0) return;

    const progress = (completedLoaders.size / loaders.size) * 100;
    setLoadingProgress(progress);

    // If all loaders are complete, finish loading
    if (completedLoaders.size === loaders.size && loaders.size > 0) {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, minDurationMs - elapsed);
      const smoothDelay = 200;
      const delay = remaining + smoothDelay;
      const timer = setTimeout(() => setIsLoading(false), delay);
      return () => clearTimeout(timer);
    }
  }, [loaders.size, completedLoaders.size, startedAt, minDurationMs]);

  // Initial loading timeout fallback
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loaders.size === 0) {
        // No loaders registered, assume loading is done
        setLoadingProgress(100);
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, minDurationMs - elapsed);
        setTimeout(() => setIsLoading(false), remaining);
      }
    }, 3000); // 3 second fallback

    return () => clearTimeout(timeout);
  }, [loaders.size, startedAt, minDurationMs]);

  // Hard cap: ensure we never stay loading beyond maxDurationMs
  useEffect(() => {
    const forceTimer = setTimeout(() => {
      setLoadingProgress(100);
      setIsLoading(false);
    }, maxDurationMs);
    return () => clearTimeout(forceTimer);
  }, [maxDurationMs]);

  return (
    <LoadingContext.Provider value={{
      isLoading,
      setIsLoading,
      loadingProgress,
      setLoadingProgress,
      registerLoader,
      markLoaderComplete
    }}>
      {children}
    </LoadingContext.Provider>
  );
}
