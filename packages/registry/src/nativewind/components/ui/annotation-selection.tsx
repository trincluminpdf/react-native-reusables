/**
 * ◆ Lumin in-app (LPM batch) — Annotation Selection. Figma: PDF-Mobile-DS › 🆕 Annotation Selection
 * (Show rotate, Rotate handle=Top / Right / Bottom / Left).
 * Tokens: 5. Component › annotation-selection/* — bounds border border-pdf (1px) ·
 * 8 resize handles size-2.5 (10) rounded-full bg-background border border-pdf, centered on the corners and
 * edge midpoints, 44 hit area each · rotate handle size-6 (24) rounded-full bg-background border border-pdf +
 * ph-arrow-clockwise size-4 text-pdf, 8px (gap-2) outside the chosen side, hit area 44.
 * Selection frame around a selected annotation (image, shape, stamp, signature, free text) in the viewer.
 * Draw it absolutely inside the page at `rect` (page/parent coordinates). Pointer events only on the
 * frame and handles (box-none), so the page under it stays tappable.
 * Interactive when `onChange` is given: drag the body = move, drag a handle = resize (min 24×24), PanResponder
 * (web + native; web gets touch-action none + resize cursors). Quick Menu floats above/below — the caller places it.
 * Deltas: the hit areas live inside an outset wrapper (44px around the rect) so the halves outside the
 * annotation still receive touches on Android. Optional extras (not in Figma): `bounds` clamps move/resize to
 * the page, `onRotatePress` makes the rotate handle a button.
 */
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { cn } from '@/registry/nativewind/lib/utils';
import { ArrowClockwiseIcon } from 'phosphor-react-native';
import * as React from 'react';
import { PanResponder, Platform, Pressable, View, type PanResponderInstance } from 'react-native';

type SelectionRect = { x: number; y: number; width: number; height: number };
type RotateHandleSide = 'top' | 'right' | 'bottom' | 'left';

type AnnotationSelectionProps = {
  /** Annotation bounds in the parent's coordinate space. */
  rect: SelectionRect;
  /** Side of the rotate handle. Default 'top'. */
  rotateHandle?: RotateHandleSide;
  /** Off for annotations that can't rotate. Default true. */
  showRotate?: boolean;
  /** When given: drag the body to move, drag a handle to resize (min 24). Called on every move. */
  onChange?: (rect: SelectionRect) => void;
  /** Gesture finished (release / cancel) with the last rect. */
  onChangeEnd?: (rect: SelectionRect) => void;
  /** ◆ Optional: rotate handle tap (e.g. rotate 90°). Without it the handle is visual only. */
  onRotatePress?: () => void;
  /** ◆ Optional: keep the rect inside 0…width × 0…height (the page). */
  bounds?: { width: number; height: number };
  /** The annotation content (fills the rect, drawn under the frame). */
  children?: React.ReactNode;
  className?: string;
};

const MIN_SIZE = 24;
const HIT = 44;
/** Outset around the rect that holds every hit area (rotate reaches 8 + 24 + 10 outside). */
const PAD = 44;
const ROTATE_SIZE = 24;
const ROTATE_GAP = 8;

type ResizeKind = 'tl' | 't' | 'tr' | 'r' | 'br' | 'b' | 'bl' | 'l';
type DragKind = 'move' | ResizeKind;

/** Edges first, corners last so a corner wins where hit areas overlap on small selections. */
const HANDLES: { kind: ResizeKind; label: string; fx: number; fy: number; cursor: string }[] = [
  { kind: 't', label: 'Resize top', fx: 0.5, fy: 0, cursor: 'ns-resize' },
  { kind: 'r', label: 'Resize right', fx: 1, fy: 0.5, cursor: 'ew-resize' },
  { kind: 'b', label: 'Resize bottom', fx: 0.5, fy: 1, cursor: 'ns-resize' },
  { kind: 'l', label: 'Resize left', fx: 0, fy: 0.5, cursor: 'ew-resize' },
  { kind: 'tl', label: 'Resize top-left', fx: 0, fy: 0, cursor: 'nwse-resize' },
  { kind: 'tr', label: 'Resize top-right', fx: 1, fy: 0, cursor: 'nesw-resize' },
  { kind: 'br', label: 'Resize bottom-right', fx: 1, fy: 1, cursor: 'nwse-resize' },
  { kind: 'bl', label: 'Resize bottom-left', fx: 0, fy: 1, cursor: 'nesw-resize' },
];

const DRAG_KINDS: DragKind[] = ['move', 't', 'r', 'b', 'l', 'tl', 'tr', 'br', 'bl'];

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function nextRect(
  s: SelectionRect,
  kind: DragKind,
  dx: number,
  dy: number,
  bounds?: { width: number; height: number }
): SelectionRect {
  if (kind === 'move') {
    let x = s.x + dx;
    let y = s.y + dy;
    if (bounds) {
      x = clamp(x, 0, Math.max(0, bounds.width - s.width));
      y = clamp(y, 0, Math.max(0, bounds.height - s.height));
    }
    return { ...s, x, y };
  }
  const left = kind === 'l' || kind === 'tl' || kind === 'bl';
  const right = kind === 'r' || kind === 'tr' || kind === 'br';
  const top = kind === 't' || kind === 'tl' || kind === 'tr';
  const bottom = kind === 'b' || kind === 'bl' || kind === 'br';
  let l = s.x;
  let t = s.y;
  let r = s.x + s.width;
  let b = s.y + s.height;
  if (left) l = Math.min(l + dx, r - MIN_SIZE);
  if (right) r = Math.max(r + dx, l + MIN_SIZE);
  if (top) t = Math.min(t + dy, b - MIN_SIZE);
  if (bottom) b = Math.max(b + dy, t + MIN_SIZE);
  if (bounds) {
    if (left) l = Math.max(0, l);
    if (right) r = Math.min(bounds.width, r);
    if (top) t = Math.max(0, t);
    if (bottom) b = Math.min(bounds.height, b);
  }
  return { x: l, y: t, width: r - l, height: b - t };
}

