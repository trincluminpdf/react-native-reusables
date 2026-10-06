/**
 * RNR Alert Dialog + ◆ Lumin deltas (Figma: PDF-Mobile-DS › Alert Dialog, tokens alert-dialog/*):
 * 1. size="sm" — Lumin-only (max-w-xs, header gap-3.5).
 * 2. AlertDialogMedia (icon on top) — Lumin-only.
 * 3. Spacing/radius follow RNR: p-6 gap-4 rounded-lg; footer flex-col-reverse gap-2 (sm:flex-row).
 * 4. Destructive: AlertDialogAction variant="destructive" (Lumin soft destructive Button).
 */
import { buttonTextVariants, buttonVariants } from '@/registry/nativewind/components/ui/button';
import { NativeOnlyAnimatedView } from '@/registry/nativewind/components/ui/native-only-animated-view';
import { TextClassContext } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as AlertDialogPrimitive from '@rn-primitives/alert-dialog';
import * as React from 'react';
import { Platform, View, type ViewProps } from 'react-native';
import { FadeIn, FadeOut, ReduceMotion } from 'react-native-reanimated';
import { FullWindowOverlay as RNFullWindowOverlay } from 'react-native-screens';

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const FullWindowOverlay = Platform.OS === 'ios' ? RNFullWindowOverlay : React.Fragment;

type AlertDialogSize = 'default' | 'sm';
const AlertDialogSizeContext = React.createContext<AlertDialogSize>('default');

function AlertDialogOverlay({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof AlertDialogPrimitive.Overlay>, 'asChild'> & {
    children?: React.ReactNode;
  }) {
  return (
    <FullWindowOverlay>
      <AlertDialogPrimitive.Overlay
        className={cn(
          'absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50 p-2',
          Platform.select({
            web: 'animate-in fade-in-0 fixed',
          }),
          className
        )}
        {...props}
        asChild={Platform.OS !== 'web'}>
        <NativeOnlyAnimatedView
          entering={FadeIn.duration(200).delay(50).reduceMotion(ReduceMotion.System)}
          exiting={FadeOut.duration(150).reduceMotion(ReduceMotion.System)}
          as="Pressable">
          <>{children}</>
        </NativeOnlyAnimatedView>
      </AlertDialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

function AlertDialogContent({
  className,
  portalHost,
  size = 'default',
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  portalHost?: string;
  /** ◆ Lumin */
  size?: AlertDialogSize;
}) {
  return (
    <AlertDialogPortal hostName={portalHost}>
      <AlertDialogOverlay>
        <AlertDialogSizeContext.Provider value={size}>
        <AlertDialogPrimitive.Content
          className={cn(
            'bg-background border-border z-50 flex w-full max-w-[calc(100%-2rem)] flex-col gap-4 rounded-lg border p-6 shadow-lg shadow-black/5',
            size === 'sm' ? 'max-w-xs' : 'sm:max-w-lg',
            Platform.select({
              web: 'animate-in fade-in-0 zoom-in-95 duration-200',
            }),
            className
          )}
          {...props}
        />
        </AlertDialogSizeContext.Provider>
      </AlertDialogOverlay>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: ViewProps) {
  const size = React.useContext(AlertDialogSizeContext);
  return (
    <TextClassContext.Provider value={size === 'sm' ? 'text-center' : 'text-center sm:text-left'}>
      <View
        className={cn('flex flex-col', size === 'sm' ? 'items-center gap-3.5' : 'gap-2', className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

/** ◆ Lumin: icon on top of the title (h-10 rounded-md, bg-secondary; destructive bg-destructive/10). */
function AlertDialogMedia({
  className,
  variant = 'default',
  ...props
}: ViewProps & { variant?: 'default' | 'destructive' }) {
  return (
    <TextClassContext.Provider
      value={variant === 'destructive' ? 'text-destructive' : 'text-secondary-foreground'}>
      <View
        className={cn(
          'size-10 items-center justify-center rounded-md',
          variant === 'destructive' ? 'bg-destructive/10 dark:bg-destructive/20' : 'bg-secondary',
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function AlertDialogFooter({ className, ...props }: ViewProps) {
  const size = React.useContext(AlertDialogSizeContext);
  return (
    <View
      className={cn(
        'flex flex-col-reverse gap-2',
        size === 'sm' ? 'flex-row' : 'sm:flex-row sm:justify-end',
        className
      )}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      className={cn('text-foreground text-lg font-semibold', className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action> & {
  variant?: 'default' | 'destructive' | 'pdf';
}) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ className, variant })}>
      <AlertDialogPrimitive.Action className={cn(buttonVariants({ variant }), className)} {...props} />
    </TextClassContext.Provider>
  );
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ className, variant: 'outline' })}>
      <AlertDialogPrimitive.Cancel
        className={cn(buttonVariants({ variant: 'outline' }), className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
