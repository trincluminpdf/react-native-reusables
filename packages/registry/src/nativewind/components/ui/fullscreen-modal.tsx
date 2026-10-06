/**
 * ◆ Lumin NEW — not in RNR. Figma: PDF-Mobile-DS › ◆ Fullscreen Modal. Tokens: 5. Component › fullscreen-modal/*
 * Type=Task (bg-background) for multi-step tasks; Type=Immersive (bg-black, text-white) for viewers/camera
 * — Immersive also switches the system status bar to light icons while open.
 * Close (X) top-leading, Done/Save top-trailing (Apple HIG). Confirm before closing with unsaved changes.
 *
 * In an Expo Router app prefer a route with `presentation: "fullScreenModal"` and render
 * FullscreenModalHeader / Body / Footer inside it. This component is the in-place version
 * (built on @rn-primitives/dialog) used by the showcase and for simple cases.
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { NativeOnlyAnimatedView } from '@/registry/nativewind/components/ui/native-only-animated-view';
import { Text, TextClassContext } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as DialogPrimitive from '@rn-primitives/dialog';
import { XIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Platform, StatusBar, View, type ViewProps } from 'react-native';
import { ReduceMotion, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';

type FullscreenModalType = 'task' | 'immersive';
const TypeContext = React.createContext<FullscreenModalType>('task');

const FullscreenModal = DialogPrimitive.Root;
const FullscreenModalTrigger = DialogPrimitive.Trigger;

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

function FullscreenModalContent({
  className,
  type = 'task',
  portalHost,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  type?: FullscreenModalType;
  portalHost?: string;
}) {
  const immersive = type === 'immersive';
  return (
    <DialogPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <DialogPrimitive.Overlay
          closeOnPress={false}
          className={cn(
            'absolute bottom-0 left-0 right-0 top-0',
            Platform.select({ web: 'fixed' })
          )}
          asChild={Platform.OS !== 'web'}>
          <NativeOnlyAnimatedView
            entering={SlideInDown.duration(280).reduceMotion(ReduceMotion.System)}
            exiting={SlideOutDown.duration(220).reduceMotion(ReduceMotion.System)}>
            <TypeContext.Provider value={type}>
              <TextClassContext.Provider value={immersive ? 'text-white' : 'text-foreground'}>
                <DialogPrimitive.Content
                  className={cn(
                    'pt-safe pb-safe flex h-full w-full flex-col',
                    immersive ? 'bg-black' : 'bg-background',
                    Platform.select({
                      web: 'animate-in slide-in-from-bottom fixed inset-0 duration-300',
                    }),
                    className
                  )}
                  {...props}>
                  {/* System status bar sits over the modal (pt-safe): Immersive is always black, so force
                      light icons — the app-level <StatusBar> follows the theme and left them dark (invisible)
                      in light mode. Pushed on the RN StatusBar stack, popped on close. */}
                  {immersive && Platform.OS !== 'web' ? (
                    <StatusBar barStyle="light-content" animated />
                  ) : null}
                  <>{children}</>
                </DialogPrimitive.Content>
              </TextClassContext.Provider>
            </TypeContext.Provider>
          </NativeOnlyAnimatedView>
        </DialogPrimitive.Overlay>
      </FullWindowOverlay>
    </DialogPrimitive.Portal>
  );
}

/** h-14 px-2 row: [Close] [Title] [Action]. */
function FullscreenModalHeader({ className, ...props }: ViewProps) {
  return <View className={cn('h-14 flex-row items-center px-2', className)} {...props} />;
}

function FullscreenModalTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  const type = React.useContext(TypeContext);
  return (
    <DialogPrimitive.Title
      className={cn(
        'flex-1 text-center text-base font-semibold',
        type === 'immersive' ? 'text-white' : 'text-foreground',
        className
      )}
      numberOfLines={1}
      {...props}
    />
  );
}

/** Top-leading X. 44×44 hit area. */
function FullscreenModalClose({
  className,
  accessibilityLabel = 'Close',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'children'>) {
  const type = React.useContext(TypeContext);
  return (
    <DialogPrimitive.Close asChild>
      <Button
        variant="ghost"
        size="icon"
        className={cn('size-11', type === 'immersive' && 'active:bg-white/10', className)}
        accessibilityLabel={accessibilityLabel}
        {...props}>
        <Icon as={XIcon} size={16} className={type === 'immersive' ? 'text-white' : 'text-foreground'} />
      </Button>
    </DialogPrimitive.Close>
  );
}

/** Top-trailing text action (Done / Save). */
function FullscreenModalAction({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const type = React.useContext(TypeContext);
  return (
    <Button
      variant="ghost"
      className={cn('h-11 px-3', type === 'immersive' && 'active:bg-white/10', className)}
      {...props}>
      {typeof children === 'string' ? (
        <Text className={cn('text-sm font-medium', type === 'immersive' && 'text-white')}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Button>
  );
}

/** Spacer that keeps the title centred when there is no trailing action. */
function FullscreenModalSpacer() {
  return <View className="size-11" />;
}

function FullscreenModalBody({ className, ...props }: ViewProps) {
  return <View className={cn('flex-1', className)} {...props} />;
}

function FullscreenModalFooter({ className, ...props }: ViewProps) {
  return <View className={cn('flex-col gap-2 p-4', className)} {...props} />;
}

export {
  FullscreenModal,
  FullscreenModalAction,
  FullscreenModalBody,
  FullscreenModalClose,
  FullscreenModalContent,
  FullscreenModalFooter,
  FullscreenModalHeader,
  FullscreenModalSpacer,
  FullscreenModalTitle,
  FullscreenModalTrigger,
};