function webDragStyle(cursor: string) {
  return Platform.OS === 'web'
    ? ({ cursor, touchAction: 'none', userSelect: 'none' } as object)
    : undefined;
}

const FACING: Record<RotateHandleSide, RotateHandleSide> = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
};

function rotateCenter(side: RotateHandleSide, w: number, h: number) {
  const off = ROTATE_GAP + ROTATE_SIZE / 2;
  switch (side) {
    case 'right':
      return { cx: w + off, cy: h / 2 };
    case 'bottom':
      return { cx: w / 2, cy: h + off };
    case 'left':
      return { cx: -off, cy: h / 2 };
    default:
      return { cx: w / 2, cy: -off };
  }
}

function AnnotationSelection({
  rect,
  rotateHandle = 'top',
  showRotate = true,
  onChange,
  onChangeEnd,
  onRotatePress,
  bounds,
  children,
  className,
}: AnnotationSelectionProps) {
  const interactive = !!onChange;

  // Latest props for the (stable) responders.
  const rectRef = React.useRef(rect);
  rectRef.current = rect;
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;
  const onChangeEndRef = React.useRef(onChangeEnd);
  onChangeEndRef.current = onChangeEnd;
  const boundsRef = React.useRef(bounds);
  boundsRef.current = bounds;

  const responders = React.useMemo(() => {
    const make = (kind: DragKind): PanResponderInstance => {
      let start: SelectionRect = rectRef.current;
      let last: SelectionRect | null = null;
      const end = () => {
        if (last) onChangeEndRef.current?.(last);
        last = null;
      };
      return PanResponder.create({
        onStartShouldSetPanResponder: () => !!onChangeRef.current,
        onMoveShouldSetPanResponder: () => !!onChangeRef.current,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: () => {
          start = rectRef.current;
          last = null;
        },
        onPanResponderMove: (_e, g) => {
          const next = nextRect(start, kind, g.dx, g.dy, boundsRef.current);
          last = next;
          onChangeRef.current?.(next);
        },
        onPanResponderRelease: end,
        onPanResponderTerminate: end,
      });
    };
    return Object.fromEntries(DRAG_KINDS.map((k) => [k, make(k)])) as Record<
      DragKind,
      PanResponderInstance
    >;
  }, []);

  const { width: w, height: h } = rect;
  const rotate = rotateCenter(rotateHandle, w, h);

  return (
    <View
      pointerEvents="box-none"
      className={cn('absolute', className)}
      style={{
        left: rect.x - PAD,
        top: rect.y - PAD,
        width: w + PAD * 2,
        height: h + PAD * 2,
      }}>
      {/* Annotation content + bounds */}
      <View
        pointerEvents="box-none"
        className="absolute"
        style={{ left: PAD, top: PAD, width: w, height: h }}>
        <View pointerEvents={interactive ? 'none' : 'box-none'} className="absolute inset-0">
          {children}
        </View>
        <View pointerEvents="none" className="border-pdf absolute inset-0 border" />
        {interactive ? (
          <View
            {...responders.move.panHandlers}
            accessible
            accessibilityLabel="Selected annotation"
            accessibilityHint="Drag to move"
            className="absolute inset-0"
            style={webDragStyle('move')}
          />
        ) : null}
      </View>

      {HANDLES.map((hd) => (
        <View
          key={hd.kind}
          {...(interactive ? responders[hd.kind].panHandlers : null)}
          pointerEvents={interactive ? 'auto' : 'none'}
          accessible={interactive}
          accessibilityLabel={hd.label}
          className="absolute items-center justify-center"
          style={[
            {
              left: PAD + hd.fx * w - HIT / 2,
              top: PAD + hd.fy * h - HIT / 2,
              width: HIT,
              height: HIT,
            },
            webDragStyle(hd.cursor),
          ]}>
          <View className="bg-background border-pdf size-2.5 rounded-full border" />
        </View>
      ))}

      {showRotate ? (
        <Pressable
          onPress={onRotatePress}
          pointerEvents={onRotatePress ? 'auto' : 'none'}
          accessibilityRole="button"
          accessibilityLabel="Rotate"
          // 24 + 10 each side = 44; the side facing the frame stops 4px short of the edge.
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10, [FACING[rotateHandle]]: 4 }}
          className="bg-background border-pdf absolute size-6 items-center justify-center rounded-full border active:opacity-70"
          style={{
            left: PAD + rotate.cx - ROTATE_SIZE / 2,
            top: PAD + rotate.cy - ROTATE_SIZE / 2,
          }}>
          <Icon as={ArrowClockwiseIcon} className="text-pdf size-4" />
        </Pressable>
      ) : null}
    </View>
  );
}

export { AnnotationSelection };
export type { AnnotationSelectionProps, RotateHandleSide, SelectionRect };
