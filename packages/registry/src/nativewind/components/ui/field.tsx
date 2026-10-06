/**
 * ◆ Lumin custom — not in RNR. Figma: PDF-Mobile-DS › ◆ Field. Tokens: 5. Component › field/*, field-group/*
 * Form field = Label + control (Input, Select, Switch, Checkbox, Radio) + description + error.
 * Also hosts the Checkbox / Radio / Switch rows from Figma (Label + Description, Type=Box,
 * Control Placement=End): <Field orientation="horizontal" variant="box" checked onPress>.
 * orientation="responsive" becomes horizontal only on Tablet (≥ 640).
 */
import { Label } from '@/registry/nativewind/components/ui/label';
import { Separator } from '@/registry/nativewind/components/ui/separator';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';

type FieldContextValue = { invalid: boolean; disabled: boolean };
const FieldContext = React.createContext<FieldContextValue>({ invalid: false, disabled: false });

function FieldSet({ className, ...props }: ViewProps) {
  return <View className={cn('flex flex-col gap-6', className)} {...props} />;
}

/** variant="legend" (text-base) or "label" (text-sm). */
function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: Omit<React.ComponentProps<typeof Text>, 'variant'> & { variant?: 'legend' | 'label' }) {
  return (
    <Text
      className={cn('font-medium', variant === 'legend' ? 'text-base' : 'text-sm', className)}
      {...props}
    />
  );
}

/** Vertical gap-5, horizontal gap-4 (field-group/*). */
function FieldGroup({
  className,
  orientation = 'vertical',
  ...props
}: ViewProps & { orientation?: 'vertical' | 'horizontal' }) {
  return (
    <View
      className={cn(
        'flex w-full',
        orientation === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'flex-col gap-5',
        className
      )}
      {...props}
    />
  );
}

type FieldProps = ViewProps & {
  orientation?: 'vertical' | 'horizontal' | 'responsive';
  /** Figma "Data Invalid" — label/description turn destructive. */
  invalid?: boolean;
  disabled?: boolean;
  /** ◆ Type=Box: bordered card row (Checkbox / Radio / Switch). */
  variant?: 'default' | 'box';
  /** Box highlight when the control inside is on. */
  checked?: boolean;
  /** Makes the whole row pressable (≥ 44 touch target for small controls). */
  onPress?: () => void;
};

function Field({
  className,
  orientation = 'vertical',
  invalid = false,
  disabled = false,
  variant = 'default',
  checked,
  onPress,
  ...props
}: FieldProps) {
  const classes = cn(
    'flex w-full gap-2',
    orientation === 'vertical' && 'flex-col',
    orientation === 'horizontal' && 'flex-row items-start gap-2',
    orientation === 'responsive' && 'flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-4',
    variant === 'box' && 'border-border rounded-lg border px-2.5 py-2.5',
    variant === 'box' && checked && 'border-primary bg-primary/5 dark:bg-primary/10',
    variant === 'box' && invalid && 'border-destructive bg-destructive/10 dark:bg-destructive/20',
    disabled && 'opacity-50',
    className
  );
  const content = (
    <FieldContext.Provider value={{ invalid, disabled }}>
      {onPress ? (
        <Pressable
          className={cn(classes, 'min-h-11')}
          onPress={onPress}
          disabled={disabled}
          accessibilityState={{ disabled, checked }}
          {...props}
        />
      ) : (
        <View className={classes} {...props} />
      )}
    </FieldContext.Provider>
  );
  return content;
}

/** Label + description column next to a control (gap-1.5). */
function FieldContent({ className, ...props }: ViewProps) {
  return <View className={cn('flex flex-1 flex-col gap-1.5', className)} {...props} />;
}

function FieldLabel({ className, ...props }: React.ComponentProps<typeof Label>) {
  const { invalid, disabled } = React.useContext(FieldContext);
  return (
    <Label
      className={cn(invalid && 'text-destructive', className)}
      disabled={disabled}
      {...props}
    />
  );
}

function FieldTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  const { invalid } = React.useContext(FieldContext);
  return (
    <Text
      className={cn('text-sm font-medium', invalid && 'text-destructive', className)}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text className={cn('text-muted-foreground text-sm', className)} {...props} />;
}

function FieldError({ className, ...props }: React.ComponentProps<typeof Text>) {
  return <Text role="alert" className={cn('text-destructive text-sm', className)} {...props} />;
}

/** Line with optional centred text ("Or continue with"). */
function FieldSeparator({ className, children, ...props }: ViewProps) {
  return (
    <View className={cn('h-5 flex-row items-center', className)} {...props}>
      <Separator className="flex-1" />
      {children ? (
        <Text className="text-muted-foreground bg-background px-2 text-sm">{children}</Text>
      ) : null}
      {children ? <Separator className="flex-1" /> : null}
    </View>
  );
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
};
