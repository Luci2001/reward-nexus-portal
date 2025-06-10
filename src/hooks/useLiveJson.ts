
import { useState, useEffect, useRef } from 'react';

interface JsonWatcherOptions {
  pollingInterval?: number;
  enableInProduction?: boolean;
}

export const useLiveJson = <T>(
  jsonPath: string, 
  initialData: T,
  options: JsonWatcherOptions = {}
) => {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastModifiedRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { 
    pollingInterval = 2000, 
    enableInProduction = true 
  } = options;

  const fetchJsonData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Add cache-busting parameter
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(`${jsonPath}${cacheBuster}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${jsonPath}: ${response.statusText}`);
      }

      // Check if file was modified
      const lastModified = response.headers.get('last-modified');
      if (lastModified && lastModified === lastModifiedRef.current) {
        setLoading(false);
        return; // No changes detected
      }

      const jsonData = await response.json();
      setData(jsonData);
      lastModifiedRef.current = lastModified;
      
      console.log(`[Live JSON] Updated data from ${jsonPath}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error(`[Live JSON] Error loading ${jsonPath}:`, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    fetchJsonData();

    // Set up polling for live updates
    if (enableInProduction || import.meta.env.DEV) {
      intervalRef.current = setInterval(fetchJsonData, pollingInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [jsonPath, pollingInterval, enableInProduction]);

  const refetch = () => {
    fetchJsonData();
  };

  return {
    data,
    loading,
    error,
    refetch
  };
};
