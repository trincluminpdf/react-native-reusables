/**
 * ◆ Lumin custom — not in RNR. Figma: PDF-Mobile-DS › ◆ Input Group. Tokens: 5. Component › inputgroup/*
 * A View wrapping an input (or textarea) plus leading/trailing addons (Icon, Text, Spinner, Button)
 * or a block addon row under/over a textarea. Focus ring shown on native too. Addon Kbd removed.
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { Text, TextClassContext } from '@/registry/nativewind/components/ui/text';
import { useFocusRing } from '@/registry/nativewind/lib/focus-ring';
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { Platform, TextInput, View, type ViewProps } from 'react-native';

type GroupCtx = {
  setFocused: (v: boolean) => void;
  disabled: boolean;
};
const InputGroupContext = React.createContext<GroupCtx>({ setFocused: () => {}, disabled: false });

function InputGroup({
  className,
  invalid = false,
  disabled = false,
  style,
  children,
  ...props
}: ViewProps & { invalid?: boolean; disabled?: boolean }) {
  const [focused, setFocused] = React.useState(false);
  const ring = useFocusRing({ invalid, forceFocused: focused });
  const hasBlock = React.Children.toArray(children).some(
    (c) =>
      React.isValidElement<{ align?: string }>(c) &&
      (c.props.align === 'block-start' || c.props.align === 'block-end')
  );
  return (
    <InputGroupContext.Provider value={{ setFocused, disabled }}>
      <View
        className={cn(
          'border-input bg-background dark:bg-input/30 w-full rounded-md border',
          hasBlock ? 'flex-col' : 'h-10 flex-row items-center gap-2 px-3 py-1 sm:h-9',
          focused && cn('border-ring', Platform.select({ web: 'ring-ring/50 ring-[3px]' })),
          invalid &&
            cn(
              'border-destructive',
              Platform.select({ web: 'ring-destructive/20 dark:ring-destructive/40 ring-[3px]' })
            ),
          disabled && 'bg-input/50 dark:bg-input/80 opacity-50',
          className
        )}
        style={[ring.style, style]}
        {...props}>
        {children}
      </View>
    </InputGroupContext.Provider>
  );
}

function InputGroupInput({
  className,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof TextInput>) {
  const { setFocused, disabled } = React.useContext(InputGroupContext);
  return (
    <TextInput
      className={cn(
        'text-foreground h-full min-w-0 flex-1 bg-transparent text-sm',
        Platform.select({
          web: 'placeholder:text-muted-foreground outline-none',
          native: 'placeholder:text-muted-foreground',
        }),
        className
      )}
      editable={!disabled}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...props}
    />
  );
}

function InputGroupTextarea({
  className,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<typeof TextInput>) {
  const { setFocused, disabled } = React.useContext(InputGroupContext);
  return (
    <TextInput
      multiline
      numberOfLines={Platform.select({ web: 2, native: 8 })}
      textAlignVertical="top"
      className={cn(
        'text-foreground min-h-16 w-full bg-transparent px-2.5 py-2 text-sm',
        Platform.select({
          web: 'placeholder:text-muted-foreground resize-none outline-none',
          native: 'placeholder:text-muted-foreground',
        }),
        className
      )}
      editable={!disabled}
      onFocus={(e) => {
        setFocused(true);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
      {...props}
    />
  );
}

/** inline-start / inline-end: icon, text, spinner, small button. block-*: full-width row (px-2.5 py-2). */
function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: ViewProps & { align?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end' }) {
  const block = align === 'block-start' || align === 'block-end';
  return (
    <TextClassContext.Provider value="text-muted-foreground text-sm">
      <View
        className={cn(
          'flex-row items-center gap-2',
          block && 'w-full px-2.5 py-2',
          align === 'block-end' && 'justify-between',
          className
        )}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function InputGroupText({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

/** Small button for addons: h-6 px-2 (size="icon" → size-6), ghost by default. */
function InputGroupButton({
  className,
  variant = 'ghost',
  size,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      variant={variant}
      size={size === 'icon' ? 'icon' : 'sm'}
      className={cn(
        size === 'icon' ? 'size-6 rounded-sm sm:size-6' : 'h-6 rounded-sm px-2 sm:h-6',
        className
      )}
      hitSlop={10}
      {...props}
    />
  );
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
};
