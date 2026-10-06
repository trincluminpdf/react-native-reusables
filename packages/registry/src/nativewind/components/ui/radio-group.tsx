/**
 * RNR Radio Group + ◆ Lumin deltas (Figma: PDF-Mobile-DS › Radio Group, tokens radiobutton/*):
 * 1. Label + Description, Type=Box, Control Placement=End are compositions → ◆ Field.
 * 2. Checked item = filled primary circle with a primary-foreground dot (Lumin DS).
 * 3. Invalid (aria-invalid) — Lumin styling. No shadow. Touch target: hitSlop 14 (44).
 */
import { cn } from '@/registry/nativewind/lib/utils';
import * as RadioGroupPrimitive from '@rn-primitives/radio-group';
import * as React from 'react';
import { Platform } from 'react-native';

const RadioValueContext = React.createContext<string | undefined>(undefined);

function RadioGroup({ className, ...props }: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioValueContext.Provider value={props.value}>
      <RadioGroupPrimitive.Root className={cn('gap-3', className)} {...props} />
    </RadioValueContext.Provider>
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item> & { 'aria-invalid'?: boolean }) {
  const value = React.useContext(RadioValueContext);
  const checked = value === props.value;
  const invalid = !!props['aria-invalid'];
  return (
    <RadioGroupPrimitive.Item
      className={cn(
        'border-border dark:bg-input/30 bg-background aspect-square size-4 shrink-0 items-center justify-center rounded-full border',
        Platform.select({
          web: 'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed',
        }),
        checked && 'bg-primary border-primary dark:bg-primary',
        invalid && 'border-destructive',
        checked && invalid && 'bg-destructive dark:bg-destructive',
        props.disabled && 'opacity-50',
        className
      )}
      hitSlop={14}
      {...props}>
      <RadioGroupPrimitive.Indicator
        className={cn(
          'bg-primary-foreground size-1.5 rounded-full',
          invalid && 'bg-destructive-foreground'
        )}
      />
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
