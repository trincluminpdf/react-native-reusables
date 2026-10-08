/**
 * ◆ Lumin in-app (LPM batch) — Signature Validation. Figma: PDF-Mobile-DS › 🆕 Signature
 * (Signature Validation: Status=Valid / Invalid × Expanded=No / Yes; Signer, Email).
 * Tokens: 5. Component › signature-validation/* — bg-muted rounded-lg p-3 gap-3 · text-gap gap-0.5 ·
 * body-gap gap-1 · icon size-6 text-foreground · badge size-3 rounded-full on a bg-background ring ·
 * caret size-5 · valid text-green-600 · invalid text-amber-600 · title text-sm font-medium text-foreground ·
 * email text-sm text-muted-foreground · body text-sm text-foreground · link text-sm font-medium text-primary underline.
 * One digital signature in the Signature certificate sheet: who signed + validity.
 * Icon = lm-signature-field (◆ SignatureFieldIcon, defined here: rounded rect 21×16 + scribble, stroke 1.5) with a
 * status badge bottom-right (Valid = ph-check-circle fill green-600, Invalid = ph-warning-circle fill amber-600).
 * Header = the whole row's tap target (button, accessibilityState.expanded), caret-down / caret-up trailing.
 * Expanded body sits under the text column (pl-12 = p-3 + icon 24 + gap-3): checks (text-sm) + ONE link action
 * (hitSlop → 44). Body is a sibling of the header (no button in a button); pressed tints the card (bg-input).
 * Controlled (`expanded` + `onExpandedChange`) or uncontrolled (`defaultExpanded`).
 */
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import {
  CaretDownIcon,
  CaretUpIcon,
  CheckCircleIcon,
  WarningCircleIcon,
} from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

type SvgIconProps = { size?: number | string; color?: string; style?: unknown };

/** lm-signature-field — rounded rect 21×16 with a signature scribble (24 grid, stroke 1.5). */
function SignatureFieldIcon({ size = 24, color = 'currentColor', style }: SvgIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={style as any}>
      <Path
        d="M3.5 4h17a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-17a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        fill="none"
      />
      <Path
        d="M5.5 13.5c1-3 2.25-4.25 2.75-3s-.75 4 .25 4 1.75-2.75 2.75-2.75.75 2 1.75 2 1.5-1.5 2.5-1.75 1.25.75 2 .5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

type SignatureValidationProps = {
  /** Title, e.g. "Signed by Alex Morgan". */
  signer: string;
  email: string;
  status: 'valid' | 'invalid';
  /** Expanded body lines. Default: valid → "Signature is valid", "Signer's identity is valid"; invalid → "Signature is invalid". */
  checks?: string[];
  /** The one link action. Default: valid → "View certificate details"; invalid → "Create certified version". */
  linkLabel?: string;
  onLinkPress?: () => void;
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  className?: string;
};

const DEFAULT_CHECKS: Record<SignatureValidationProps['status'], string[]> = {
  valid: ['Signature is valid', "Signer's identity is valid"],
  invalid: ['Signature is invalid'],
};

const DEFAULT_LINK: Record<SignatureValidationProps['status'], string> = {
  valid: 'View certificate details',
  invalid: 'Create certified version',
};

function SignatureValidation({
  signer,
  email,
  status,
  checks,
  linkLabel,
  onLinkPress,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  className,
}: SignatureValidationProps) {
  const [inner, setInner] = React.useState(defaultExpanded);
  const expanded = expandedProp ?? inner;
  const [pressed, setPressed] = React.useState(false);
  const valid = status === 'valid';
  const lines = checks ?? DEFAULT_CHECKS[status];
  const link = linkLabel ?? DEFAULT_LINK[status];

  const toggle = () => {
    const next = !expanded;
    if (expandedProp === undefined) setInner(next);
    onExpandedChange?.(next);
  };

  return (
    <View className={cn('bg-muted rounded-lg', pressed && 'bg-input', className)}>
      <Pressable
        onPress={toggle}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole="button"
        accessibilityLabel={`${signer}, ${email}, ${valid ? 'valid' : 'invalid'} signature`}
        accessibilityState={{ expanded }}
        className="flex-row items-center gap-3 p-3">
        <View className="size-6 shrink-0">
          <Icon as={SignatureFieldIcon} className="text-foreground size-6" />
          <View className="bg-background absolute -bottom-0.5 -right-1 rounded-full p-px">
            <Icon
              as={valid ? CheckCircleIcon : WarningCircleIcon}
              weight="fill"
              size={12}
              className={cn('size-3', valid ? 'text-green-600' : 'text-amber-600')}
            />
          </View>
        </View>
        <View className="min-w-0 flex-1 gap-0.5">
          <Text numberOfLines={1} className="text-foreground text-sm font-medium">
            {signer}
          </Text>
          <Text numberOfLines={1} className="text-muted-foreground text-sm">
            {email}
          </Text>
        </View>
        <Icon
          as={expanded ? CaretUpIcon : CaretDownIcon}
          className="text-foreground size-5 shrink-0"
        />
      </Pressable>
      {expanded ? (
        <View className="gap-1 pb-3 pl-12 pr-3">
          {lines.map((line) => (
            <Text key={line} className="text-foreground text-sm">
              {line}
            </Text>
          ))}
          {link ? (
            <Pressable
              onPress={onLinkPress}
              hitSlop={{ top: 12, bottom: 12, left: 4, right: 4 }}
              accessibilityRole="link"
              className="self-start active:opacity-60">
              <Text className="text-primary text-sm font-medium underline">{link}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export { SignatureFieldIcon, SignatureValidation };
export type { SignatureValidationProps };
