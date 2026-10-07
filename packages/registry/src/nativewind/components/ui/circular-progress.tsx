/**
 * ◆ Lumin custom (M3 / Apple HIG determinate circular progress). Figma: PDF-Mobile-DS › ◆ Circular Progress
 * (Size=sm/default/lg × Percent, Show label). Tokens: 5. Component › circular-progress/*
 *
 * - size="sm" 24 / stroke 2 (inline, e.g. in a Document Item) · "default" 40 / stroke 4 · "lg" 64 / stroke 6
 *   with a centred percent label (text-sm font-medium tabular-nums, `showLabel`).
 * - Indicator = primary, track = primary at 20% (same as the linear Progress track). Starts at 12 o'clock,
 *   clockwise, round caps. Value changes animate 300ms ease-out (reduced motion → jump).
 * - Indeterminate → use ◆ Spinner. Tint with className `text-*` (e.g. text-destructive for a failed upload).
 * - A11y: role progressbar + aria-valuenow 0–100; pass `accessibilityLabel` ("Uploading Contract.pdf").
 */
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { cssInterop } from 'nativewind';
import * as React from 'react';
import { Platform, View } from 'react-native';
import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedProps,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const SIZES = {
  sm: { px: 24, stroke: 2 },
  default: { px: 40, stroke: 4 },
  lg: { px: 64, stroke: 6 },
} as const;

type CircularProgressSize = keyof typeof SIZES;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type RingProps = {
  px: number;
  stroke: number;
  value: number;
  color?: string;
  style?: object;
};

function NativeIndicator({ px, stroke, value, color }: Omit<RingProps, 'style'>) {
  const r = (px - stroke) / 2;
  const c = 2 * Math.PI * r;
  const progress = useDerivedValue(() =>
    withTiming(value, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
      reduceMotion: ReduceMotion.System,
    })
  );
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: c * (1 - progress.value / 100),
    strokeOpacity: progress.value <= 0.5 ? 0 : 1,
  }));
  return (
    <AnimatedCircle
      cx={px / 2}
      cy={px / 2}
      r={r}
      fill="none"
      stroke={color}
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeDasharray={`${c} ${c}`}
      transform={`rotate(-90 ${px / 2} ${px / 2})`}
      animatedProps={animatedProps}
    />
  );
}

function RingImpl({ px, stroke, value, color = 'currentColor', style }: RingProps) {
  const r = (px - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <Svg width={px} height={px} viewBox={`0 0 ${px} ${px}`} style={style}>
      <Circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeOpacity={0.2}
        strokeWidth={stroke}
      />
      {Platform.OS === 'web' ? (
        value > 0 ? (
          <Circle
            cx={px / 2}
            cy={px / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${c} ${c}`}
            strokeDashoffset={c * (1 - value / 100)}
            transform={`rotate(-90 ${px / 2} ${px / 2})`}
            // web: CSS transition on the dash offset (style is passed through to the DOM <circle>)
            {...({ style: { transition: 'stroke-dashoffset 300ms ease-out' } } as object)}
          />
        ) : null
      ) : (
        <NativeIndicator px={px} stroke={stroke} value={value} color={color} />
      )}
    </Svg>
  );
}

// className `text-*` → `color` prop on native (like Icon); web uses CSS currentColor via style.
cssInterop(RingImpl, {
  className: { target: 'style', nativeStyleToProp: { color: 'color' } },
});

type CircularProgressProps = {
  /** 0–100 */
  value: number;
  size?: CircularProgressSize;
  /** size="lg" only — centred percent label. */
  showLabel?: boolean;
  /** Indicator colour, e.g. text-destructive. Default text-primary. */
  indicatorClassName?: string;
  accessibilityLabel?: string;
  className?: string;
};

function CircularProgress({
  value,
  size = 'default',
  showLabel = size === 'lg',
  indicatorClassName,
  accessibilityLabel,
  className,
}: CircularProgressProps) {
  const { px, stroke } = SIZES[size];
  const v = Math.max(0, Math.min(100, value ?? 0));
  const now = Math.round(v);
  return (
    <View
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={now}
      accessibilityValue={{ min: 0, max: 100, now }}
      accessibilityLabel={accessibilityLabel}
      className={cn('items-center justify-center', className)}
      style={{ width: px, height: px }}>
      <RingImpl
        px={px}
        stroke={stroke}
        value={v}
        // @ts-expect-error className is added by cssInterop
        className={cn('text-primary', indicatorClassName)}
      />
      {size === 'lg' && showLabel ? (
        <Text className="text-foreground absolute text-sm font-medium tabular-nums">{now}%</Text>
      ) : null}
    </View>
  );
}

export { CircularProgress };
export type { CircularProgressProps, CircularProgressSize };
