/**
 * RNR Input + ◆ Lumin deltas (Figma: PDF-Mobile-DS › Input, tokens input/*):
 * 1. Password show/hide = composition (InputGroup + icon Button), see ◆ Input Group.
 * 2. Focus ring shown on native too (border-ring + ring) — RNR draws it on web only.
 * 3. Invalid (aria-invalid) styled on native too: border-destructive + ring destructive/20.
 * 4. Disabled: bg-input/50 (dark /80) + opacity-50. No shadow.
 * Size: h-10 (Tablet sm:h-9), px-3 py-1, text-base. Touch target: the field is 40 / 36 — pass
 * className="min-h-11" (44) where the field stands alone.
 */
import { useFocusRing } from '@/registry/nativewind/lib/focus-ring';
import { cn } from '@/registry/nativewind/lib/utils';
import { Platform, TextInput } from 'react-native';

type InputProps = React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput> & { 'aria-invalid'?: boolean };

function Input({ className, style, onFocus, onBlur, ...props }: InputProps) {
  const invalid = !!props['aria-invalid'];
  const ring = useFocusRing({ invalid });
  const disabled = props.editable === false;
  return (
    <TextInput
      className={cn(
        'dark:bg-input/30 border-input bg-background text-foreground flex h-10 w-full min-w-0 flex-row items-center rounded-md border px-3 py-1 text-base leading-5 sm:h-9',
        disabled &&
          cn(
            'bg-input/50 dark:bg-input/80 opacity-50',
            Platform.select({ web: 'disabled:pointer-events-none disabled:cursor-not-allowed' })
          ),
        Platform.select({
          web: cn(
            'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground outline-none transition-[color,box-shadow] md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring-[3px]'
          ),
          native: cn('placeholder:text-muted-foreground', ring.focused && 'border-ring'),
        }),
        invalid && 'border-destructive',
        className
      )}
      style={[ring.style, style]}
      onFocus={(e) => {
        ring.onFocus();
        onFocus?.(e);
      }}
      onBlur={(e) => {
        ring.onBlur();
        onBlur?.(e);
      }}
      {...props}
    />
  );
}

export { Input };
export type { InputProps };
