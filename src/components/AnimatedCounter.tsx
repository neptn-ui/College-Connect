import React from 'react';
import { useCountUp } from '../hooks/useCountUp';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  className = '',
  decimals = 0
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const count = useCountUp(value, duration, isVisible, decimals);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
};
