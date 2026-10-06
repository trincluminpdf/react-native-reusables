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
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { ColorSwatch } from '@/registry/nativewind/components/ui/color-swatch';
import { Glass } from '@/registry/nativewind/components/ui/glass';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Separator } from '@/registry/nativewind/components/ui/separator';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { XIcon } from 'phosphor-react-native';
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
  styleColor,
  onStylePress,
}: {
  children: React.ReactNode;
  onClose: () => void;
  /** Color of the active tool; omit to hide the Style well (tools without a color). */
  styleColor?: string;
  onStylePress?: () => void;
}) {
  return (
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="items-center gap-0.5">
        {children}
      </ScrollView>
      {styleColor ? (
        <>
          <Separator orientation="vertical" className="h-6" />
          <Pressable
            onPress={onStylePress}
            accessibilityRole="button"
            accessibilityLabel="Style: color and opacity"
            className="h-12 w-11 items-center justify-center rounded-full active:opacity-70">
            <ColorSwatch color={styleColor} scale={0.75} />
          </Pressable>
        </>
      ) : null}
    </>
  );
}

export { ToolItem, Toolbar, ToolbarTools };
export type { ToolItemProps };
