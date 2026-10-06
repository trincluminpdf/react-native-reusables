/**
 * ◆ Lumin custom — not in RNR. Figma: PDF-Mobile-DS › ◆ Input OTP. Tokens: 5. Component › inputotp/*
 * Variants: Digits Only (joined slots), With Separator (groups + minus), With Spacing (separate slots).
 * Implementation: one hidden TextInput drives the visible slots (works with iOS/Android one-time-code
 * autofill). A library like input-otp-native can replace it with the same slot styling.
 */
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { MinusIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Animated, Keyboard, Platform, Pressable, TextInput, View, type ViewProps } from 'react-native';

type OTPContextValue = {
  value: string;
  maxLength: number;
  focused: boolean;
  invalid: boolean;
  disabled: boolean;
};
const OTPContext = React.createContext<OTPContextValue>({
  value: '',
  maxLength: 6,
  focused: false,
  invalid: false,
  disabled: false,
});

type InputOTPProps = {
  maxLength?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  invalid?: boolean;
  disabled?: boolean;
  /** Digits only by default. */
  pattern?: RegExp;
  className?: string;
  children: React.ReactNode;
  autoFocus?: boolean;
};

function InputOTP({
  maxLength = 6,
  value: valueProp,
  defaultValue = '',
  onChange,
  onComplete,
  invalid = false,
  disabled = false,
  pattern = /^\d*$/,
  className,
  children,
  autoFocus,
}: InputOTPProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const value = valueProp ?? inner;
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef<TextInput>(null);

  // Android: the system Back key hides the keyboard but leaves the TextInput focused, so the active
  // slot ring/caret stayed on and focus() was a no-op (keyboard would not come back). Blur on hide.
  React.useEffect(() => {
    if (Platform.OS !== 'android') return;
    const sub = Keyboard.addListener('keyboardDidHide', () => {
      if (inputRef.current?.isFocused()) inputRef.current.blur();
    });
    return () => sub.remove();
  }, []);

  function focusInput() {
    const input = inputRef.current;
    if (!input) return;
    if (Platform.OS === 'android' && input.isFocused() && !Keyboard.isVisible()) {
      input.blur();
      requestAnimationFrame(() => input.focus());
      return;
    }
    input.focus();
  }

  function handleChange(text: string) {
    const next = text.slice(0, maxLength);
    if (!pattern.test(next)) return;
    if (valueProp === undefined) setInner(next);
    onChange?.(next);
    if (next.length === maxLength) onComplete?.(next);
  }

  return (
    <OTPContext.Provider value={{ value, maxLength, focused, invalid, disabled }}>
      <Pressable
        className={cn('relative flex-row items-center gap-2', disabled && 'opacity-50', className)}
        onPress={focusInput}
        disabled={disabled}
        accessibilityLabel="One-time code">
        {children}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleChange}
          maxLength={maxLength}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete={Platform.select({ android: 'sms-otp', default: 'one-time-code' })}
          editable={!disabled}
          autoFocus={autoFocus}
          caretHidden
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            'absolute inset-0 text-transparent opacity-0',
            Platform.select({ web: 'outline-none' })
          )}
          style={Platform.OS === 'web' ? ({ caretColor: 'transparent' } as object) : undefined}
        />
      </Pressable>
    </OTPContext.Provider>
  );
}

const GroupContext = React.createContext<{ spacing: boolean }>({ spacing: false });

/** Joined slots (Digits Only). `spacing` → separate rounded slots with gap-2 (With Spacing). */
function InputOTPGroup({
  className,
  spacing = false,
  children,
  ...props
}: ViewProps & { spacing?: boolean }) {
  const items = React.Children.toArray(children).filter(React.isValidElement);
  return (
    <GroupContext.Provider value={{ spacing }}>
      <View className={cn('flex-row items-center', spacing && 'gap-2', className)} {...props}>
        {items.map((child, i) =>
          React.cloneElement(child as React.ReactElement<SlotProps>, {
            first: i === 0,
            last: i === items.length - 1,
          })
        )}
      </View>
    </GroupContext.Provider>
  );
}

type SlotProps = ViewProps & { index: number; first?: boolean; last?: boolean };

/** 32×32 slot; active slot gets border-ring + ring; invalid → border-destructive. */
function InputOTPSlot({ index, first, last, className, ...props }: SlotProps) {
  const { value, focused, invalid, maxLength } = React.useContext(OTPContext);
  const { spacing } = React.useContext(GroupContext);
  const char = value[index];
  const activeIndex = Math.min(value.length, maxLength - 1);
  const active = focused && index === activeIndex;
  return (
    <View
      className={cn(
        'border-input bg-background dark:bg-input/30 relative size-8 items-center justify-center',
        spacing ? 'rounded-md border' : 'border-y border-r',
        !spacing && first && 'rounded-l-md border-l',
        !spacing && last && 'rounded-r-md',
        invalid && 'border-destructive',
        active && cn('border-ring z-10', Platform.select({ web: 'ring-ring/50 ring-[3px]' })),
        active && invalid && 'border-destructive',
        className
      )}
      {...props}>
      {char ? <Text className="text-foreground text-sm">{char}</Text> : null}
      {active && !char ? <Caret /> : null}
    </View>
  );
}

function Caret() {
  const opacity = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: Platform.OS !== 'web' }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: Platform.OS !== 'web' }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);
  return <Animated.View style={{ opacity }} className="bg-foreground h-4 w-px" />;
}

function InputOTPSeparator({ className, ...props }: ViewProps) {
  return (
    <View role="separator" className={cn('size-6 items-center justify-center', className)} {...props}>
      <Icon as={MinusIcon} size={16} className="text-foreground" />
    </View>
  );
}

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
