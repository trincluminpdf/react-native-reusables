/**
 * ◆ Lumin custom — not in RNR. Figma: PDF-Mobile-DS › ◆ Empty. Tokens: 5. Component › empty/*
 * Empty state = media + title + description + actions (Button / 2 Buttons / Input + description).
 */
import { Text, TextClassContext } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { View, type ViewProps } from 'react-native';

/** p-6 gap-4 rounded-lg, centred. Add `border border-dashed border-border` for an outlined area. */
function Empty({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn('flex-1 items-center justify-center gap-4 rounded-lg p-6', className)}
      {...props}
    />
  );
}

function EmptyHeader({ className, ...props }: ViewProps) {
  return <View className={cn('w-full max-w-sm items-center gap-2', className)} {...props} />;
}

/** variant="icon": size-8 rounded-lg bg-muted. variant="default": transparent (Avatar / AvatarGroup). */
function EmptyMedia({
  className,
  variant = 'default',
  ...props
}: ViewProps & { variant?: 'default' | 'icon' }) {
  return (
    <TextClassContext.Provider value="text-foreground">
      <View
        className={cn(
          'mb-2 items-center justify-center',
          variant === 'icon' && 'bg-muted size-8 rounded-lg',
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function EmptyTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text className={cn('text-center text-sm font-medium', className)} {...props} />;
}

function EmptyDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn('text-muted-foreground text-center text-sm leading-relaxed', className)}
      {...props}
    />
  );
}

function EmptyContent({ className, ...props }: ViewProps) {
  return <View className={cn('w-full max-w-sm items-center gap-4', className)} {...props} />;
}

export { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle };
