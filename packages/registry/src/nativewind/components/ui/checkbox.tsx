/**
 * RNR Checkbox + ◆ Lumin deltas (Figma: PDF-Mobile-DS › Checkbox, tokens checkbox/*):
 * 1. Label + Description, Type=Box and Control Placement=End are compositions → ◆ Field
 *    (<Field orientation="horizontal" variant="box">). RNR Checkbox is the box only.
 * 2. indeterminate — not in RNR (Minus icon).
 * 3. Invalid (aria-invalid) — Lumin styling on native too (border/bg destructive).
 * 4. No shadow. Touch target: box is 16px → hitSlop 14 (44).
 */
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { cn } from '@/registry/nativewind/lib/utils';
import * as CheckboxPrimitive from '@rn-primitives/checkbox';
import { CheckIcon, MinusIcon } from 'phosphor-react-native';
import { Platform, View } from 'react-native';

const DEFAULT_HIT_SLOP = 14;

function Checkbox({
  className,
  checkedClassName,
  indicatorClassName,
  iconClassName,
  indeterminate,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  checkedClassName?: string;
  indicatorClassName?: string;
  iconClassName?: string;
  /** ◆ Lumin */
  indeterminate?: boolean;
  'aria-invalid'?: boolean;
}) {
  const invalid = !!props['aria-invalid'];
  const on = props.checked || indeterminate;
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'border-input dark:bg-input/30 bg-background size-4 shrink-0 rounded-[4px] border',
        Platform.select({
          web: 'focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive peer cursor-default outline-none transition-shadow focus-visible:ring-[3px] disabled:cursor-not-allowed',
          native: 'overflow-hidden',
        }),
        on && cn('border-primary', checkedClassName),
        invalid && 'border-destructive',
        props.disabled && 'opacity-50',
        className
      )}
      hitSlop={DEFAULT_HIT_SLOP}
      {...props}>
      {indeterminate && !props.checked ? (
        <View
          className={cn(
            'bg-primary h-full w-full items-center justify-center',
            invalid && 'bg-destructive',
            indicatorClassName
          )}>
          <Icon
            as={MinusIcon}
            size={12}
            weight="bold"
            className={cn(
              'text-primary-foreground',
              invalid && 'text-destructive-foreground',
              iconClassName
            )}
          />
        </View>
      ) : null}
      <CheckboxPrimitive.Indicator
        className={cn(
          'bg-primary h-full w-full items-center justify-center',
          invalid && 'bg-destructive',
          indicatorClassName
        )}>
        <Icon
          as={CheckIcon}
          size={12}
          weight="bold"
          className={cn(
            'text-primary-foreground',
            invalid && 'text-destructive-foreground',
            iconClassName
          )}
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
