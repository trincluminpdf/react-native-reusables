/**
 * ◆ Lumin in-app — Banner (inline promo / prompt). Figma: PDF-Mobile-DS › ◆ Banner (Show actions).
 * Tokens: 5. Component › banner/* — bg-card-sky rounded-xl p-4 gap-2 · header: icon size-5 text-card-sky-foreground +
 * title text-sm font-semibold · description text-sm text-muted-foreground · actions right-aligned gap-2:
 * Button Ghost sm (dismiss) + Button default sm (CTA).
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { InfoIcon } from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

type BannerProps = {
  title: string;
  description?: string;
  icon?: React.ComponentProps<typeof Icon>['as'];
  actionLabel?: string;
  onActionPress?: () => void;
  dismissLabel?: string;
  onDismiss?: () => void;
  className?: string;
};

function Banner({
  title,
  description,
  icon = InfoIcon,
  actionLabel,
  onActionPress,
  dismissLabel = 'Not now',
  onDismiss,
  className,
}: BannerProps) {
  const showActions = !!actionLabel || !!onDismiss;
  return (
    <View
      role="region"
      aria-label={title}
      className={cn('bg-card-sky gap-2 rounded-xl p-4', className)}>
      <View className="flex-row items-center gap-2">
        <Icon as={icon} weight="fill" className="text-card-sky-foreground size-5 shrink-0" />
        <Text className="text-foreground flex-1 text-sm font-semibold">{title}</Text>
      </View>
      {description ? <Text className="text-muted-foreground text-sm">{description}</Text> : null}
      {showActions ? (
        <View className="flex-row items-center justify-end gap-2">
          {onDismiss ? (
            <Button variant="ghost" size="sm" onPress={onDismiss}>
              <Text>{dismissLabel}</Text>
            </Button>
          ) : null}
          {actionLabel ? (
            <Button size="sm" onPress={onActionPress}>
              <Text>{actionLabel}</Text>
            </Button>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export { Banner };
export type { BannerProps };
