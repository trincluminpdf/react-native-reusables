/**
 * RNR Alert + ◆ Lumin deltas (Figma: PDF-Mobile-DS › Alert, tokens alert/*):
 * 1. AlertAction — action Button inside the alert (top-right). Lumin-only.
 * 2. Title / Description / Icon are optional children (Figma show/hide toggles).
 */
import { Icon, type IconComponent } from '@/registry/nativewind/components/ui/icon';
import { Text, TextClassContext } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { View } from 'react-native';

function Alert({
  className,
  variant,
  children,
  icon,
  iconClassName,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View> & {
  icon?: IconComponent;
  variant?: 'default' | 'destructive';
  iconClassName?: string;
}) {
  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm text-foreground',
        variant === 'destructive' && 'text-destructive',
        className
      )}>
      <View
        role="alert"
        className={cn(
          'bg-card border-border relative w-full rounded-lg border px-4 pb-2 pt-3.5',
          className
        )}
        {...props}>
        {icon ? (
          <View className="absolute left-3.5 top-3">
            <Icon
              as={icon}
              className={cn('size-4', variant === 'destructive' && 'text-destructive', iconClassName)}
            />
          </View>
        ) : null}
        {children}
      </View>
    </TextClassContext.Provider>
  );
}

function AlertTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn('mb-1 ml-0.5 min-h-4 pl-6 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  const textClass = React.useContext(TextClassContext);
  return (
    <Text
      className={cn(
        'text-muted-foreground ml-0.5 pb-1.5 pl-6 text-sm leading-relaxed',
        textClass?.includes('text-destructive') && 'text-destructive/90',
        className
      )}
      {...props}
    />
  );
}

/** ◆ Lumin: action slot (e.g. <Button size="sm" variant="outline">) pinned top-right. Give the title pr-20. */
function AlertAction({ className, ...props }: React.ComponentProps<typeof View>) {
  return <View className={cn('absolute right-3 top-2.5', className)} {...props} />;
}

export { Alert, AlertAction, AlertDescription, AlertTitle };
