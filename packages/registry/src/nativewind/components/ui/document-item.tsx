/**
 * ◆ Lumin in-app — Document Item. Figma: PDF-Mobile-DS › ◆ Document Item (Layout=List / Grid × State=Default / Pressed;
 * Starred, Show date, Source icon).
 * Tokens: 5. Component › document-item/*.
 * List: px-4 py-3 gap-3, bottom border · thumb size-10 rounded-md bg-muted border, file icon size-5 ·
 *   text gap-0.5: title text-base font-medium (1 line), meta gap-1: source icon size-4 · owner · "·" · date (text-xs muted) ·
 *   More = Button Ghost icon.
 * Grid: column gap-2 · thumb aspect 4:3 rounded-xl · title text-sm font-medium + date only (owner hidden so the meta never wraps).
 * Pressed tints the whole row (bg-accent); More is a sibling button (no button inside a button). Starred = ph-star-fill size-4 text-yellow-400 on the thumb corner.
 */
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { DotsThreeIcon, FileTextIcon, StarIcon, UserIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Image, Pressable, View, type ImageSourcePropType } from 'react-native';

type DocumentItemProps = {
  title: string;
  owner?: string;
  date?: string;
  starred?: boolean;
  layout?: 'list' | 'grid';
  /** Source of the file (owner / Drive / Dropbox …). Default ph-user. */
  sourceIcon?: React.ComponentProps<typeof Icon>['as'];
  thumbnail?: ImageSourcePropType;
  onPress?: () => void;
  onMorePress?: () => void;
  /** Hide the bottom divider (last row). List only. */
  last?: boolean;
  className?: string;
};

function Thumb({
  thumbnail,
  starred,
  grid,
}: {
  thumbnail?: ImageSourcePropType;
  starred?: boolean;
  grid?: boolean;
}) {
  return (
    <View
      className={cn(
        'bg-muted border-border items-center justify-center overflow-visible border',
        grid ? 'aspect-[4/3] w-full rounded-xl' : 'size-10 rounded-md'
      )}>
      {thumbnail ? (
        <Image
          source={thumbnail}
          className={cn('size-full', grid ? 'rounded-xl' : 'rounded-md')}
          resizeMode="cover"
        />
      ) : (
        <Icon as={FileTextIcon} className="text-muted-foreground size-5" />
      )}
      {starred ? (
        <View className={cn('absolute', grid ? 'left-2 top-2' : '-left-1 -top-1')}>
          <Icon as={StarIcon} weight="fill" className="size-4 text-yellow-400" />
        </View>
      ) : null}
    </View>
  );
}

function DocumentItem({
  title,
  owner,
  date,
  starred,
  layout = 'list',
  sourceIcon = UserIcon,
  thumbnail,
  onPress,
  onMorePress,
  last,
  className,
}: DocumentItemProps) {
  // Row = tappable area + separate More button (no button-in-button); pressed tints the whole row.
  const [pressed, setPressed] = React.useState(false);
  const more = (
    <Button
      variant="ghost"
      size="icon"
      onPress={onMorePress}
      accessibilityLabel={`More actions for ${title}`}>
      <Icon as={DotsThreeIcon} weight="bold" className="text-foreground size-5" />
    </Button>
  );

  if (layout === 'grid') {
    return (
      <View className={cn('flex-1 gap-2 rounded-xl', pressed && 'bg-accent', className)}>
        <Pressable
          onPress={onPress}
          onPressIn={() => setPressed(true)}
          onPressOut={() => setPressed(false)}
          accessibilityRole="button"
          accessibilityLabel={[title, starred ? 'starred' : null, date].filter(Boolean).join(', ')}>
          <Thumb thumbnail={thumbnail} starred={starred} grid />
        </Pressable>
        <View className="flex-row items-center gap-1">
          <Pressable
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            importantForAccessibility="no"
            accessibilityElementsHidden
            className="min-w-0 flex-1 gap-0.5 pl-0.5">
            <Text numberOfLines={1} className="text-foreground text-sm font-medium">
              {title}
            </Text>
            {date ? (
              <Text numberOfLines={1} className="text-muted-foreground text-xs">
                {date}
              </Text>
            ) : null}
          </Pressable>
          {more}
        </View>
      </View>
    );
  }

  return (
    <View
      className={cn(
        'flex-row items-center gap-3 pr-4',
        pressed && 'bg-accent',
        !last && 'border-border border-b',
        className
      )}>
      <Pressable
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole="button"
        accessibilityLabel={[title, starred ? 'starred' : null, owner, date]
          .filter(Boolean)
          .join(', ')}
        className="min-w-0 flex-1 flex-row items-center gap-3 py-3 pl-4">
        <Thumb thumbnail={thumbnail} starred={starred} />
        <View className="min-w-0 flex-1 gap-0.5">
          <Text numberOfLines={1} className="text-foreground text-base font-medium">
            {title}
          </Text>
          <View className="flex-row items-center gap-1">
            <Icon as={sourceIcon} className="text-muted-foreground size-4 shrink-0" />
            {owner ? (
              <Text numberOfLines={1} className="text-muted-foreground shrink text-xs">
                {owner}
              </Text>
            ) : null}
            {owner && date ? <Text className="text-muted-foreground text-xs">·</Text> : null}
            {date ? (
              <Text numberOfLines={1} className="text-muted-foreground text-xs">
                {date}
              </Text>
            ) : null}
          </View>
        </View>
      </Pressable>
      {more}
    </View>
  );
}

export { DocumentItem };
export type { DocumentItemProps };
