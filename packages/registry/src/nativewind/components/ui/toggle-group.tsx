/**
 * RNR Toggle Group + ◆ Lumin deltas (Figma: PDF-Mobile-DS › Toggle Group, tokens toggle-group/*):
 * 1. fill — items stretch to full width (Type=Fill). Lumin-only.
 * 2. spacing — separate items with gap-2 (Type=With Spacing). Lumin-only; RNR joins items.
 * 3. orientation="vertical" — gap-1 column. Lumin-only; RNR group is a row.
 * Sizes follow Toggle.
 */
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { TextClassContext } from '@/registry/nativewind/components/ui/text';
import { toggleVariants } from '@/registry/nativewind/components/ui/toggle';
import { cn } from '@/registry/nativewind/lib/utils';
import * as ToggleGroupPrimitive from '@rn-primitives/toggle-group';
import type { VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Platform } from 'react-native';

type GroupLayout = {
  /** ◆ Lumin: Type=Fill */
  fill?: boolean;
  /** ◆ Lumin: Type=With Spacing */
  spacing?: boolean;
  /** ◆ Lumin */
  orientation?: 'horizontal' | 'vertical';
};

const ToggleGroupContext = React.createContext<
  (VariantProps<typeof toggleVariants> & GroupLayout) | null
>(null);

function ToggleGroup({
  className,
  variant,
  size,
  fill,
  spacing,
  orientation = 'horizontal',
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> &
  GroupLayout) {
  const vertical = orientation === 'vertical';
  return (
    <ToggleGroupPrimitive.Root
      className={cn(
        'flex rounded-md shadow-none',
        vertical ? 'flex-col items-stretch gap-1' : 'flex-row items-center',
        !vertical && spacing && 'gap-2',
        fill && !vertical && 'w-full',
        Platform.select({ web: fill ? undefined : 'w-fit' }),
        className
      )}
      {...props}>
      <ToggleGroupContext.Provider value={{ variant, size, fill, spacing, orientation }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function useToggleGroupContext() {
  const context = React.useContext(ToggleGroupContext);
  if (context === null) {
    throw new Error(
      'ToggleGroup compound components cannot be rendered outside the ToggleGroup component'
    );
  }
  return context;
}

function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  isFirst,
  isLast,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants> & {
    isFirst?: boolean;
    isLast?: boolean;
  }) {
  const context = useToggleGroupContext();
  const { value } = ToggleGroupPrimitive.useRootContext();
  const selected = ToggleGroupPrimitive.utils.getIsSelected(value, props.value);
  const outline = context.variant === 'outline' || variant === 'outline';
  const separate = context.spacing || context.orientation === 'vertical';

  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm text-foreground font-medium',
        selected ? 'text-accent-foreground' : Platform.select({ web: 'group-hover:text-muted-foreground' })
      )}>
      <ToggleGroupPrimitive.Item
        className={cn(
          toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
          }),
          props.disabled && 'opacity-50',
          selected && 'bg-accent',
          'min-w-0 shrink-0 shadow-none',
          !separate && 'rounded-none',
          !separate && isFirst && 'rounded-l-md',
          !separate && isLast && 'rounded-r-md',
          !separate && outline && 'border-l-0',
          !separate && outline && isFirst && 'border-l',
          context.fill && 'flex-1',
          context.orientation === 'vertical' && 'justify-start',
          Platform.select({ web: 'focus:z-10 focus-visible:z-10' }),
          className
        )}
        {...props}>
        {children}
      </ToggleGroupPrimitive.Item>
    </TextClassContext.Provider>
  );
}

function ToggleGroupIcon({ className, ...props }: React.ComponentProps<typeof Icon>) {
  const textClass = React.useContext(TextClassContext);
  return <Icon className={cn('size-4 shrink-0', textClass, className)} {...props} />;
}

export { ToggleGroup, ToggleGroupIcon, ToggleGroupItem };
