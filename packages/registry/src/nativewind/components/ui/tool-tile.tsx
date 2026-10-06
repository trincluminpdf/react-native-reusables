/**
 * ◆ Lumin in-app — Tool Tile. Figma: PDF-Mobile-DS › ◆ Tool Tile (Size=Card / Compact × 14 colors).
 * Tokens: 5. Component › tool-tile/* (bg/fg alias 3. Mode › components/card-*).
 * Card: rounded-2xl p-3 gap-2 · icon container size-10 rounded-full bg-background/80, icon size-5 in card-*-foreground ·
 * text gap-0.5: title text-sm font-medium, description text-xs text-muted-foreground (2 lines).
 * Compact: w-24, icon + title only, centered, title up to 2 lines (Home "Tools" row).
 * Delta vs source: icon/label mismatches fixed; description is never cut mid-word (numberOfLines=2).
 */
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { Pressable, View } from 'react-native';

const TOOL_TILE_COLORS = {
  red: { bg: 'bg-card-red', fg: 'text-card-red-foreground' },
  orange: { bg: 'bg-card-orange', fg: 'text-card-orange-foreground' },
  amber: { bg: 'bg-card-amber', fg: 'text-card-amber-foreground' },
  yellow: { bg: 'bg-card-yellow', fg: 'text-card-yellow-foreground' },
  lime: { bg: 'bg-card-lime', fg: 'text-card-lime-foreground' },
  green: { bg: 'bg-card-green', fg: 'text-card-green-foreground' },
  teal: { bg: 'bg-card-teal', fg: 'text-card-teal-foreground' },
  cyan: { bg: 'bg-card-cyan', fg: 'text-card-cyan-foreground' },
  sky: { bg: 'bg-card-sky', fg: 'text-card-sky-foreground' },
  blue: { bg: 'bg-card-blue', fg: 'text-card-blue-foreground' },
  indigo: { bg: 'bg-card-indigo', fg: 'text-card-indigo-foreground' },
  violet: { bg: 'bg-card-violet', fg: 'text-card-violet-foreground' },
  pink: { bg: 'bg-card-pink', fg: 'text-card-pink-foreground' },
  rose: { bg: 'bg-card-rose', fg: 'text-card-rose-foreground' },
} as const;

type ToolTileColor = keyof typeof TOOL_TILE_COLORS;

type ToolTileProps = {
  title: string;
  description?: string;
  icon: React.ComponentProps<typeof Icon>['as'];
  color?: ToolTileColor;
  size?: 'card' | 'compact';
  onPress?: () => void;
  className?: string;
};

function ToolTile({
  title,
  description,
  icon,
  color = 'blue',
  size = 'card',
  onPress,
  className,
}: ToolTileProps) {
  const c = TOOL_TILE_COLORS[color];
  const compact = size === 'compact';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={description && !compact ? `${title}. ${description}` : title}
      className={cn(
        'rounded-2xl p-3 active:opacity-80',
        c.bg,
        compact ? 'w-24 items-center gap-2' : 'gap-2',
        className
      )}>
      <View className="bg-background/80 size-10 items-center justify-center rounded-full">
        <Icon as={icon} className={cn('size-5', c.fg)} />
      </View>
      {compact ? (
        <Text numberOfLines={2} className="text-foreground text-center text-xs font-medium">
          {title}
        </Text>
      ) : (
        <View className="gap-0.5">
          <Text numberOfLines={1} className="text-foreground text-sm font-medium">
            {title}
          </Text>
          {description ? (
            <Text numberOfLines={2} className="text-muted-foreground text-xs">
              {description}
            </Text>
          ) : null}
        </View>
      )}
    </Pressable>
  );
}

export { TOOL_TILE_COLORS, ToolTile };
export type { ToolTileColor, ToolTileProps };
