/**
 * ◆ Lumin in-app (LPM batch) — Form Field. Figma: PDF-Mobile-DS › 🆕 Form Field
 * (Type=Text / Signature / Checkbox / Radio × State=Build / Empty / Filled; Placeholder, Value).
 * Tokens: 5. Component › form-field/*.
 * Fillable field drawn on the PDF page, anchored to page coordinates (sizes at 100% zoom).
 * - Text / Signature: h-10 (40), width from the caller (`width`, else it stretches), px-2 py-2 gap-2,
 *   rounded-sm border, type icon size-6 + placeholder text-sm (1 line).
 * - Checkbox / Radio: control size-8 (32) p-1, rounded-sm (radio rounded-full); filled = ph-check size-6 /
 *   dot size-3 rounded-full bg-foreground. hitSlop 6 → 44.
 * - Build (Prepare form): bg-blue-50 border-blue-500 + icon/placeholder text-blue-600 (dark: blue-950 / blue-600 /
 *   blue-400). Checkbox / Radio in Build = tinted box, no icon.
 * - Empty (fill-in): bg-muted border-input, icon + placeholder text-muted-foreground.
 * - Filled: value only (text-sm text-foreground) / ink for Signature (children, default ◆ SignatureInk).
 * `selected` draws nothing extra — the caller overlays ◆ Annotation Selection.
 * Also exports TextTPlusIcon (lm-text-t-plus, 24 grid, stroke 1.5 round) and SignatureInk (demo ink path that
 * follows text color through <Icon>, so it switches with dark mode).
 */
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { CheckIcon, SignatureIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type SvgIconProps = { size?: number | string; color?: string; style?: unknown };

/** lm-text-t-plus — "T" with a small "+" on the left (24 grid, stroke 1.5, round caps). */
function TextTPlusIcon({ size = 24, color = 'currentColor', style }: SvgIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={style as any}>
      <Path
        d="M7 8.25V5.25H22V8.25M14.5 6V18.75M10.75 18.75H18.25M2.75 13.5H7.25M5 11.25V15.75"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

const INK_WIDTH = 142.5;
const INK_HEIGHT = 32.45;
const INK_PATH =
  'M 0 29.46 C 5.625 -2.41 16.875 -8.04 18.75 10.71 C 20.625 29.46 9.375 38.84 7.5 27.59 C 5.625 16.34 28.125 1.34 33.75 14.46 C 37.5 23.84 35.625 33.21 43.125 21.96 C 50.625 10.71 54.375 8.84 56.25 20.09 C 58.125 31.34 65.625 27.59 71.25 14.46 C 75 5.09 82.5 6.96 82.5 18.21 C 82.5 29.46 91.875 23.84 97.5 14.46 C 103.125 5.09 110.625 12.59 116.25 8.84 C 123.75 3.21 133.125 5.09 142.5 1.34';

type InkSize = number | string;

function InkSvg({
  width,
  height,
  color = 'currentColor',
  style,
}: {
  width?: InkSize;
  height?: InkSize;
  color?: string;
  style?: unknown;
  size?: number | string;
}) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${INK_WIDTH} ${INK_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={style as any}>
      <Path
        d={INK_PATH}
        stroke={color}
        strokeWidth={1.875}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

type SignatureInkProps = {
  /** Number (px) or percentage. One number keeps the ink's aspect (142.5 × 32.45); default = 100% size. */
  width?: InkSize;
  height?: InkSize;
  /** Text color class for the stroke (default text-foreground → follows dark mode). */
  className?: string;
  /** Explicit stroke color (skips className). */
  color?: string;
};

/** Demo signature ink (react-native-svg). Scales like object-contain inside the given box. */
function SignatureInk({ width, height, className, color }: SignatureInkProps) {
  let w = width;
  let h = height;
  if (w === undefined && h === undefined) {
    w = INK_WIDTH;
    h = INK_HEIGHT;
  } else if (w === undefined && typeof h === 'number') {
    w = (h * INK_WIDTH) / INK_HEIGHT;
  } else if (h === undefined && typeof w === 'number') {
    h = (w * INK_HEIGHT) / INK_WIDTH;
  }
  if (color) return <InkSvg width={w} height={h} color={color} />;
  // Through <Icon> so the className text color becomes the stroke (cssInterop on native, currentColor on web).
  return (
    <Icon
      as={InkSvg}
      className={cn('text-foreground', className)}
      width={w}
      height={h}
      accessibilityElementsHidden
      importantForAccessibility="no"
    />
  );
}

type FormFieldType = 'text' | 'signature' | 'checkbox' | 'radio';
type FormFieldState = 'build' | 'empty' | 'filled';

type FormFieldProps = {
  type: FormFieldType;
  state: FormFieldState;
  /** Text: e.g. "Full name". Signature defaults to "Sign here". */
  placeholder?: string;
  /** Text value shown when State=Filled. */
  value?: string;
  /** Checkbox / Radio: on. Defaults to state === 'filled'. */
  checked?: boolean;
  /** Signature ink for State=Filled (default: ◆ SignatureInk). */
  children?: React.ReactNode;
  /** Text / Signature width in page px at 100%. Omit to stretch. */
  width?: number;
  onPress?: () => void;
  /** Draws nothing extra — the caller overlays ◆ Annotation Selection. Exposed to a11y. */
  selected?: boolean;
  className?: string;
};

const BUILD_BOX = 'bg-blue-50 dark:bg-blue-950 border-blue-500 dark:border-blue-600';
const BUILD_TEXT = 'text-blue-600 dark:text-blue-400';

function FormField({
  type,
  state,
  placeholder,
  value,
  checked,
  children,
  width,
  onPress,
  selected,
  className,
}: FormFieldProps) {
  const build = state === 'build';

  if (type === 'checkbox' || type === 'radio') {
    const on = !build && (checked ?? state === 'filled');
    const radio = type === 'radio';
    return (
      <Pressable
        onPress={onPress}
        hitSlop={6}
        accessibilityRole={radio ? 'radio' : 'checkbox'}
        accessibilityLabel={placeholder}
        accessibilityState={{ checked: on, selected }}
        className={cn(
          'size-8 items-center justify-center border p-1 active:opacity-70',
          radio ? 'rounded-full' : 'rounded-sm',
          build ? BUILD_BOX : 'bg-muted border-input',
          className
        )}>
        {on ? (
          radio ? (
            <View className="bg-foreground size-3 rounded-full" />
          ) : (
            <Icon as={CheckIcon} className="text-foreground size-6" />
          )
        ) : null}
      </Pressable>
    );
  }

  const signature = type === 'signature';
  const label = placeholder ?? (signature ? 'Sign here' : '');
  const filled = state === 'filled';
  const typeIcon = signature ? SignatureIcon : TextTPlusIcon;

  return (
    <Pressable
      onPress={onPress}
      hitSlop={2}
      accessibilityRole="button"
      accessibilityLabel={
        filled ? (signature ? `${label || 'Signature'}, signed` : value || label) : label || type
      }
      accessibilityState={{ selected }}
      style={width !== undefined ? { width } : undefined}
      className={cn(
        'h-10 flex-row items-center gap-2 rounded-sm border px-2 py-2 active:opacity-70',
        build ? BUILD_BOX : 'bg-muted border-input',
        className
      )}>
      {filled ? (
        signature ? (
          <View className="h-6 min-w-0 flex-1 items-start justify-center">
            {children ?? <SignatureInk height={24} />}
          </View>
        ) : (
          <Text numberOfLines={1} className="text-foreground min-w-0 flex-1 text-sm">
            {value}
          </Text>
        )
      ) : (
        <>
          <Icon
            as={typeIcon}
            className={cn('size-6 shrink-0', build ? BUILD_TEXT : 'text-muted-foreground')}
          />
          {label ? (
            <Text
              numberOfLines={1}
              className={cn(
                'min-w-0 flex-1 text-sm',
                build ? BUILD_TEXT : 'text-muted-foreground'
              )}>
              {label}
            </Text>
          ) : null}
        </>
      )}
    </Pressable>
  );
}

export { FormField, SignatureInk, TextTPlusIcon };
export type { FormFieldProps, FormFieldState, FormFieldType, SignatureInkProps };
