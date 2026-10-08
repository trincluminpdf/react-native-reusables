/**
 * ◆ Lumin in-app — App Bar (top bar). Figma: PDF-Mobile-DS › ◆ App Bar (Type=Home / Title / Search / Viewer / Editor).
 * Tokens: 5. Component › app-bar/* + glass/*.
 * Layout: h-16 px-4 gap-2, controls sit in ◆ Glass pills (p-1) so they float over content.
 * Deltas vs source (LPM-101 / LPM-1301): Search lives here only (not in the Toolbar); Undo/Redo show
 * Disabled when nothing to undo; titles use text-base (no 10–11px labels).
 * Compose: <AppBar> + <AppBarGroup> (glass pill) + <AppBarButton> (40px icon button) + <AppBarTitle>,
 * or use the ready-made <AppBarSearchField> / <AppBarWorkspace>.
 * ✏️ LPM source batch (Oct 2026):
 * - Type=Title: <AppBarCentered leading title trailing> keeps the title optically centred on the bar
 *   (equal Leading / Trailing slots = the wider side; title one line, truncates before the slots).
 * - Leading / Trailing action = Text: <AppBarTextButton> = Button Ghost sm in a glass pill, e.g.
 *   "Cancel" (leading, task flows: Prepare form, Sign) and "Select all" / "Done" / "Apply" (trailing).
 *   One text action per side, ≤ 12 characters.
 * - Type=Viewer: <AppBarFileTitle> shows the file name between Home and the actions on Tablet only
 *   (app-bar/viewer-show-title = `hidden sm:flex`; phones keep the bar chrome-light).
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { Glass } from '@/registry/nativewind/components/ui/glass';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { LuminLogo } from '@/registry/nativewind/components/ui/lumin-logo';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { CaretDownIcon, MagnifyingGlassIcon, XIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, TextInput, View, type ViewProps } from 'react-native';

function AppBar({ className, ...props }: ViewProps) {
  return (
    <View
      role="toolbar"
      className={cn('h-16 w-full flex-row items-center justify-between gap-2 px-4', className)}
      {...props}
    />
  );
}

/** Glass pill holding one or more 40px buttons. */
function AppBarGroup({ className, ...props }: ViewProps) {
  return <Glass className={cn('gap-0', className)} {...props} />;
}

type AppBarButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  'children' | 'size' | 'variant'
> & {
  icon: React.ComponentProps<typeof Icon>['as'];
  /** Required: icon-only buttons need a spoken label. */
  accessibilityLabel: string;
};

/** 40×40 ghost icon button (Button Variant=Ghost, Size=icon), hit area 44. */
function AppBarButton({ icon, className, ...props }: AppBarButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('rounded-full sm:size-10', className)}
      {...props}>
      <Icon as={icon} className="text-foreground size-5" />
    </Button>
  );
}

/** Centered title (Type=Title). Put it between two groups; it takes the free space. */
function AppBarTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      role="heading"
      numberOfLines={1}
      className={cn('text-foreground flex-1 text-center text-base font-semibold', className)}
      {...props}
    />
  );
}

/** Text action in a glass pill (Leading / Trailing action = Text): Button Ghost sm. */
function AppBarTextButton({
  label,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'children' | 'size' | 'variant'> & { label: string }) {
  return (
    <Glass>
      <Button variant="ghost" size="sm" className={cn('rounded-full', className)} {...props}>
        <Text>{label}</Text>
      </Button>
    </Glass>
  );
}

/**
 * Type=Title layout: equal side slots (width = the wider side's content) so the title is centred on the
 * bar whatever sits left / right; the title takes what is left and truncates with "…".
 */
function AppBarCentered({
  leading,
  title,
  trailing,
  className,
}: {
  leading?: React.ReactNode;
  title: string;
  trailing?: React.ReactNode;
  className?: string;
}) {
  const [sides, setSides] = React.useState({ leading: 0, trailing: 0 });
  const side = Math.max(sides.leading, sides.trailing);
  const measure =
    (key: 'leading' | 'trailing') => (e: { nativeEvent: { layout: { width: number } } }) => {
      const w = Math.ceil(e.nativeEvent.layout.width);
      setSides((s) => (s[key] === w ? s : { ...s, [key]: w }));
    };
  return (
    <AppBar className={className}>
      <View style={{ width: side }} className="flex-row justify-start">
        <View onLayout={measure('leading')} className="flex-row">
          {leading}
        </View>
      </View>
      <AppBarTitle className="min-w-0 flex-1">{title}</AppBarTitle>
      <View style={{ width: side }} className="flex-row justify-end">
        <View onLayout={measure('trailing')} className="flex-row">
          {trailing}
        </View>
      </View>
    </AppBar>
  );
}

/** Type=Viewer file title — Tablet only (`hidden sm:flex`), left-aligned, one line. */
function AppBarFileTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      numberOfLines={1}
      className={cn(
        'text-foreground hidden min-w-0 flex-1 px-2 text-left text-base font-semibold sm:flex',
        className
      )}
      {...props}
    />
  );
}

/** Type=Home leading: Lumin mark in a glass circle + workspace name + caret (opens the switcher). */
function AppBarWorkspace({
  name,
  onPress,
  className,
}: {
  name: string;
  onPress?: () => void;
  className?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Workspace: ${name}. Switch workspace`}
      className={cn('min-w-0 shrink flex-row items-center gap-2 active:opacity-70', className)}>
      <Glass>
        <View className="size-10 items-center justify-center">
          <LuminLogo type="mark" height={20} />
        </View>
      </Glass>
      <Text numberOfLines={1} className="text-foreground shrink text-base font-medium">
        {name}
      </Text>
      <Icon as={CaretDownIcon} className="text-foreground size-4 shrink-0" />
    </Pressable>
  );
}

/** Type=Search: glass search field (h-10 sm:h-9, px-3, gap-2) with clear button. */
function AppBarSearchField({
  value,
  onChangeText,
  placeholder = 'Search documents',
  autoFocus,
  className,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}) {
  return (
    <Glass className={cn('h-[50px] flex-1 p-1', className)}>
      <View className="h-10 flex-1 flex-row items-center gap-2 px-3 sm:h-9">
        <Icon as={MagnifyingGlassIcon} className="text-muted-foreground size-5 shrink-0" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          autoFocus={autoFocus}
          enterKeyHint="search"
          autoCorrect={false}
          className="text-foreground placeholder:text-muted-foreground web:outline-none min-w-0 flex-1 text-base"
          accessibilityLabel={placeholder}
        />
        {value ? (
          <Pressable
            onPress={() => onChangeText('')}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Clear search"
            className="shrink-0 active:opacity-60">
            <Icon as={XIcon} className="text-foreground size-5" />
          </Pressable>
        ) : null}
      </View>
    </Glass>
  );
}

export {
  AppBar,
  AppBarButton,
  AppBarCentered,
  AppBarFileTitle,
  AppBarGroup,
  AppBarSearchField,
  AppBarTextButton,
  AppBarTitle,
  AppBarWorkspace,
};
