/**
 * ◆ Lumin custom — not in RNR. Figma: PDF-Mobile-DS › ◆ Slider. Tokens: 5. Component › slider/*
 * Track h-1 bg-muted, range bg-primary, thumb size-3 bg-white border-ring. Range=Yes → two thumbs.
 * Thumb Hover → Pressed (ring while dragging). Thumb is 12px → hitSlop keeps a 44 hit area.
 * Pure responder implementation (no extra deps); @react-native-community/slider is an alternative.
 */
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { Platform, View, type GestureResponderEvent, type LayoutChangeEvent } from 'react-native';

type SliderProps = {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  accessibilityLabel?: string;
};

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}

function Slider({
  value: valueProp,
  defaultValue = [50],
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
  accessibilityLabel = 'Slider',
}: SliderProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const [width, setWidth] = React.useState(0);
  const [active, setActiveState] = React.useState<number | null>(null);
  const activeRef = React.useRef<number | null>(null);
  const setActive = (v: number | null) => {
    activeRef.current = v;
    setActiveState(v);
  };
  const ref = React.useRef<View>(null);
  const originX = React.useRef(0);
  const latest = React.useRef(value);
  latest.current = value;

  const toPct = (v: number) => ((v - min) / (max - min)) * 100;

  function setFromPageX(pageX: number, thumb: number) {
    if (!width) return;
    const ratio = clamp((pageX - originX.current) / width, 0, 1);
    let v = min + ratio * (max - min);
    v = Math.round(v / step) * step;
    const next = [...latest.current];
    next[thumb] = clamp(v, min, max);
    if (next.length === 2 && next[0]! > next[1]!) next.sort((a, b) => a - b);
    if (valueProp === undefined) setInner(next);
    onValueChange?.(next);
  }

  function onLayout(e: LayoutChangeEvent) {
    setWidth(e.nativeEvent.layout.width);
    ref.current?.measure((_x, _y, _w, _h, pageX) => {
      originX.current = pageX;
    });
  }

  function onGrant(e: GestureResponderEvent) {
    const pageX = e.nativeEvent.pageX;
    ref.current?.measure((_x, _y, w, _h, px) => {
      originX.current = px;
      if (w) setWidth(w);
    });
    const ratio = width ? clamp((pageX - originX.current) / width, 0, 1) : 0;
    const v = min + ratio * (max - min);
    const thumb =
      latest.current.length === 2
        ? Math.abs(v - latest.current[0]!) <= Math.abs(v - latest.current[1]!)
          ? 0
          : 1
        : 0;
    setActive(thumb);
    setFromPageX(pageX, thumb);
  }

  const range = value.length === 2;
  const start = range ? toPct(value[0]!) : 0;
  const end = toPct(range ? value[1]! : value[0]!);

  return (
    <View
      ref={ref}
      onLayout={onLayout}
      className={cn('h-3 w-full justify-center', disabled && 'opacity-50', className)}
      hitSlop={{ top: 16, bottom: 16 }}
      role="slider"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: value[0] }}
      onStartShouldSetResponder={() => !disabled}
      onMoveShouldSetResponder={() => !disabled}
      onResponderTerminationRequest={() => false}
      onResponderGrant={onGrant}
      onResponderMove={(e) =>
        activeRef.current !== null && setFromPageX(e.nativeEvent.pageX, activeRef.current)
      }
      onResponderRelease={() => {
        setActive(null);
        onValueCommit?.(latest.current);
      }}
      onResponderTerminate={() => setActive(null)}
      style={Platform.OS === 'web' ? ({ touchAction: 'none', cursor: disabled ? 'default' : 'pointer' } as object) : undefined}>
      <View className="bg-muted h-1 w-full overflow-hidden rounded-full">
        <View
          className="bg-primary absolute bottom-0 top-0 rounded-full"
          style={{ left: `${start}%`, width: `${end - start}%` }}
        />
      </View>
      {value.map((v, i) => (
        <View
          key={i}
          pointerEvents="none"
          className={cn(
            'border-ring absolute size-3 rounded-full border bg-white',
            active === i && cn('border-primary', Platform.select({ web: 'ring-ring/50 ring-4' }))
          )}
          style={[
            { left: `${toPct(v)}%`, marginLeft: -6 },
            active === i && Platform.OS !== 'web'
              ? { transform: [{ scale: 1.15 }] }
              : undefined,
          ]}
        />
      ))}
    </View>
  );
}

export { Slider };
export type { SliderProps };
