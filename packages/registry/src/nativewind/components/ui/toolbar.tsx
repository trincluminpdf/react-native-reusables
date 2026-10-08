/**
 * ◆ Lumin in-app — Toolbar + Tool Item (viewer bottom bar). Figma: PDF-Mobile-DS › ◆ Toolbar
 * (Toolbar: Type=Groups / Tools; Tool Item: State=Default / Active / Disabled).
 * Tokens: 5. Component › toolbar/*, tool-item/* + glass/*.
 * - Groups: glass pill (p-1, gap-0.5) of equal-width Tool Items (Mark up · Draw · Sign · Text · More).
 * - Tools: glass pill = [Close X] | scrollable Tool Items | [Style color well 44×48].
 *   Tool Items are uniform (no per-item options). The Style well always shows the active tool's color
 *   and opens the Annotation Sheet; tapping the already-active tool opens it too (Apple Markup pattern).
 * Tool Item: h-12 min-w-16 px-2 gap-0.5 rounded-full, icon size-5, label text-xs font-medium;
 * Active = bg-input (dark bg-input/80); Disabled = opacity-50.
 * Deltas vs source: back chevron → Close (it clashed with the title-bar Back and read as a swipe hint);
 * tiny options dot → Style well; Search removed (it lives in the App Bar).
 * Icons follow the web Tool icon table (LPA-001 › node 2221-2) — see ◆ Icon Map in Figma.
 * ✏️ LPM source batch (Oct 2026):
 * - Type=Actions (<ToolbarAction> × 3–5, equal width): bottom action bar for select / edit modes
 *   (documents, Outline edit, Page tool). Icon size-6 + one-word label text-xs medium, h-12, ≥ 44 wide.
 *   Most frequent first, destructive last (tone="destructive" = text-destructive, enabled Delete only);
 *   0 selected → every action disabled (opacity-50, neutral). > 5 actions → last slot = More → Action Sheet.
 * - Type=Player (<ToolbarPlayer>): read aloud — Options (caret up) · Previous · Play/Pause · Next · Speed "1.0x".
 * - Type=Search / Search empty (<ToolbarSearch>): "1 of 20" (pl-3) · Previous · Next · Results; no results →
 *   "No results" muted and all three disabled. The count is a polite live region.
 * - Type=Tools `showClose={false}` hides Close + its separator (Prepare form: exit via App Bar Cancel / Apply).
 * - Object selected (image, shape, signature): no Tool Item is active; `styleColor={null}` shows the
 *   Color Swatch Type=None (object without a color), a hex shows the object's color.
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { ColorSwatch } from '@/registry/nativewind/components/ui/color-swatch';
import { Glass } from '@/registry/nativewind/components/ui/glass';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Separator } from '@/registry/nativewind/components/ui/separator';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import {
  CaretDownIcon,
  CaretUpIcon,
  ListIcon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
  XIcon,
} from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, ScrollView, View, type ViewProps } from 'react-native';

type ToolItemProps = {
  label: string;
  icon: React.ComponentProps<typeof Icon>['as'];
  active?: boolean;
  disabled?: boolean;
  /** Stretch to share the row equally (Type=Groups). */
  fill?: boolean;
  onPress?: () => void;
  className?: string;
};

function ToolItem({
  label,
  icon,
  active = false,
  disabled = false,
  fill,
  onPress,
  className,
}: ToolItemProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active, disabled }}
      accessibilityHint={active ? 'Double-tap to change style' : undefined}
      className={cn(
        'h-12 min-w-16 items-center justify-center gap-0.5 rounded-full px-2',
        fill && 'flex-1',
        active ? 'bg-input dark:bg-input/80' : 'active:bg-accent/60',
        disabled && 'opacity-50',
        className
      )}>
      <Icon as={icon} className="text-foreground size-5" />
      <Text numberOfLines={1} className="text-foreground text-xs font-medium">
        {label}
      </Text>
    </Pressable>
  );
}

function Toolbar({ className, children, ...props }: ViewProps) {
  return (
    <View className={cn('w-full flex-row items-center px-4 pb-2', className)} {...props}>
      <Glass className="flex-1 gap-0.5">{children}</Glass>
    </View>
  );
}

