/**
 * ◆ Lumin custom (Material 3 navigation rail, collapsed). Figma: PDF-Mobile-DS › ◆ Navigation Rail
 * (Navigation Rail / Item: Active=Off/On; Navigation Rail: Active=Home/Documents/Tools/Templates, Show FAB).
 * Tokens: 5. Component › nav-rail/*
 *
 * - Rail: w-20, docked to the left edge, bg-background + border-r border-border, py-4 (above the safe area).
 *   Optional `fab` on top (FAB Secondary, no shadow — M3 lowers the FAB in a rail), then gap-6, items gap-3.
 * - Item: indicator h-8 w-14 rounded-full around a size-5 icon, label text-xs font-medium below, gap-1.
 *   Active = bg-input (dark bg-input/80) + filled icon + text-foreground; inactive text-muted-foreground.
 *   Same destinations / icons / active style as ◆ Nav Bar (no brand tint). Item ≥ 56×52 → 44 hit area OK.
 * - (recommendation) Tablet landscape / windows ≥ 840: rail · phones + Tablet portrait: bottom Nav Bar.
 * In Expo Router use it as a custom `tabBar` on wide windows (Tabs tabBar={(p) => <NavigationRail …/>}).
 * The expanded rail (labels beside icons) = Sidebar — dropped for v1.
 */
import { Icon, type IconComponent } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';

type NavigationRailProps = ViewProps & {
  /** Usually <Fab variant="secondary" className="shadow-none" … /> (Show FAB=true). */
  fab?: React.ReactNode;
};

function NavigationRail({ fab, className, children, ...props }: NavigationRailProps) {
  return (
    <View
      className={cn(
        'bg-background border-border h-full w-20 items-center gap-6 border-r py-4',
        className
      )}
      {...props}>
      {fab}
      <View role="tablist" aria-orientation="vertical" className="items-center gap-3">
        {children}
      </View>
    </View>
  );
}

type NavigationRailItemProps = {
  label: string;
  icon: IconComponent;
  active?: boolean;
  onPress?: () => void;
  className?: string;
};

function NavigationRailItem({
  label,
  icon,
  active = false,
  onPress,
  className,
}: NavigationRailItemProps) {
  return (
    <Pressable
      role="tab"
      aria-selected={active}
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      onPress={onPress}
      className={cn('min-w-14 items-center gap-1', className)}>
      {({ pressed }) => (
        <>
          <View
            className={cn(
              'h-8 w-14 items-center justify-center rounded-full',
              active ? 'bg-input dark:bg-input/80' : pressed ? 'bg-accent/60' : 'bg-transparent'
            )}>
            <Icon
              as={icon}
              size={20}
              weight={active ? 'fill' : 'regular'}
              className={cn('size-5', active ? 'text-foreground' : 'text-muted-foreground')}
            />
          </View>
          <Text
            numberOfLines={1}
            className={cn(
              'text-xs font-medium',
              active ? 'text-foreground' : 'text-muted-foreground'
            )}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export { NavigationRail, NavigationRailItem };
export type { NavigationRailItemProps, NavigationRailProps };
