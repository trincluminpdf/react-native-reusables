/**
 * ◆ Lumin in-app — Filter Chip + Filter Chips row. Figma: PDF-Mobile-DS › ◆ Filter Chips
 * (Filter Chip: Active=Off/On × State=Default/Disabled; Filter Chips: Show view toggle).
 * Tokens: 5. Component › filter-chip/* — h-9 (Tablet sm:h-8) px-4 (sm:px-3) rounded-full, text-sm font-medium.
 * Active = bg-input (dark bg-input/80) + text-foreground; Off = transparent + text-muted-foreground;
 * Disabled = opacity-50. Hit area 44 (hitSlop). Row: px-4, chips gap-1 scroll horizontally, optional
 * list/grid view toggle (Button Ghost icon) on the right.
 * Delta vs source: "Stared" typo → "Starred"; view toggle had no touch target.
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { RowsIcon, SquaresFourIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

type FilterChipProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  className?: string;
};

function FilterChip({
  label,
  active = false,
  disabled = false,
  onPress,
  className,
}: FilterChipProps) {
  return (
    <Pressable
      role="radio"
      aria-checked={active}
      accessibilityState={{ selected: active, disabled }}
      disabled={disabled}
      onPress={onPress}
      hitSlop={{ top: 4, bottom: 4 }}
      className={cn(
        'h-9 items-center justify-center rounded-full px-4 sm:h-8 sm:px-3',
        active ? 'bg-input dark:bg-input/80' : 'active:bg-accent/60 bg-transparent',
        disabled && 'opacity-50',
        className
      )}>
      <Text
        numberOfLines={1}
        className={cn('text-sm font-medium', active ? 'text-foreground' : 'text-muted-foreground')}>
        {label}
      </Text>
    </Pressable>
  );
}

type FilterChipsProps<T extends string> = {
  options: readonly { value: T; label: string; disabled?: boolean }[];
  value: T;
  onValueChange: (value: T) => void;
  /** Shows the list/grid toggle on the right (Show view toggle=true). */
  view?: 'list' | 'grid';
  onViewChange?: (view: 'list' | 'grid') => void;
  className?: string;
};

function FilterChips<T extends string>({
  options,
  value,
  onValueChange,
  view,
  onViewChange,
  className,
}: FilterChipsProps<T>) {
  return (
    <View
      className={cn('h-10 flex-row items-center gap-2 pl-4', view ? 'pr-2' : 'pr-4', className)}>
      <ScrollView
        horizontal
        role="radiogroup"
        showsHorizontalScrollIndicator={false}
        className="flex-1"
        contentContainerClassName="gap-1 items-center">
        {options.map((o) => (
          <FilterChip
            key={o.value}
            label={o.label}
            active={o.value === value}
            disabled={o.disabled}
            onPress={() => onValueChange(o.value)}
          />
        ))}
      </ScrollView>
      {view ? (
        <Button
          variant="ghost"
          size="icon"
          accessibilityLabel={view === 'list' ? 'Show as grid' : 'Show as list'}
          onPress={() => onViewChange?.(view === 'list' ? 'grid' : 'list')}>
          <Icon
            as={view === 'list' ? SquaresFourIcon : RowsIcon}
            className="text-foreground size-5"
          />
        </Button>
      ) : null}
    </View>
  );
}

export { FilterChip, FilterChips };
export type { FilterChipProps, FilterChipsProps };
