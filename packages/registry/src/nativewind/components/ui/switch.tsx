/**
 * RNR Switch + ◆ Lumin deltas (Figma: PDF-Mobile-DS › Switch, tokens switch/*):
 * 1. size="sm" — Lumin-only (track w-6, thumb size-3). RNR has one size.
 * 2. Label + Description, Type=Box, Control Placement=End are compositions → ◆ Field.
 * 3. Invalid (aria-invalid) — Lumin styling. Thumb = bg-background (Figma token). No shadow.
 * 4. Touch target: track is 18×32 → hitSlop (44).
 */
import { cn } from '@/registry/nativewind/lib/utils';
import * as SwitchPrimitives from '@rn-primitives/switch';
import { Platform } from 'react-native';

function Switch({
  className,
  size = 'default',
  ...props
}: React.ComponentProps<typeof SwitchPrimitives.Root> & {
  /** ◆ Lumin */
  size?: 'default' | 'sm';
  'aria-invalid'?: boolean;
}) {
  const invalid = !!props['aria-invalid'];
  const sm = size === 'sm';
  return (
    <SwitchPrimitives.Root
      className={cn(
        'flex shrink-0 flex-row items-center rounded-full border border-transparent',
        sm ? 'h-3.5 w-6' : 'h-[1.15rem] w-8',
        Platform.select({
          web: 'focus-visible:border-ring focus-visible:ring-ring/50 peer inline-flex outline-none transition-all focus-visible:ring-[3px] disabled:cursor-not-allowed',
        }),
        props.checked ? 'bg-primary' : 'bg-input dark:bg-input/80',
        invalid && 'border-destructive',
        props.disabled && 'opacity-50',
        className
      )}
      hitSlop={sm ? { top: 15, bottom: 15, left: 10, right: 10 } : { top: 13, bottom: 13, left: 6, right: 6 }}
      {...props}>
      <SwitchPrimitives.Thumb
        className={cn(
          'bg-background rounded-full transition-transform',
          sm ? 'size-3' : 'size-4',
          Platform.select({
            web: 'pointer-events-none block ring-0',
          }),
          props.checked ? (sm ? 'translate-x-2.5' : 'translate-x-3.5') : 'translate-x-0'
        )}
      />
    </SwitchPrimitives.Root>
  );
}

export { Switch };
