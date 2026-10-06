/**
 * ◆ Lumin custom — not in RNR. Figma: PDF-Mobile-DS › ◆ Item. Tokens: 5. Component › item/*, itemgroup/*
 * List row: media + title/description + actions. Variant Default / Outline / Muted, Size default / sm / xs.
 * Rows used as tap targets must be ≥ 44 high (default is 60).
 */
import { Separator } from '@/registry/nativewind/components/ui/separator';
import { Text, TextClassContext } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';

const itemVariants = cva('flex-row items-center gap-2 rounded-lg border border-transparent', {
  variants: {
    variant: {
      default: 'bg-transparent',
      outline: 'border-border',
      muted: 'bg-muted/50',
    },
    size: {
      default: 'px-3 py-2.5',
      sm: 'px-3 py-2.5',
      xs: 'px-2.5 py-2',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
});

type ItemSize = NonNullable<VariantProps<typeof itemVariants>['size']>;
const ItemSizeContext = React.createContext<ItemSize>('default');

function Item({
  className,
  variant,
  size,
  onPress,
  ...props
}: ViewProps & VariantProps<typeof itemVariants> & { onPress?: () => void }) {
  return (
    <ItemSizeContext.Provider value={size ?? 'default'}>
      {onPress ? (
        <Pressable
          className={cn(itemVariants({ variant, size }), 'active:bg-accent/50', className)}
          onPress={onPress}
          role="button"
          {...props}
        />
      ) : (
        <View className={cn(itemVariants({ variant, size }), className)} {...props} />
      )}
    </ItemSizeContext.Provider>
  );
}

/** variant="icon": size-8 rounded-sm border bg-muted. "image": size-10 rounded-sm overflow-hidden. */
function ItemMedia({
  className,
  variant = 'default',
  ...props
}: ViewProps & { variant?: 'default' | 'icon' | 'image' }) {
  return (
    <TextClassContext.Provider value="text-foreground">
      <View
        className={cn(
          'shrink-0 items-center justify-center',
          variant === 'icon' && 'border-border bg-muted size-8 rounded-sm border',
          variant === 'image' && 'size-10 overflow-hidden rounded-sm',
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function ItemContent({ className, ...props }: ViewProps) {
  return <View className={cn('flex-1 flex-col gap-1', className)} {...props} />;
}

function ItemTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text className={cn('text-sm font-medium leading-4', className)} numberOfLines={1} {...props} />;
}

function ItemDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  const size = React.useContext(ItemSizeContext);
  return (
    <Text
      className={cn('text-muted-foreground', size === 'xs' ? 'text-xs' : 'text-sm', className)}
      numberOfLines={2}
      {...props}
    />
  );
}

function ItemActions({ className, ...props }: ViewProps) {
  return <View className={cn('flex-row items-center gap-2', className)} {...props} />;
}

function ItemGroup({ className, ...props }: ViewProps) {
  return <View role="list" className={cn('flex-col gap-4', className)} {...props} />;
}

function ItemSeparator({ className, ...props }: React.ComponentProps<typeof Separator>) {
  return <Separator className={cn('my-0', className)} {...props} />;
}

export {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
  itemVariants,
};
