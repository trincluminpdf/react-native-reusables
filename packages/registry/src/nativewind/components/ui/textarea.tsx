/**
 * RNR Textarea + ◆ Lumin deltas (Figma: PDF-Mobile-DS › Textarea, tokens textarea/*):
 * 1. Focus / Error (Focus) ring shown on native too — RNR draws it on web only.
 * 2. Error (aria-invalid) styled on native too. Disabled bg-input/50. No shadow.
 * Size: min-h-16, px-3 py-2, text-base (md:text-sm only ≥ 768). numberOfLines native = 8.
 */
import { useFocusRing } from '@/registry/nativewind/lib/focus-ring';
import { cn } from '@/registry/nativewind/lib/utils';
import { Platform, TextInput } from 'react-native';

function Textarea({
  className,
  multiline = true,
  numberOfLines = Platform.select({ web: 2, native: 8 }), // On web, numberOfLines also determines initial height. On native, it determines the maximum height.
  placeholderClassName,
  style,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput> & { 'aria-invalid'?: boolean }) {
  const invalid = !!props['aria-invalid'];
  const ring = useFocusRing({ invalid });
  return (
    <TextInput
      className={cn(
        'text-foreground border-input dark:bg-input/30 bg-background flex min-h-16 w-full flex-row rounded-md border px-3 py-2 text-base md:text-sm',
        Platform.select({
          web: 'placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:ring-[3px] field-sizing-content resize-y outline-none transition-[color,box-shadow] focus-visible:ring-[3px] disabled:cursor-not-allowed',
          native: cn(ring.focused && 'border-ring'),
        }),
        invalid && 'border-destructive',
        props.editable === false && 'bg-input/50 dark:bg-input/80 opacity-50',
        className
      )}
      placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
      multiline={multiline}
      numberOfLines={numberOfLines}
      textAlignVertical="top"
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

export { Textarea };
