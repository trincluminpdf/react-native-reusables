/**
 * ◆ Lumin custom (Apple HIG stepper / UIStepper). Figma: PDF-Mobile-DS › ◆ Stepper
 * (Type=Default/Compact × State=Default/Pressed/Min/Max/Disabled). Tokens: 5. Component › stepper/*
 *
 * − / + for small incremental values (copies, stroke width, font size).
 * - Container: h-10 (Tablet sm:h-9), rounded-md, border border-input, bg-background (dark bg-input/30).
 * - Buttons: w-10 (sm:w-9), icon size-4, pressed bg-accent (dark bg-input/50); hit area 44 (hitSlop 2).
 * - Dividers: w-px bg-input. Value (type="default", ◆ HIG steppers don't show it): min-w-12 px-2,
 *   text-sm font-medium tabular-nums. type="compact" = UIStepper look — show the value next to it.
 * - Min / Max disable − / + (opacity-50) · disabled = whole control opacity-50.
 * - Long-press repeats after 400ms, every 100ms.
 * - A11y (native): one adjustable element with value text + increment / decrement actions.
 *   Web: two labelled buttons ("Decrease" / "Increase") and a live value.
 */
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { MinusIcon, PlusIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';

type StepperProps = {
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  type?: 'default' | 'compact';
  disabled?: boolean;
  /** What the value is, e.g. "Copies". */
  accessibilityLabel?: string;
  formatValue?: (value: number) => string;
  className?: string;
};

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function Stepper({
  value,
  onValueChange,
  min = 0,
  max = 99,
  step = 1,
  type = 'default',
  disabled = false,
  accessibilityLabel,
  formatValue = String,
  className,
}: StepperProps) {
  const valueRef = React.useRef(value);
  valueRef.current = value;
  const timers = React.useRef<{
    delay?: ReturnType<typeof setTimeout>;
    repeat?: ReturnType<typeof setInterval>;
  }>({});

  const stop = React.useCallback(() => {
    clearTimeout(timers.current.delay);
    clearInterval(timers.current.repeat);
    timers.current = {};
  }, []);
  React.useEffect(() => stop, [stop]);

  const bump = React.useCallback(
    (dir: 1 | -1) => {
      const next = clamp(valueRef.current + dir * step, min, max);
      if (next !== valueRef.current) {
        valueRef.current = next;
        onValueChange(next);
      } else stop();
    },
    [min, max, step, onValueChange, stop]
  );

  const startRepeat = (dir: 1 | -1) => {
    stop();
    timers.current.delay = setTimeout(() => {
      timers.current.repeat = setInterval(() => bump(dir), 100);
    }, 400);
  };

  const atMin = value <= min;
  const atMax = value >= max;
  const text = formatValue(value);

  function Segment({ dir }: { dir: 1 | -1 }) {
    const off = disabled || (dir === -1 ? atMin : atMax);
    return (
      <Pressable
        role="button"
        accessibilityLabel={dir === -1 ? 'Decrease' : 'Increase'}
        disabled={off}
        hitSlop={2}
        onPress={() => bump(dir)}
        onPressIn={() => !off && startRepeat(dir)}
        onPressOut={stop}
        className={cn(
          'active:bg-accent dark:active:bg-input/50 w-10 items-center justify-center self-stretch sm:w-9',
          off && !disabled && 'opacity-50'
        )}>
        <Icon as={dir === -1 ? MinusIcon : PlusIcon} size={16} className="text-foreground size-4" />
      </Pressable>
    );
  }

  return (
    <View
      accessible={Platform.OS !== 'web'}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value, text }}
      accessibilityState={{ disabled }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => {
        if (disabled) return;
        if (e.nativeEvent.actionName === 'increment') bump(1);
        if (e.nativeEvent.actionName === 'decrement') bump(-1);
      }}
      className={cn(
        'border-input bg-background dark:bg-input/30 h-10 flex-row items-stretch self-start overflow-hidden rounded-md border sm:h-9',
        disabled && 'opacity-50',
        className
      )}>
      <Segment dir={-1} />
      <View className="bg-input w-px" />
      {type === 'default' ? (
        <>
          <View className="min-w-12 items-center justify-center px-2">
            <Text aria-live="polite" className="text-foreground text-sm font-medium tabular-nums">
              {text}
            </Text>
          </View>
          <View className="bg-input w-px" />
        </>
      ) : null}
      <Segment dir={1} />
    </View>
  );
}

export { Stepper };
export type { StepperProps };
