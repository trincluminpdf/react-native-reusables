/**
 * ◆ Lumin in-app — Nav Bar (bottom tab bar). Figma: PDF-Mobile-DS › ◆ Nav Bar (+ Nav Bar / Item, Active=Off/On).
 * Tokens: 5. Component › nav-bar/* + glass/*.
 * Layout: px-4 pb-2 gap-2 — glass tab pill (p-1, items flex-1) + glass FAB size-14 (Upload).
 * Item: h-12 gap-0.5 rounded-full, icon size-5, label text-xs font-medium. Items grow to share the pill width (grow, px-2) but keep their label width:
 * Figma px-3 cut "Documents" / "Templates" at 390pt.
 * Active = bg-input (dark bg-input/80) + text-foreground; inactive text-muted-foreground. No brand tint.
 * In Expo Router use it as a custom `tabBar` (Tabs tabBar={(p) => <NavBar …/>}).
 */
import { Glass } from '@/registry/nativewind/components/ui/glass';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';

function NavBar({ className, children, ...props }: ViewProps) {
  return (
    <View className={cn('w-full flex-row items-center gap-2 px-4 pb-2', className)} {...props}>
      {children}
    </View>
  );
}

function NavBarTabs({ className, ...props }: ViewProps) {
  return <Glass role="tablist" className={cn('flex-1', className)} {...props} />;
}

type NavBarItemProps = {
  label: string;
  icon: React.ComponentProps<typeof Icon>['as'];
  active?: boolean;
  onPress?: () => void;
  className?: string;
};

function NavBarItem({ label, icon, active = false, onPress, className }: NavBarItemProps) {
  return (
    <Pressable
      role="tab"
      aria-selected={active}
      accessibilityState={{ selected: active }}
      onPress={onPress}
      className={cn(
        'h-12 min-w-0 grow items-center justify-center gap-0.5 rounded-full px-2',
        active ? 'bg-input dark:bg-input/80' : 'active:bg-accent/60',
        className
      )}>
      <Icon
        as={icon}
        weight={active ? 'fill' : 'regular'}
        className={cn('size-5', active ? 'text-foreground' : 'text-muted-foreground')}
      />
      <Text
        numberOfLines={1}
        className={cn('text-xs font-medium', active ? 'text-foreground' : 'text-muted-foreground')}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Round glass action next to the tabs (size-14), e.g. Upload. */
function NavBarFab({
  icon,
  accessibilityLabel,
  onPress,
  className,
}: {
  icon: React.ComponentProps<typeof Icon>['as'];
  accessibilityLabel: string;
  onPress?: () => void;
  className?: string;
}) {
  return (
    <Glass className={cn('p-0', className)}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        className="size-14 items-center justify-center rounded-full active:opacity-70">
        <Icon as={icon} className="text-foreground size-5" />
      </Pressable>
    </Glass>
  );
}

export { NavBar, NavBarFab, NavBarItem, NavBarTabs };
