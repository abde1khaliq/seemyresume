'use client';

import { useState, useCallback } from 'react';

interface ImageInput {
  id: string;
  base64: string;
  mimeType: string;
}

interface GeneratePortfolioOptions {
  resumeText?: string;
  images?: ImageInput[];
  prompt?: string;
}

interface GenerationResult {
  success: boolean;
  html?: string;
  error?: string;
  duration?: number;
  steps?: string[];
  attempts?: number;
}

export function usePortfolioGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const generate = useCallback(async (options: GeneratePortfolioOptions) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });

      const data: GenerationResult = await response.json();

      if (!data.success) {
        setError(data.error || 'Generation failed');
      } else {
        setResult(data);
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return {
    generate,
    isLoading,
    error,
    result,
    reset,
    html: result?.html,
  };
}
