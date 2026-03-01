"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bunpo100-grammar-progress";

interface GrammarProgress {
  learnedIds: number[];
  timestamps: Record<number, number>;
}

const DEFAULT_PROGRESS: GrammarProgress = {
  learnedIds: [],
  timestamps: {},
};

export function useGrammarProgress() {
  const [progress, setProgress] = useState<GrammarProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load grammar progress:", e);
    }
    setIsLoaded(true);
  }, []);

  const save = useCallback((data: GrammarProgress) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Failed to save grammar progress:", e);
    }
  }, []);

  const toggleLearned = useCallback((id: number) => {
    setProgress((prev) => {
      const isCurrentlyLearned = prev.learnedIds.includes(id);
      let next: GrammarProgress;

      if (isCurrentlyLearned) {
        const { [id]: _, ...remainingTimestamps } = prev.timestamps;
        next = {
          learnedIds: prev.learnedIds.filter((lid) => lid !== id),
          timestamps: remainingTimestamps,
        };
      } else {
        next = {
          learnedIds: [...prev.learnedIds, id],
          timestamps: { ...prev.timestamps, [id]: Date.now() },
        };
      }

      save(next);
      return next;
    });
  }, [save]);

  const isLearned = useCallback(
    (id: number) => progress.learnedIds.includes(id),
    [progress.learnedIds]
  );

  return {
    isLoaded,
    learnedCount: progress.learnedIds.length,
    toggleLearned,
    isLearned,
  };
}
