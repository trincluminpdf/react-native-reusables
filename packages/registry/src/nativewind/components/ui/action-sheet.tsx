/**
 * ◆ Lumin custom (Apple HIG action sheet / M3 modal bottom sheet). Figma: PDF-Mobile-DS › ◆ Action Sheet
 * (Action Sheet / Action: Variant=Default/Destructive × State; Action Sheet: Type=Confirm/Menu).
 * Tokens: 5. Component › action-sheet/* (+ drawer/*). Built on ◆ Drawer — no new container.
 *
 * - type="confirm" (HIG): title + short message, full-width Buttons in the body (gap-2), destructive FIRST
 *   (HIG: most visible), e.g. leaving the editor with unsaved changes.
 * - type="menu" (M3): optional header (file name + meta), ActionSheetAction rows (gap-0), destructive LAST.
 * - Both: Cancel = Outline button in the footer; scrim tap / swipe / Android Back also cancel.
 * - ActionSheetAction: h-12 rounded-lg px-3 gap-3, icon size-5, label text-base; destructive = text-destructive;
 *   pressed = bg-accent (dark bg-input/50); disabled = opacity-50. Pressing a row closes the sheet.
 * - Keep it short (≤ 6 actions, no scrolling). iOS 26 anchors the native confirmationDialog to its source
 *   button — we keep one bottom sheet on both platforms (◆).
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/registry/nativewind/components/ui/drawer';
import { Icon, type IconComponent } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as DialogPrimitive from '@rn-primitives/dialog';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type ActionSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: 'confirm' | 'menu';
  title?: string;
  description?: string;
  cancelLabel?: string;
  children: React.ReactNode;
};

function ActionSheet({
  open,
  onOpenChange,
  type = 'menu',
  title,
  description,
  cancelLabel = 'Cancel',
  children,
}: ActionSheetProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        {title || description ? (
          <DrawerHeader>
            {title ? <DrawerTitle numberOfLines={1}>{title}</DrawerTitle> : null}
            {description ? <DrawerDescription>{description}</DrawerDescription> : null}
          </DrawerHeader>
        ) : (
          <View className="h-4" />
        )}
        <View className={cn('px-4', type === 'confirm' ? 'gap-2 pt-4' : 'gap-0')}>{children}</View>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">
              <Text>{cancelLabel}</Text>
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

type ActionSheetActionProps = {
  label: string;
  icon?: IconComponent;
  destructive?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
};

/** Menu row (Type=Menu). Closes the sheet, then runs `onPress`. */
function ActionSheetAction({
  label,
  icon,
  destructive = false,
  disabled = false,
  onPress,
  className,
}: ActionSheetActionProps) {
  const { onOpenChange } = DialogPrimitive.useRootContext();
  const fg = destructive ? 'text-destructive' : 'text-foreground';
  return (
    <Pressable
      role="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => {
        onOpenChange(false);
        onPress?.();
      }}
      className={cn(
        'active:bg-accent dark:active:bg-input/50 h-12 flex-row items-center gap-3 rounded-lg px-3',
        disabled && 'opacity-50',
        className
      )}>
      {icon ? <Icon as={icon} size={20} className={cn('size-5', fg)} /> : null}
      <Text className={cn('flex-1 text-base', fg)} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

export { ActionSheet, ActionSheetAction };
export type { ActionSheetActionProps, ActionSheetProps };
