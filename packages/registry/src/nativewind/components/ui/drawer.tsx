/**
 * ◆ Lumin custom — not in RNR. Bottom drawer only (top/left/right removed — use Sheet for side panels).
 * Figma: PDF-Mobile-DS › ◆ Drawer. Tokens: 5. Component › drawer/*
 * Built on @rn-primitives/dialog (same primitive as Dialog) so it works on iOS, Android and web.
 * For a full native sheet with detents, Expo Router `presentation: "formSheet"` or @gorhom/bottom-sheet
 * can host the same Header / Footer pieces.
 */
import { NativeOnlyAnimatedView } from '@/registry/nativewind/components/ui/native-only-animated-view';
import { cn } from '@/registry/nativewind/lib/utils';
import * as DialogPrimitive from '@rn-primitives/dialog';
import * as React from 'react';
import { Platform, View, type GestureResponderEvent, type ViewProps } from 'react-native';
import { FadeIn, FadeOut, ReduceMotion, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerPortal = DialogPrimitive.Portal;
const DrawerClose = DialogPrimitive.Close;

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

function DrawerOverlay({
  className,
  children,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Overlay>, 'asChild'> & {
  children?: React.ReactNode;
}) {
  const { onOpenChange } = DialogPrimitive.useRootContext();

  function onOverlayPress(event: GestureResponderEvent) {
    onPress?.(event);
    if (event.target === event.currentTarget && !event.isDefaultPrevented()) {
      onOpenChange(false);
    }
  }

  return (
    <FullWindowOverlay>
      <DialogPrimitive.Overlay
        className={cn(
          // scrim/bg = bg-black/50
          'absolute bottom-0 left-0 right-0 top-0 flex justify-end bg-black/50',
          Platform.select({ web: 'animate-in fade-in-0 fixed cursor-default [&>*]:cursor-auto' }),
          className
        )}
        {...props}
        onPress={Platform.select({ web: onOverlayPress, native: onPress })}
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

function DrawerContent({
  className,
  portalHost,
  children,
  showHandle = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  portalHost?: string;
  /** Grab handle (drawer/rectangle: h-2 w-[100px] rounded-full bg-muted). */
  showHandle?: boolean;
}) {
  return (
    <DrawerPortal hostName={portalHost}>
      <DrawerOverlay>
        <NativeOnlyAnimatedView
          entering={SlideInDown.duration(250).reduceMotion(ReduceMotion.System)}
          exiting={SlideOutDown.duration(200).reduceMotion(ReduceMotion.System)}>
          <DialogPrimitive.Content
            className={cn(
              'bg-background border-border pb-safe flex max-h-[85%] w-full flex-col rounded-t-xl border border-b-0',
              Platform.select({
                web: 'animate-in slide-in-from-bottom fixed bottom-0 left-0 right-0 duration-300',
              }),
              className
            )}
            {...props}>
            {showHandle ? (
              <View className="items-center pt-4">
                <View className="bg-muted h-2 w-[100px] rounded-full" />
              </View>
            ) : null}
            <>{children}</>
          </DialogPrimitive.Content>
        </NativeOnlyAnimatedView>
      </DrawerOverlay>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: ViewProps) {
  return <View className={cn('flex flex-col items-center gap-0.5 p-4', className)} {...props} />;
}

function DrawerBody({ className, ...props }: ViewProps) {
  return <View className={cn('flex flex-col gap-3 px-4', className)} {...props} />;
}

function DrawerFooter({ className, ...props }: ViewProps) {
  return <View className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />;
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn('text-foreground text-center text-base font-semibold', className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn('text-muted-foreground text-center text-sm', className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
