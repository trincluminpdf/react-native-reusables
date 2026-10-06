/**
 * ◆ Lumin in-app — Section Header. Figma: PDF-Mobile-DS › ◆ Section Header (Show icon, Show action).
 * Tokens: 5. Component › section-header/* — px-4 gap-2, title text-base font-semibold, optional icon size-5,
 * action = Button Variant=Link Size=sm ("View all"), hit area 44.
 * Delta vs source: "View all" was below touch-target size.
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { View } from 'react-native';

type SectionHeaderProps = {
  title: string;
  icon?: React.ComponentProps<typeof Icon>['as'];
  actionLabel?: string;
  onActionPress?: () => void;
  className?: string;
};

function SectionHeader({ title, icon, actionLabel, onActionPress, className }: SectionHeaderProps) {
  return (
    <View className={cn('min-h-9 flex-row items-center justify-between gap-2 px-4', className)}>
      <View className="min-w-0 shrink flex-row items-center gap-2">
        {icon ? <Icon as={icon} className="text-foreground size-5 shrink-0" /> : null}
        <Text role="heading" numberOfLines={1} className="text-foreground text-base font-semibold">
          {title}
        </Text>
      </View>
      {actionLabel ? (
        <Button variant="link" size="sm" onPress={onActionPress} className="-mr-3">
          <Text>{actionLabel}</Text>
        </Button>
      ) : null}
    </View>
  );
}

export { SectionHeader };
export type { SectionHeaderProps };
