import { useState, useEffect } from 'react';

export function useCountUp(end: number, duration: number = 2000, isVisible: boolean = true, decimals: number = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCount(0);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      if (progress < duration) {
        // easeOutQuart easing function for a smooth slow-down at the end
        const easeProgress = 1 - Math.pow(1 - progress / duration, 4);
        const nextVal = easeProgress * end;
        setCount(Math.min(end, nextVal));
        animationFrame = requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(updateCount);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible, decimals]);

  return count.toFixed(decimals);
}
