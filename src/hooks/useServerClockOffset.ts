import { useState, useEffect } from 'react';

/**
 * Calculate the offset between local clock and server clock
 * Returns the offset in milliseconds to add to Date.now() to get server time
 */
export function useServerClockOffset(serverTime: string | null): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    if (!serverTime) return;

    try {
      const serverMs = new Date(serverTime).getTime();
      const localMs = Date.now();
      const calculatedOffset = serverMs - localMs;
      
      setOffset(calculatedOffset);
      console.log(`[Clock Sync] Server offset: ${calculatedOffset}ms`);
    } catch (error) {
      console.error('[Clock Sync] Failed to parse server time:', error);
    }
  }, [serverTime]);

  return offset;
}