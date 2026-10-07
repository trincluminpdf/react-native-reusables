/**
 * ◆ Lumin custom (Material 3 FAB family). Figma: PDF-Mobile-DS › ◆ FAB
 * (FAB: Type=Icon/Extended × Size=Default/Medium × Variant=Default/Secondary/Glass × State; FAB Menu / Item; FAB Menu).
 * Tokens: 5. Component › fab/*, fab-menu/*
 *
 * - FAB: size-14 (Size=Medium size-20), rounded-full (◆ circle like the Nav Bar Upload FAB — M3 uses
 *   rounded squares), icon size-6 (Medium size-7).
 * - Extended (pass `label`): h-14 pl-4 pr-5 gap-3, label text-base font-medium.
 * - Variant=Default bg-primary · Secondary bg-secondary · Glass = ◆ glass/* (same surface as the Nav Bar).
 *   Shadow lg; Glass keeps the glass shadow + blur. Pressed: primary/90 · secondary/80 · Glass opacity-70.
 * - FAB Menu (M3 Expressive): up to 6 Secondary pills (h-14) stacked above the FAB, right-aligned, gap-2;
 *   the FAB shows X while open. Item tap runs + collapses; Android Back / Escape collapse.
 * Placement is the caller's job: absolute bottom-right, 16 from the edges, above the safe area / Nav Bar.
 * iOS has no FAB in the HIG — use it for the one main create / upload action on cross-platform screens.
 */
import { Glass } from '@/registry/nativewind/components/ui/glass';
import { Icon, type IconComponent } from '@/registry/nativewind/components/ui/icon';
import { NativeOnlyAnimatedView } from '@/registry/nativewind/components/ui/native-only-animated-view';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { PlusIcon, XIcon } from 'phosphor-react-native';
import * as React from 'react';
import { BackHandler, Platform, Pressable, View, type PressableProps } from 'react-native';
import { FadeInDown, FadeOut, ReduceMotion } from 'react-native-reanimated';

type FabVariant = 'default' | 'secondary' | 'glass';
type FabSize = 'default' | 'medium';

const FAB_FG: Record<FabVariant, string> = {
  default: 'text-primary-foreground',
  secondary: 'text-secondary-foreground',
  glass: 'text-foreground',
};

const FAB_BG: Record<Exclude<FabVariant, 'glass'>, string> = {
  default: 'bg-primary active:bg-primary/90',
  secondary: 'bg-secondary active:bg-secondary/80',
};

type FabProps = Omit<PressableProps, 'children'> & {
  icon: IconComponent;
  /** Extended FAB label (Type=Extended). Omit for an icon-only FAB. */
  label?: string;
  variant?: FabVariant;
  /** Icon FAB only: default 56 · medium 80. */
  size?: FabSize;
  /** Required for icon-only FABs. Defaults to `label`. */
  accessibilityLabel?: string;
  className?: string;
};

function Fab({
  icon,
  label,
  variant = 'default',
  size = 'default',
  accessibilityLabel,
  className,
  ...props
}: FabProps) {
  const fg = FAB_FG[variant];
  const extended = !!label;
  const medium = size === 'medium' && !extended;
  const shape = extended
    ? 'h-14 flex-row items-center gap-3 rounded-full pl-4 pr-5'
    : cn('items-center justify-center rounded-full', medium ? 'size-20' : 'size-14');

  const content = (
    <>
      <Icon as={icon} size={medium ? 28 : 24} className={cn(fg, medium ? 'size-7' : 'size-6')} />
      {extended ? <Text className={cn('text-base font-medium', fg)}>{label}</Text> : null}
    </>
  );

  if (variant === 'glass') {
    return (
      <Glass className={cn('p-0', className)}>
        <Pressable
          role="button"
          accessibilityLabel={accessibilityLabel ?? label}
          className={cn(shape, 'active:opacity-70')}
          {...props}>
          {content}
        </Pressable>
      </Glass>
    );
  }

  return (
    <Pressable
      role="button"
      accessibilityLabel={accessibilityLabel ?? label}
      className={cn(shape, FAB_BG[variant], 'shadow-lg shadow-black/10', className)}
      style={Platform.select({ android: { elevation: 6 } })}
      {...props}>
      {content}
    </Pressable>
  );
}

type FabMenuItemProps = Omit<PressableProps, 'children'> & {
  label: string;
  icon: IconComponent;
  className?: string;
};

function FabMenuItem({ label, icon, className, ...props }: FabMenuItemProps) {
  return (
    <Pressable
      role="menuitem"
      accessibilityLabel={label}
      className={cn(
        'bg-secondary active:bg-secondary/80 h-14 flex-row items-center gap-3 self-end rounded-full pl-4 pr-5 shadow-lg shadow-black/10',
        className
      )}
      style={Platform.select({ android: { elevation: 6 } })}
      {...props}>
      <Icon as={icon} size={24} className="text-secondary-foreground size-6" />
      <Text className="text-secondary-foreground text-base font-medium">{label}</Text>
    </Pressable>
  );
}

type FabMenuProps = {
  items: readonly { label: string; icon: IconComponent; onPress?: () => void }[];
  /** Controlled open state (optional). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** FAB icon while closed (default Plus). */
  icon?: IconComponent;
  /** FAB label while closed, e.g. "Create". */
  accessibilityLabel?: string;
  className?: string;
};

function FabMenu({
  items,
  open: openProp,
  onOpenChange,
  icon = PlusIcon,
  accessibilityLabel = 'Open menu',
  className,
}: FabMenuProps) {
  const [openState, setOpenState] = React.useState(false);
  const open = openProp ?? openState;
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next);
      onOpenChange?.(next);
    },
    [openProp, onOpenChange]
  );

  // Android Back / web Escape collapse the menu.
  React.useEffect(() => {
    if (!open) return;
    if (Platform.OS === 'android') {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        setOpen(false);
        return true;
      });
      return () => sub.remove();
    }
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
  }, [open, setOpen]);

  return (
    <View className={cn('items-end gap-2', className)} pointerEvents="box-none">
      {open
        ? items.map((item, i) => (
            <NativeOnlyAnimatedView
              key={item.label}
              entering={FadeInDown.delay((items.length - 1 - i) * 30)
                .duration(160)
                .reduceMotion(ReduceMotion.System)}
              exiting={FadeOut.duration(100).reduceMotion(ReduceMotion.System)}>
              <View
                className={Platform.select({ web: 'animate-in fade-in-0 slide-in-from-bottom-2' })}>
                <FabMenuItem
                  label={item.label}
                  icon={item.icon}
                  onPress={() => {
                    item.onPress?.();
                    setOpen(false);
                  }}
                />
              </View>
            </NativeOnlyAnimatedView>
          ))
        : null}
      <Fab
        icon={open ? XIcon : icon}
        accessibilityLabel={open ? 'Close menu' : accessibilityLabel}
        aria-expanded={open}
        onPress={() => setOpen(!open)}
      />
    </View>
  );
}

export { Fab, FabMenu, FabMenuItem };
export type { FabMenuItemProps, FabMenuProps, FabProps, FabSize, FabVariant };
