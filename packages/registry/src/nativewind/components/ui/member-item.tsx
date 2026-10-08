/**
 * ◆ Lumin in-app (LPM batch) — Member Item. Figma: PDF-Mobile-DS › 🆕 Member Item
 * (Trailing=More / Permission / Label / Actions (inline) / Actions (below) / None × State=Default / Selected;
 * Name, Show you, Meta, Show meta, Email, Label).
 * Tokens: 5. Component › member-item/*.
 * One person in a member / access list (Workspace › People, Share › People with access).
 * Row px-3 py-3 gap-3 rounded-lg · leading DS Avatar lg (size-10, initials or image) · text gap-0.5:
 *   name text-sm font-medium text-foreground (truncates) + "(You)" text-muted-foreground (inline gap-1) ·
 *   meta line on ONE line = meta text-sm text-foreground + " · " + email text-sm text-muted-foreground (truncates).
 * Trailing: More = Button Ghost icon (ph-dots-three → actions sheet) · Permission = Button Ghost sm, text + ph-caret-down
 *   (→ access menu) · Label = read-only text-sm muted · Actions (inline) = Outline sm + Default sm, gap-2 ·
 *   Actions (below) = Outline + Default, each flex-1, gap-2, spanning the row width under avatar + text · None.
 * State=Selected (multi-select): check circle size-10 rounded-full bg-primary (ph-check size-5 text-primary-foreground)
 *   replaces the avatar, row bg-accent.
 * Tappable area (avatar + text, + read-only label) and the trailing buttons are siblings (no button inside a button);
 * pressed tints the whole row. Separators belong to the list, not the row.
 */
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/nativewind/components/ui/avatar';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { CaretDownIcon, CheckIcon, DotsThreeIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Platform, Pressable, View, type ImageSourcePropType } from 'react-native';

type MemberItemTrailing =
  | 'more'
  | 'permission'
  | 'label'
  | 'actions-inline'
  | 'actions-below'
  | 'none';

type MemberItemAction = { label: string; onPress?: () => void };

type MemberItemProps = {
  name: string;
  /** Show "(You)" after the name. */
  you?: boolean;
  /** Role or request text: Owner, Admin, Wants to edit, Requests to join… */
  meta?: string;
  email?: string;
  /** Default: initials from `name`. */
  avatar?: { initials: string; image?: ImageSourcePropType };
  trailing?: MemberItemTrailing;
  /** Trailing=Permission text. Default "Can edit". */
  permission?: string;
  /** Trailing=Label read-only access text, e.g. "Doc owner". */
  label?: string;
  /** Trailing=Actions (inline / below). Default Reject (secondary) + Accept (primary). */
  actions?: { secondary: MemberItemAction; primary: MemberItemAction };
  /** State=Selected (multi-select). */
  selected?: boolean;
  onPress?: () => void;
  onMorePress?: () => void;
  onPermissionPress?: () => void;
  className?: string;
};

const DEFAULT_ACTIONS = { secondary: { label: 'Reject' }, primary: { label: 'Accept' } };

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

function MemberItem({
  name,
  you = false,
  meta,
  email,
  avatar,
  trailing = 'more',
  permission = 'Can edit',
  label,
  actions = DEFAULT_ACTIONS,
  selected = false,
  onPress,
  onMorePress,
  onPermissionPress,
  className,
}: MemberItemProps) {
  const [pressed, setPressed] = React.useState(false);
  const below = trailing === 'actions-below';
  // Trailing that is a control → sibling of the tappable area; read-only trailing stays inside it.
  const siblingTrailing =
    trailing === 'more' || trailing === 'permission' || trailing === 'actions-inline';

  const actionButtons = (fill: boolean) => (
    <>
      <Button
        variant="outline"
        size="sm"
        onPress={actions.secondary.onPress}
        accessibilityLabel={`${actions.secondary.label}, ${name}`}
        className={cn(fill && 'flex-1')}>
        <Text>{actions.secondary.label}</Text>
      </Button>
      <Button
        size="sm"
        onPress={actions.primary.onPress}
        accessibilityLabel={`${actions.primary.label}, ${name}`}
        className={cn(fill && 'flex-1')}>
        <Text>{actions.primary.label}</Text>
      </Button>
    </>
  );

  const main = (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={[
        name,
        you ? 'you' : null,
        meta,
        email,
        trailing === 'label' ? label : null,
        // Native reads accessibilityState; web screen readers ignore aria-selected on a button.
        selected && Platform.OS === 'web' ? 'selected' : null,
      ]
        .filter(Boolean)
        .join(', ')}
      accessibilityState={{ selected }}
      className={cn(
        'min-w-0 flex-1 flex-row items-center gap-3 py-3 pl-3',
        !siblingTrailing && 'pr-3'
      )}>
      {selected ? (
        <View className="bg-primary size-10 shrink-0 items-center justify-center rounded-full">
          <Icon as={CheckIcon} className="text-primary-foreground size-5" />
        </View>
      ) : (
        <Avatar alt={name} size="lg">
          {avatar?.image ? <AvatarImage source={avatar.image} /> : null}
          <AvatarFallback>
            <Text>{avatar?.initials ?? initialsOf(name)}</Text>
          </AvatarFallback>
        </Avatar>
      )}
      <View className="min-w-0 flex-1 gap-0.5">
        <View className="flex-row items-center gap-1">
          <Text numberOfLines={1} className="text-foreground shrink text-sm font-medium">
            {name}
          </Text>
          {you ? <Text className="text-muted-foreground shrink-0 text-sm">(You)</Text> : null}
        </View>
        {meta || email ? (
          <Text numberOfLines={1} className="text-muted-foreground text-sm">
            {meta ? <Text className="text-foreground text-sm">{meta}</Text> : null}
            {meta && email ? ' · ' : null}
            {email}
          </Text>
        ) : null}
      </View>
      {trailing === 'label' && label ? (
        <Text numberOfLines={1} className="text-muted-foreground shrink-0 text-sm">
          {label}
        </Text>
      ) : null}
    </Pressable>
  );

  const rowClass = cn('rounded-lg', (pressed || selected) && 'bg-accent', className);

  if (below) {
    return (
      <View className={rowClass}>
        {main}
        <View className="flex-row gap-2 px-3 pb-3">{actionButtons(true)}</View>
      </View>
    );
  }

  return (
    <View className={cn('flex-row items-center gap-3', siblingTrailing && 'pr-3', rowClass)}>
      {main}
      {trailing === 'more' ? (
        <Button
          variant="ghost"
          size="icon"
          onPress={onMorePress}
          accessibilityLabel={`More actions for ${name}`}>
          <Icon as={DotsThreeIcon} weight="bold" className="text-foreground size-5" />
        </Button>
      ) : null}
      {trailing === 'permission' ? (
        <Button
          variant="ghost"
          size="sm"
          onPress={onPermissionPress}
          accessibilityLabel={`${permission}. Change access for ${name}`}>
          <Text>{permission}</Text>
          <Icon as={CaretDownIcon} className="size-4" />
        </Button>
      ) : null}
      {trailing === 'actions-inline' ? (
        <View className="flex-row items-center gap-2">{actionButtons(false)}</View>
      ) : null}
    </View>
  );
}

export { MemberItem };
export type { MemberItemAction, MemberItemProps, MemberItemTrailing };
