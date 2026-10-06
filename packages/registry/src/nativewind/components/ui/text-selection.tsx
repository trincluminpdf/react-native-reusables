/**
 * ◆ Lumin in-app — Text Selection overlay (handles on PDF text). Figma: PDF-Mobile-DS › ◆ Text Selection.
 * Tokens: 5. Component › text-selection/* — handle bg-blue-500 (dark blue-600), knob size-3, stem w-0.5;
 * selection fill = handle color at 20%.
 * Draw it absolutely over the page at the selection rect(s). Knobs get a 44px hit area (hitSlop) for dragging;
 * start knob sits above the first line, end knob below the last line (platform convention).
 */
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type Rect = { x: number; y: number; width: number; height: number };

type TextSelectionProps = {
  /** One rect per selected line, in the page's coordinate space. */
  rects: Rect[];
  onStartHandlePressIn?: () => void;
  onEndHandlePressIn?: () => void;
  className?: string;
};

function Handle({ rect, end, onPressIn }: { rect: Rect; end?: boolean; onPressIn?: () => void }) {
  const x = end ? rect.x + rect.width - 1 : rect.x - 1;
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: x - 5,
        top: end ? rect.y : rect.y - 12,
        width: 12,
        height: rect.height + 12,
      }}>
      {!end ? (
        <Pressable
          onPressIn={onPressIn}
          hitSlop={16}
          accessibilityLabel="Selection start"
          className="size-3 rounded-full bg-blue-500 dark:bg-blue-600"
        />
      ) : null}
      <View
        style={{ height: rect.height }}
        className="ml-[5px] w-0.5 bg-blue-500 dark:bg-blue-600"
      />
      {end ? (
        <Pressable
          onPressIn={onPressIn}
          hitSlop={16}
          accessibilityLabel="Selection end"
          className="size-3 rounded-full bg-blue-500 dark:bg-blue-600"
        />
      ) : null}
    </View>
  );
}

function TextSelection({
  rects,
  onStartHandlePressIn,
  onEndHandlePressIn,
  className,
}: TextSelectionProps) {
  if (!rects.length) return null;
  const first = rects[0]!;
  const last = rects[rects.length - 1]!;
  return (
    <View pointerEvents="box-none" className={cn('absolute inset-0', className)}>
      {rects.map((r, i) => (
        <View
          key={i}
          pointerEvents="none"
          style={{ position: 'absolute', left: r.x, top: r.y, width: r.width, height: r.height }}
          className="bg-blue-500/20 dark:bg-blue-600/30"
        />
      ))}
      <Handle rect={first} onPressIn={onStartHandlePressIn} />
      <Handle rect={last} end onPressIn={onEndHandlePressIn} />
    </View>
  );
}

export { TextSelection };
export type { TextSelectionProps };
