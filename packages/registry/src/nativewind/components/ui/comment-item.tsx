/**
 * ◆ Lumin in-app (LPM batch) — Comment Item. Figma: PDF-Mobile-DS › 🆕 Comment Item
 * (Type=Card / Detail × State=Default / Resolved; Show replies, Show resolve).
 * Tokens: 5. Component › comment-item/*.
 * A comment (or annotation note) in the Comments list and at the top of a thread.
 * - Card (list): p-4 gap-2 rounded-lg border border-border bg-background (Resolved bg-muted) — ONE Pressable
 *   (tap → thread, no inner buttons, pressed bg-accent). Header gap-3: type tile · name/date (gap-0.5) ·
 *   reply count trailing (text-xs muted). Comment text-sm clamps to 2 lines. Resolved = Outline Badge
 *   "Resolved by <name>" (ph-check-circle fill) above the header.
 * - Detail (thread head + replies): same paddings without the card; header actions gap-1 = Button ghost icon
 *   Resolve (ph-check-circle; fill when resolved → label "Reopen") + More (ph-dots-three). Full text;
 *   Resolved → text-muted-foreground. Show resolve off on replies (only the root resolves a thread).
 * Type tile size-10 rounded-md bg-background border border-border, icon size-5 in the annotation color
 * (default comment color #035970, ph-chat-text). Group cards under a ◆ Section Header per page ("Page 1").
 */
import { Badge } from '@/registry/nativewind/components/ui/badge';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon, type IconComponent } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { ChatTextIcon, CheckCircleIcon, DotsThreeIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

/** Default annotation color of a comment (Figma: comment note color). */
const COMMENT_DEFAULT_COLOR = '#035970';

type CommentItemProps = {
  type?: 'card' | 'detail';
  resolved?: boolean;
  /** Card: "Resolved by <name>" badge. */
  resolvedBy?: string;
  name: string;
  date: string;
  comment: string;
  /** Card: reply count shown trailing in the header, e.g. "5 replies". */
  replies?: string;
  /** Detail: show the Resolve button (off on replies). Default true. */
  showResolve?: boolean;
  /** Annotation type icon (default ph-chat-text = comment). */
  typeIcon?: IconComponent;
  /** Annotation color for the type icon (default #035970). */
  typeColor?: string;
  onPress?: () => void;
  onResolvePress?: () => void;
  onMorePress?: () => void;
  className?: string;
};

function TypeTile({ icon: TypeIcon, color }: { icon: IconComponent; color: string }) {
  return (
    <View className="bg-background border-border size-10 shrink-0 items-center justify-center rounded-md border">
      {/* Rendered directly: the annotation color is data, not a theme token. */}
      <TypeIcon size={20} color={color} />
    </View>
  );
}

function Who({ name, date }: { name: string; date: string }) {
  return (
    <View className="min-w-0 flex-1 gap-0.5">
      <Text numberOfLines={1} className="text-foreground text-sm font-medium">
        {name}
      </Text>
      <Text numberOfLines={1} className="text-muted-foreground text-xs">
        {date}
      </Text>
    </View>
  );
}

function CommentItem({
  type = 'card',
  resolved = false,
  resolvedBy,
  name,
  date,
  comment,
  replies,
  showResolve = true,
  typeIcon = ChatTextIcon,
  typeColor = COMMENT_DEFAULT_COLOR,
  onPress,
  onResolvePress,
  onMorePress,
  className,
}: CommentItemProps) {
  if (type === 'detail') {
    return (
      <View className={cn('gap-2 p-4', className)}>
        <View className="flex-row items-center gap-3">
          <TypeTile icon={typeIcon} color={typeColor} />
          <Who name={name} date={date} />
          <View className="flex-row items-center gap-1">
            {showResolve ? (
              <Button
                variant="ghost"
                size="icon"
                onPress={onResolvePress}
                accessibilityLabel={resolved ? 'Reopen' : 'Resolve'}>
                <Icon
                  as={CheckCircleIcon}
                  weight={resolved ? 'fill' : 'regular'}
                  className="text-foreground size-5"
                />
              </Button>
            ) : null}
            <Button variant="ghost" size="icon" onPress={onMorePress} accessibilityLabel="More">
              <Icon as={DotsThreeIcon} weight="bold" className="text-foreground size-5" />
            </Button>
          </View>
        </View>
        <Text className={cn('text-sm', resolved ? 'text-muted-foreground' : 'text-foreground')}>
          {comment}
        </Text>
      </View>
    );
  }

  const resolvedLabel = resolvedBy ? `Resolved by ${resolvedBy}` : 'Resolved';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={[resolved ? resolvedLabel : null, name, date, comment, replies]
        .filter(Boolean)
        .join(', ')}
      accessibilityHint="Opens the thread"
      className={cn(
        'border-border active:bg-accent gap-2 rounded-lg border p-4',
        resolved ? 'bg-muted' : 'bg-background',
        className
      )}>
      {resolved ? (
        <Badge variant="outline" className="self-start">
          <Icon as={CheckCircleIcon} weight="fill" size={12} className="size-3" />
          <Text numberOfLines={1}>{resolvedLabel}</Text>
        </Badge>
      ) : null}
      <View className="flex-row items-center gap-3">
        <TypeTile icon={typeIcon} color={typeColor} />
        <Who name={name} date={date} />
        {replies ? (
          <Text numberOfLines={1} className="text-muted-foreground shrink-0 text-xs">
            {replies}
          </Text>
        ) : null}
      </View>
      <Text numberOfLines={2} className="text-foreground text-sm">
        {comment}
      </Text>
    </Pressable>
  );
}

export { COMMENT_DEFAULT_COLOR, CommentItem };
export type { CommentItemProps };
