/**
 * RNR Tabs + ◆ Lumin deltas (Figma: PDF-Mobile-DS › Tabs, tokens tabs/*):
 * 1. variant="line" (underline tabs) — Lumin-only; RNR ships the segmented (default) style.
 * 2. Icon + BadgeNumber inside a trigger are compositions.
 * 3. Orientation=Vertical removed for mobile.
 * 4. Touch target: trigger ~28–30px tall → hitSlop (44).
 */
import { TextClassContext } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as TabsPrimitive from '@rn-primitives/tabs';
import * as React from 'react';
import { Platform } from 'react-native';

type TabsVariant = 'default' | 'line';
const TabsVariantContext = React.createContext<TabsVariant>('default');

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn('flex flex-col gap-2', className)} {...props} />;
}

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & { variant?: TabsVariant }) {
  return (
    <TabsVariantContext.Provider value={variant}>
      <TabsPrimitive.List
        className={cn(
          'flex h-9 flex-row items-center justify-center',
          variant === 'default'
            ? 'bg-muted rounded-lg p-[3px]'
            : 'border-border gap-1 rounded-none border-b bg-transparent p-0',
          Platform.select({ web: 'inline-flex w-fit', native: 'mr-auto' }),
          className
        )}
        {...props}
      />
    </TabsVariantContext.Provider>
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { value } = TabsPrimitive.useRootContext();
  const variant = React.useContext(TabsVariantContext);
  const active = value === props.value;
  return (
    <TextClassContext.Provider
      value={cn(
        'text-sm font-medium',
        variant === 'default'
          ? cn('text-foreground dark:text-muted-foreground', active && 'dark:text-foreground')
          : active
            ? 'text-foreground'
            : 'text-muted-foreground'
      )}>
      <TabsPrimitive.Trigger
        className={cn(
          'flex flex-row items-center justify-center gap-1.5 px-2',
          variant === 'default'
            ? 'h-[calc(100%-1px)] rounded-md border border-transparent py-1'
            : '-mb-px h-full rounded-none border-b-2 border-transparent py-1.5',
          Platform.select({
            web: 'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex cursor-default whitespace-nowrap transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-[3px] disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
          }),
          props.disabled && 'opacity-50',
          active &&
            (variant === 'default'
              ? 'bg-background dark:border-input dark:bg-input/30 shadow-sm shadow-black/10'
              : 'border-foreground'),
          className
        )}
        hitSlop={{ top: 8, bottom: 8 }}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(Platform.select({ web: 'flex-1 outline-none' }), className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
