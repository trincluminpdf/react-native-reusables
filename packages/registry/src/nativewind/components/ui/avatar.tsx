/**
 * RNR Avatar + ◆ Lumin deltas (Figma: PDF-Mobile-DS › Avatar, tokens avatar/*, avatar-group/*):
 * 1. size xs (20) / sm (24) / default (32) / lg (40) / xl (48) — RNR has one size (size-8).
 * 2. Type=Icon fallback — compose <Icon> inside AvatarFallback.
 * 3. AvatarBadge (status dot) and AvatarGroup (stacked, ring-2 ring-background) — Lumin-only.
 */
import { TextClassContext } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as AvatarPrimitive from '@rn-primitives/avatar';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { View } from 'react-native';

const avatarVariants = cva('relative flex shrink-0 rounded-full', {
  variants: {
    size: {
      xs: 'size-5',
      sm: 'size-6',
      default: 'size-8',
      lg: 'size-10',
      xl: 'size-12',
    },
  },
  defaultVariants: { size: 'default' },
});

const fallbackText: Record<NonNullable<VariantProps<typeof avatarVariants>['size']>, string> = {
  xs: 'text-[10px]',
  sm: 'text-xs',
  default: 'text-sm',
  lg: 'text-base',
  xl: 'text-lg',
};

function Avatar({
  className,
  size,
  children,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>) {
  return (
    <TextClassContext.Provider value={cn('text-muted-foreground font-medium', fallbackText[size ?? 'default'])}>
      <View className={cn(avatarVariants({ size }), className)}>
        <AvatarPrimitive.Root className="size-full overflow-hidden rounded-full" {...props}>
          {React.Children.toArray(children).filter(
            (c) => !(React.isValidElement(c) && c.type === AvatarBadge)
          )}
        </AvatarPrimitive.Root>
        {React.Children.toArray(children).filter(
          (c) => React.isValidElement(c) && c.type === AvatarBadge
        )}
      </View>
    </TextClassContext.Provider>
  );
}

function AvatarImage({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return <AvatarPrimitive.Image className={cn('aspect-square size-full', className)} {...props} />;
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        'bg-muted flex size-full flex-row items-center justify-center rounded-full',
        className
      )}
      {...props}
    />
  );
}

/** ◆ Lumin: status dot, bottom-right. size 2 / 2.5 / 3 (8–12px), border-2 border-background. */
function AvatarBadge({
  className,
  size = '2.5',
  ...props
}: React.ComponentProps<typeof View> & { size?: '2' | '2.5' | '3' }) {
  return (
    <View
      className={cn(
        'border-background absolute bottom-0 right-0 items-center justify-center rounded-full border-2 bg-green-500',
        size === '2' ? 'size-2' : size === '3' ? 'size-3' : 'size-2.5',
        className
      )}
      {...props}
    />
  );
}

/** ◆ Lumin: stacked avatars (-space-x-2, border-2 border-background on each). */
function AvatarGroup({ className, children, ...props }: React.ComponentProps<typeof View>) {
  const items = React.Children.toArray(children);
  return (
    <View className={cn('flex-row', className)} {...props}>
      {items.map((child, i) => (
        <View key={i} className={cn('border-background rounded-full border-2', i > 0 && '-ml-2')}>
          {child}
        </View>
      ))}
    </View>
  );
}

export { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarImage, avatarVariants };
