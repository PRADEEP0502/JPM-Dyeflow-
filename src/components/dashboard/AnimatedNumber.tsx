import { useCountUp } from '../../hooks/useCountUp';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  durationMs?: number;
  formatter?: (value: number) => string;
}

export function AnimatedNumber({ value, decimals = 0, durationMs = 700, formatter }: AnimatedNumberProps) {
  const animated = useCountUp(value, durationMs, decimals);
  return <>{formatter ? formatter(animated) : animated.toLocaleString('en-IN')}</>;
}
