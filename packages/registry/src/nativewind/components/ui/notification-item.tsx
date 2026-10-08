/**
 * ◆ Lumin in-app (LPM batch) — Notification Item. Figma: PDF-Mobile-DS › 🆕 Notification Item
 * (Status=Unread / Read × Leading=Avatar / Icon; Content, Time, Show actions, Icon).
 * Tokens: 5. Component › notification-item/*.
 * Row in the Notifications screen (tabs General / Invites / Requests). Full-bleed rows, no divider.
 * px-4 py-3 gap-3 · leading size-8 rounded-full: DS Avatar (size default, initials or image) or Icon (system event:
 * bg-background border border-border circle, icon size-4 text-foreground) · text block gap-1: content text-sm
 * text-foreground (up to 3 lines; pass a ReactNode to bold names) + time text-xs text-muted-foreground ·
 * body-gap gap-3 (text block ↔ actions) · actions gap-2: Button Outline sm "Decline" + Default sm "Accept" ·
 * trailing unread dot size-2 rounded-full bg-primary in an h-5 slot aligned with the first line.
 * Unread = bg-muted + dot · Read = bg-background, no dot (the w-2 slot stays so text does not reflow on mark-read).
 * Tap = open + mark read (caller, onPress). The tappable area and the action buttons are siblings; pressed tints the
 * whole row. a11y label = content + time + "unread".
 */
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/nativewind/components/ui/avatar';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon, type IconComponent } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { Pressable, View, type ImageSourcePropType } from 'react-native';

type NotificationLeading =
  | { type: 'avatar'; initials: string; image?: ImageSourcePropType }
  | { type: 'icon'; icon: IconComponent };

type NotificationAction = { label?: string; onPress?: () => void };

type NotificationItemProps = {
  /**
   * String or ReactNode. Bold names / file names with nested `<Text className="text-sm font-semibold">`
   * (ui/Text defaults to text-base, so repeat text-sm on nested spans).
   */
  content: React.ReactNode | string;
  time: string;
  unread?: boolean;
  leading: NotificationLeading;
  /** Show actions. Labels default to "Decline" / "Accept"; omit a key to hide that button. */
  actions?: { decline?: NotificationAction; accept?: NotificationAction };
  onPress?: () => void;
  className?: string;
};

/** Plain text of a ReactNode (for the spoken label when content bolds names). */
function textOf(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (React.isValidElement<{ children?: React.ReactNode }>(node))
    return textOf(node.props.children);
  return '';
}

function Leading({ leading }: { leading: NotificationLeading }) {
  if (leading.type === 'icon') {
    return (
      <View className="bg-background border-border size-8 shrink-0 items-center justify-center rounded-full border">
        <Icon as={leading.icon} className="text-foreground size-4" />
      </View>
    );
  }
  return (
    <Avatar alt={leading.initials} className="shrink-0">
      {leading.image ? <AvatarImage source={leading.image} /> : null}
      <AvatarFallback>
        <Text>{leading.initials}</Text>
      </AvatarFallback>
    </Avatar>
  );
}

function NotificationItem({
  content,
  time,
  unread = false,
  leading,
  actions,
  onPress,
  className,
}: NotificationItemProps) {
  const [pressed, setPressed] = React.useState(false);
  const label = [textOf(content), time, unread ? 'unread' : null].filter(Boolean).join(', ');
  const hasActions = !!(actions?.decline || actions?.accept);

  return (
    <View className={cn(unread ? 'bg-muted' : 'bg-background', pressed && 'bg-accent', className)}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={label}
        className="flex-row items-start gap-3 px-4 py-3">
        <Leading leading={leading} />
        <View className="min-w-0 flex-1 gap-1">
          <Text numberOfLines={3} className="text-foreground text-sm">
            {content}
          </Text>
          <Text numberOfLines={1} className="text-muted-foreground text-xs">
            {time}
          </Text>
        </View>
        <View className="h-5 w-2 shrink-0 justify-center">
          {unread ? <View className="bg-primary size-2 rounded-full" /> : null}
        </View>
      </Pressable>
      {hasActions ? (
        // Same columns as the row above (leading 32 · text · dot 8) so the buttons start under the text.
        // Pressable pb-3 = body-gap gap-3 between the text block and the actions.
        <View className="flex-row gap-3 px-4 pb-3">
          <View className="w-8" />
          <View className="min-w-0 flex-1 flex-row flex-wrap gap-2">
            {actions?.decline ? (
              <Button variant="outline" size="sm" onPress={actions.decline.onPress}>
                <Text>{actions.decline.label ?? 'Decline'}</Text>
              </Button>
            ) : null}
            {actions?.accept ? (
              <Button size="sm" onPress={actions.accept.onPress}>
                <Text>{actions.accept.label ?? 'Accept'}</Text>
              </Button>
            ) : null}
          </View>
          <View className="w-2" />
        </View>
      ) : null}
    </View>
  );
}

export { NotificationItem };
export type { NotificationAction, NotificationItemProps, NotificationLeading };
