/**
 * ◆ Lumin custom (Apple HIG page control; M3 carousel indicator). Figma: PDF-Mobile-DS › ◆ Page Control
 * (Page Control / Dot: Active=Off/On; Page Control: Style=Minimal/Prominent × Current, Show dot 4 / 5).
 * Tokens: 5. Component › page-control/* (+ glass/* for Prominent)
 *
 * - Dots size-2 (8) bg-muted-foreground, gap-2; current page = ◆ w-5 pill bg-foreground (shape cue, not
 *   colour only — iOS uses same-size dots). Width animates 200ms (reduced motion → instant).
 * - Container h-7 px-3 rounded-full. variant="minimal" (default, no background) · "prominent" = ◆ Glass pill
 *   for use over images / busy content (HIG background styles).
 * - Tap the leading / trailing side of the current dot = previous / next page (HIG). Hit area 44 tall.
 * - Max ~10 pages (HIG) — for more, show "n / total" instead. Centre it at the bottom of the paged view.
 * - Not the ◆ Page Indicator (the "3 / 12" chip in the PDF viewer).
 * - A11y: adjustable ("Page 2 of 5") with increment / decrement actions.
 */
import { Glass } from '@/registry/nativewind/components/ui/glass';
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { Pressable, View, type GestureResponderEvent } from 'react-native';
import Animated, { ReduceMotion, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const DOT = 8;
const ACTIVE = 20;
const GAP = 8;
const PAD_X = 12;

function Dot({ active }: { active: boolean }) {
  const style = useAnimatedStyle(
    () => ({
      width: withTiming(active ? ACTIVE : DOT, {
        duration: 200,
        reduceMotion: ReduceMotion.System,
      }),
    }),
    [active]
  );
  // Reanimated views don't take NativeWind classNames → animate the width, colour the inner View.
  return (
    <Animated.View style={[{ height: DOT, borderRadius: DOT / 2, overflow: 'hidden' }, style]}>
      <View className={cn('flex-1', active ? 'bg-foreground' : 'bg-muted-foreground')} />
    </Animated.View>
  );
}

type PageControlProps = {
  /** Number of pages (≤ 10). */
  count: number;
  /** Current page, 0-based. */
  page: number;
  onPageChange?: (page: number) => void;
  variant?: 'minimal' | 'prominent';
  /** e.g. "Onboarding" → "Onboarding, page 2 of 5". */
  accessibilityLabel?: string;
  className?: string;
};

function PageControl({
  count,
  page,
  onPageChange,
  variant = 'minimal',
  accessibilityLabel,
  className,
}: PageControlProps) {
  const go = (next: number) => {
    const clamped = Math.max(0, Math.min(count - 1, next));
    if (clamped !== page) onPageChange?.(clamped);
  };

  // centre x of the current dot inside the control (the active pill is wider)
  const currentCenter = PAD_X + page * (DOT + GAP) + ACTIVE / 2;

  function onPress(e: GestureResponderEvent) {
    const x = e.nativeEvent.locationX;
    go(x < currentCenter ? page - 1 : page + 1);
  }

  const dots = (
    <Pressable
      onPress={onPress}
      hitSlop={{ top: 8, bottom: 8 }}
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{
        text: `Page ${page + 1} of ${count}`,
        min: 1,
        max: count,
        now: page + 1,
      }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === 'increment') go(page + 1);
        if (e.nativeEvent.actionName === 'decrement') go(page - 1);
      }}
      className="h-7 flex-row items-center gap-2 px-3">
      {Array.from({ length: count }, (_, i) => (
        <Dot key={i} active={i === page} />
      ))}
    </Pressable>
  );

  if (variant === 'prominent') {
    return <Glass className={cn('self-center p-0', className)}>{dots}</Glass>;
  }
  return <View className={cn('self-center rounded-full', className)}>{dots}</View>;
}

export { PageControl };
export type { PageControlProps };