/** Type=Tools content: Close · scrolling tools · Style well. */
function ToolbarTools({
  children,
  onClose,
  showClose = true,
  styleColor,
  onStylePress,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  /** Show close (default on). Off for Prepare form — exit via App Bar Cancel / Apply. */
  showClose?: boolean;
  /**
   * Color of the active tool (or of the selected object); `null` = Color Swatch Type=None (object
   * without a color, e.g. an image); omit to hide the Style well (tools without a color, Eraser).
   */
  styleColor?: string | null;
  onStylePress?: () => void;
}) {
  return (
    <>
      {showClose ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            onPress={onClose}
            accessibilityLabel="Close tools"
            className="rounded-full sm:size-10">
            <Icon as={XIcon} className="text-foreground size-5" />
          </Button>
          <Separator orientation="vertical" className="h-6" />
        </>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="items-center gap-0.5">
        {children}
      </ScrollView>
      {styleColor !== undefined ? (
        <>
          <Separator orientation="vertical" className="h-6" />
          <Pressable
            onPress={onStylePress}
            accessibilityRole="button"
            accessibilityLabel={
              styleColor === null ? 'Style: no color' : 'Style: color and opacity'
            }
            className="h-12 w-11 items-center justify-center rounded-full active:opacity-70">
            {styleColor === null ? (
              <ColorSwatch type="none" scale={0.75} />
            ) : (
              <ColorSwatch color={styleColor} scale={0.75} />
            )}
          </Pressable>
        </>
      ) : null}
    </>
  );
}

type ToolbarActionProps = {
  label: string;
  icon: React.ComponentProps<typeof Icon>['as'];
  /** Destructive = enabled Delete only (red); disabled destructive falls back to neutral. */
  tone?: 'default' | 'destructive';
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
};

/** Type=Actions slot (private `_Toolbar / Action`): icon 24 + label, equal width. */
function ToolbarAction({
  label,
  icon,
  tone = 'default',
  disabled = false,
  onPress,
  className,
}: ToolbarActionProps) {
  const red = tone === 'destructive' && !disabled;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      aria-disabled={disabled}
      className={cn(
        'h-12 min-w-11 flex-1 items-center justify-center gap-0.5 rounded-full px-1',
        !disabled && 'active:bg-accent',
        disabled && 'opacity-50',
        className
      )}>
      <Icon as={icon} className={cn('size-6', red ? 'text-destructive' : 'text-foreground')} />
      <Text
        numberOfLines={1}
        className={cn('text-xs font-medium', red ? 'text-destructive' : 'text-foreground')}>
        {label}
      </Text>
    </Pressable>
  );
}

function ToolbarIconButton({
  icon,
  label,
  disabled,
  onPress,
  fill,
}: {
  icon: React.ComponentProps<typeof Icon>['as'];
  label: string;
  disabled?: boolean;
  onPress?: () => void;
  fill?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={label}
      className={cn('rounded-full sm:size-10', disabled && 'opacity-50')}>
      <Icon as={icon} weight={fill ? 'fill' : 'regular'} className="text-foreground size-5" />
    </Button>
  );
}

/** Type=Player — read aloud controls. */
function ToolbarPlayer({
  playing,
  onPlayPause,
  onPrevious,
  onNext,
  speed = '1.0x',
  onSpeedPress,
  onOptionsPress,
}: {
  playing: boolean;
  onPlayPause?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  speed?: string;
  onSpeedPress?: () => void;
  onOptionsPress?: () => void;
}) {
  return (
    <>
      <ToolbarIconButton icon={CaretUpIcon} label="Read aloud options" onPress={onOptionsPress} />
      <View className="flex-1 flex-row items-center justify-center gap-1">
        <ToolbarIconButton icon={SkipBackIcon} label="Previous sentence" onPress={onPrevious} />
        <ToolbarIconButton
          icon={playing ? PauseIcon : PlayIcon}
          label={playing ? 'Pause' : 'Play'}
          onPress={onPlayPause}
          fill
        />
        <ToolbarIconButton icon={SkipForwardIcon} label="Next sentence" onPress={onNext} />
      </View>
      <Button
        variant="ghost"
        size="sm"
        onPress={onSpeedPress}
        accessibilityLabel={`Speed ${speed}`}
        className="rounded-full">
        <Text>{speed}</Text>
      </Button>
    </>
  );
}

/** Type=Search / Search empty — in-document search navigation. `count={null}` = no results. */
function ToolbarSearch({
  count,
  onPrevious,
  onNext,
  onResults,
}: {
  count: string | null;
  onPrevious?: () => void;
  onNext?: () => void;
  onResults?: () => void;
}) {
  const empty = count === null;
  return (
    <>
      <Text
        aria-live="polite"
        accessibilityLiveRegion="polite"
        numberOfLines={1}
        className={cn('flex-1 pl-3 text-sm', empty ? 'text-muted-foreground' : 'text-foreground')}>
        {empty ? 'No results' : count}
      </Text>
      <ToolbarIconButton
        icon={CaretUpIcon}
        label="Previous match"
        disabled={empty}
        onPress={onPrevious}
      />
      <ToolbarIconButton
        icon={CaretDownIcon}
        label="Next match"
        disabled={empty}
        onPress={onNext}
      />
      <ToolbarIconButton icon={ListIcon} label="All results" disabled={empty} onPress={onResults} />
    </>
  );
}

export { ToolItem, Toolbar, ToolbarAction, ToolbarPlayer, ToolbarSearch, ToolbarTools };
export type { ToolbarActionProps, ToolItemProps };
