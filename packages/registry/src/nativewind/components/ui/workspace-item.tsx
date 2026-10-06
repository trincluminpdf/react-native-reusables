/**
 * ◆ Lumin in-app — Workspace Item (workspace switcher row). Figma: PDF-Mobile-DS › ◆ Workspace Item
 * (Trailing=More / Join / Accept invite / Request access / None; Show plan, Show subtitle).
 * Tokens: 5. Component › workspace-item/* — outline row: bg-background border border-border rounded-xl p-3 gap-3 ·
 * Avatar default (size-8, initials fallback) · text gap-1: name text-sm font-medium, plan Badge secondary,
 * subtitle text-xs muted · trailing action.
 * Deltas vs source: one primary action per list (Join = default, Accept invite = secondary,
 * Request access = outline) instead of three primary buttons; dark-mode name uses text-foreground.
 */
import { Avatar, AvatarFallback, AvatarImage } from '@/registry/nativewind/components/ui/avatar';
import { Badge } from '@/registry/nativewind/components/ui/badge';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { DotsThreeIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type WorkspaceTrailing = 'more' | 'join' | 'accept-invite' | 'request-access' | 'none';

type WorkspaceItemProps = {
  name: string;
  plan?: string;
  subtitle?: string;
  avatarUri?: string;
  trailing?: WorkspaceTrailing;
  onPress?: () => void;
  onActionPress?: () => void;
  className?: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

const ACTION: Record<
  Exclude<WorkspaceTrailing, 'more' | 'none'>,
  { label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  join: { label: 'Join', variant: 'default' },
  'accept-invite': { label: 'Accept invite', variant: 'secondary' },
  'request-access': { label: 'Request access', variant: 'outline' },
};

function WorkspaceItem({
  name,
  plan,
  subtitle,
  avatarUri,
  trailing = 'more',
  onPress,
  onActionPress,
  className,
}: WorkspaceItemProps) {
  const [pressed, setPressed] = React.useState(false);
  return (
    <View
      className={cn(
        'bg-background border-border flex-row items-center gap-3 rounded-xl border pr-3',
        pressed && 'bg-accent',
        className
      )}>
      <Pressable
        onPress={onPress}
        disabled={!onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={[name, plan, subtitle].filter(Boolean).join(', ')}
        className="min-w-0 flex-1 flex-row items-center gap-3 py-3 pl-3">
        <Avatar alt={name}>
          {avatarUri ? <AvatarImage source={{ uri: avatarUri }} /> : null}
          <AvatarFallback>
            <Text>{initials(name)}</Text>
          </AvatarFallback>
        </Avatar>
        <View className="min-w-0 flex-1 items-start gap-1">
          <Text numberOfLines={1} className="text-foreground text-sm font-medium">
            {name}
          </Text>
          {plan ? (
            <Badge variant="secondary">
              <Text>{plan}</Text>
            </Badge>
          ) : null}
          {subtitle ? (
            <Text numberOfLines={1} className="text-muted-foreground text-xs">
              {subtitle}
            </Text>
          ) : null}
        </View>
      </Pressable>
      {trailing === 'more' ? (
        <Button
          variant="ghost"
          size="icon"
          onPress={onActionPress}
          accessibilityLabel={`More actions for ${name}`}>
          <Icon as={DotsThreeIcon} weight="bold" className="text-foreground size-5" />
        </Button>
      ) : trailing !== 'none' ? (
        <Button size="sm" variant={ACTION[trailing].variant} onPress={onActionPress}>
          <Text>{ACTION[trailing].label}</Text>
        </Button>
      ) : null}
    </View>
  );
}

export { WorkspaceItem };
export type { WorkspaceItemProps, WorkspaceTrailing };
