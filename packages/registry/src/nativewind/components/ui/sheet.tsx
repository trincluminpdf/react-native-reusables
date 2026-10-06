/**
 * ◆ Lumin custom — not in RNR. Side panel, Position=left / right only (bottom → Drawer, top removed).
 * Figma: PDF-Mobile-DS › ◆ Sheet. Tokens: 5. Component › sheet/*
 * Mostly for Tablet. Built on @rn-primitives/dialog.
 */
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { NativeOnlyAnimatedView } from '@/registry/nativewind/components/ui/native-only-animated-view';
import { cn } from '@/registry/nativewind/lib/utils';
import * as DialogPrimitive from '@rn-primitives/dialog';
import { XIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Platform, Text, View, type GestureResponderEvent, type ViewProps } from 'react-native';
import {
  FadeIn,
  FadeOut,
  ReduceMotion,
  SlideInLeft,
  SlideInRight,
  SlideOutLeft,
  SlideOutRight,
} from 'react-native-reanimated';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetPortal = DialogPrimitive.Portal;
const SheetClose = DialogPrimitive.Close;

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

type Side = 'left' | 'right';

function SheetOverlay({
  className,
  children,
  side,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Overlay>, 'asChild'> & {
  children?: React.ReactNode;
  side: Side;
}) {
  const { onOpenChange } = DialogPrimitive.useRootContext();
  function onOverlayPress(event: GestureResponderEvent) {
    if (event.target === event.currentTarget && !event.isDefaultPrevented()) onOpenChange(false);
  }
  return (
    <FullWindowOverlay>
      <DialogPrimitive.Overlay
        className={cn(
          'absolute bottom-0 left-0 right-0 top-0 flex flex-row bg-black/50',
          side === 'left' ? 'justify-start' : 'justify-end',
          Platform.select({ web: 'animate-in fade-in-0 fixed cursor-default [&>*]:cursor-auto' }),
          className
        )}
        {...props}
        onPress={Platform.select({ web: onOverlayPress })}
        asChild={Platform.OS !== 'web'}>
        <NativeOnlyAnimatedView
          entering={FadeIn.duration(200).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          as="Pressable">
          <>{children}</>
        </NativeOnlyAnimatedView>
      </DialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

function SheetContent({
  className,
  portalHost,
  side = 'right',
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  portalHost?: string;
  side?: Side;
}) {
  return (
    <SheetPortal hostName={portalHost}>
      <SheetOverlay side={side}>
        <NativeOnlyAnimatedView
          className="h-full w-3/4 max-w-sm"
          entering={(side === 'left' ? SlideInLeft : SlideInRight)
            .duration(250)
            .reduceMotion(ReduceMotion.System)}
          exiting={(side === 'left' ? SlideOutLeft : SlideOutRight)
            .duration(200)
            .reduceMotion(ReduceMotion.System)}>
          <DialogPrimitive.Content
            className={cn(
              'bg-background border-border pt-safe pb-safe flex h-full w-full flex-col gap-4 shadow-lg shadow-black/10',
              side === 'left' ? 'border-r' : 'border-l',
              Platform.select({
                web: cn(
                  'animate-in fixed bottom-0 top-0 w-3/4 max-w-sm duration-300',
                  side === 'left' ? 'slide-in-from-left left-0' : 'slide-in-from-right right-0'
                ),
              }),
              className
            )}
            {...props}>
            <>{children}</>
            <DialogPrimitive.Close
              className="pt-safe absolute right-4 top-4 rounded-sm opacity-70 active:opacity-100"
              hitSlop={14}>
              <Icon as={XIcon} className="text-foreground size-4 shrink-0" />
              <Text className="sr-only">Close</Text>
            </DialogPrimitive.Close>
          </DialogPrimitive.Content>
        </NativeOnlyAnimatedView>
      </SheetOverlay>
    </SheetPortal>
  );
}

function SheetHeader({ className, ...props }: ViewProps) {
  return <View className={cn('flex flex-col gap-0.5 p-4 pr-10', className)} {...props} />;
}

function SheetBody({ className, ...props }: ViewProps) {
  return <View className={cn('flex flex-1 flex-col gap-6 px-4', className)} {...props} />;
}

function SheetFooter({ className, ...props }: ViewProps) {
  return <View className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-foreground text-base font-semibold', className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
