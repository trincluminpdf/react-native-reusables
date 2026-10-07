/**
 * ◆ Lumin custom (Material 3 assist / input chips; Apple HIG token fields). Figma: PDF-Mobile-DS › ◆ Chip
 * (Assist Chip, Input Chip: State=Default/Pressed/Disabled). Tokens: 5. Component › chip/*
 * Filter chips already exist (◆ Filter Chip, In-app). Suggestion chip = Assist without an icon.
 *
 * - Both: h-9 (Tablet sm:h-8) rounded-full like ◆ Filter Chip (M3 chips are 32 / radius 8), gap-1.5,
 *   icon size-4, label text-sm font-medium, disabled opacity-50, hit area 44 (hitSlop).
 * - variant="assist": border border-border bg-background (dark bg-input/30) px-3; pressed bg-accent
 *   (dark bg-input/50). A smart action / suggestion ("Add signature", "Summarize").
 * - variant="input": bg-secondary, pl-3, trailing Remove (X size-3.5 in a size-6 circle, 44 hit area, pr-1);
 *   pressed bg-secondary/80. A value the user entered (signer emails, tags). The remove button is a sibling
 *   of the label button (no button inside a button on web).
 * - ChipGroup: flex-row flex-wrap gap-2.
 */
import { Icon, type IconComponent } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { XIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View, type ViewProps } from 'react-native';

type ChipProps = {
  label: string;
  variant?: 'assist' | 'input';
  icon?: IconComponent;
  onPress?: () => void;
  /** Input chip: shows the Remove button. */
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
};

function Chip({
  label,
  variant = 'assist',
  icon,
  onPress,
  onRemove,
  disabled = false,
  className,
}: ChipProps) {
  const [pressed, setPressed] = React.useState(false);

  if (variant === 'assist') {
    return (
      <Pressable
        role="button"
        accessibilityLabel={label}
        disabled={disabled}
        onPress={onPress}
        hitSlop={{ top: 4, bottom: 4 }}
        className={cn(
          'border-border bg-background dark:bg-input/30 active:bg-accent dark:active:bg-input/50 h-9 flex-row items-center gap-1.5 self-start rounded-full border px-3 sm:h-8',
          disabled && 'opacity-50',
          className
        )}>
        {icon ? <Icon as={icon} size={16} className="text-foreground size-4" /> : null}
        <Text numberOfLines={1} className="text-foreground text-sm font-medium">
          {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <View
      className={cn(
        'h-9 flex-row items-center gap-1.5 self-start rounded-full pl-3 sm:h-8',
        pressed ? 'bg-secondary/80' : 'bg-secondary',
        onRemove ? 'pr-1' : 'pr-3',
        disabled && 'opacity-50',
        className
      )}>
      <Pressable
        role="button"
        accessibilityLabel={label}
        disabled={disabled || !onPress}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        hitSlop={{ top: 4, bottom: 4 }}
        className="flex-row items-center gap-1.5">
        {icon ? <Icon as={icon} size={16} className="text-secondary-foreground size-4" /> : null}
        <Text numberOfLines={1} className="text-secondary-foreground text-sm font-medium">
          {label}
        </Text>
      </Pressable>
      {onRemove ? (
        <Pressable
          role="button"
          accessibilityLabel={`Remove ${label}`}
          disabled={disabled}
          onPress={onRemove}
          hitSlop={10}
          className="active:bg-foreground/10 size-6 items-center justify-center rounded-full">
          <Icon as={XIcon} size={14} className="text-secondary-foreground size-3.5" />
        </Pressable>
      ) : null}
    </View>
  );
}

function ChipGroup({ className, ...props }: ViewProps) {
  return <View className={cn('flex-row flex-wrap gap-2', className)} {...props} />;
}

export { Chip, ChipGroup };
export type { ChipProps };
