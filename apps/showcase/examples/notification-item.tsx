import { Button } from '@/registry/nativewind/components/ui/button';
import {
  NotificationItem,
  type NotificationLeading,
} from '@/registry/nativewind/components/ui/notification-item';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { ClockIcon, CloudArrowUpIcon, ShieldCheckIcon, SignatureIcon } from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

/** Bold span inside notification content (repeat text-sm: ui/Text defaults to text-base). */
function B({ children }: { children: string }) {
  return <Text className="text-foreground text-sm font-semibold">{children}</Text>;
}

/** Placeholder people only. */
const ALEX: NotificationLeading = { type: 'avatar', initials: 'AM' };
const JORDAN: NotificationLeading = { type: 'avatar', initials: 'JL' };
const RILEY: NotificationLeading = { type: 'avatar', initials: 'RC' };

function Status() {
  return (
    <PreviewStack>
      <Spec label="Status=Unread · Leading=Avatar">
        <View className="-mx-4">
          <NotificationItem
            unread
            leading={ALEX}
            content={
              <>
                <B>Alex Morgan</B> shared <B>Lease agreement.pdf</B> with you
              </>
            }
            time="2 min ago"
            onPress={() => {}}
          />
        </View>
      </Spec>
      <Spec label="Status=Read · Leading=Avatar">
        <View className="-mx-4">
          <NotificationItem
            leading={JORDAN}
            content={
              <>
                <B>Jordan Lee</B> commented on <B>Q2 Results.pdf</B>: “Can we double-check the
                totals on page 3 before Friday?”
              </>
            }
            time="1 h ago"
            onPress={() => {}}
          />
        </View>
      </Spec>
    </PreviewStack>
  );
}

function IconLeading() {
  return (
    <PreviewStack>
      <Spec label="Leading=Icon · system events · Status=Unread / Read">
        <View className="-mx-4">
          <NotificationItem
            unread
            leading={{ type: 'icon', icon: CloudArrowUpIcon }}
            content={
              <>
                <B>Q2 Results.pdf</B> finished uploading to your workspace
              </>
            }
            time="5 min ago"
            onPress={() => {}}
          />
          <NotificationItem
            unread
            leading={{ type: 'icon', icon: ClockIcon }}
            content={
              <>
                The signature request for <B>NDA – Partner draft.pdf</B> expires tomorrow
              </>
            }
            time="3 h ago"
            onPress={() => {}}
          />
          <NotificationItem
            leading={{ type: 'icon', icon: ShieldCheckIcon }}
            content="Your password was changed. If this wasn't you, reset it now."
            time="Yesterday"
            onPress={() => {}}
          />
        </View>
      </Spec>
    </PreviewStack>
  );
}

function Actions() {
  const [result, setResult] = React.useState<'accepted' | 'declined' | null>(null);
  return (
    <PreviewStack>
      <Spec label="Show actions · invite (Decline / Accept)">
        <View className="-mx-4">
          <NotificationItem
            unread={result === null}
            leading={RILEY}
            content={
              <>
                <B>Riley Chen</B> invited you to join the <B>Design team</B> workspace
              </>
            }
            time="10 min ago"
            actions={
              result === null
                ? {
                    decline: { onPress: () => setResult('declined') },
                    accept: { onPress: () => setResult('accepted') },
                  }
                : undefined
            }
            onPress={() => {}}
          />
          <NotificationItem
            unread
            leading={{ type: 'icon', icon: SignatureIcon }}
            content={
              <>
                <B>Jordan Lee</B> asked you to sign <B>Lease agreement.pdf</B>
              </>
            }
            time="1 h ago"
            actions={{ accept: { label: 'Review and sign' } }}
            onPress={() => {}}
          />
        </View>
        {result ? (
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground text-xs">{`Invite ${result}`}</Text>
            <Button variant="ghost" size="sm" onPress={() => setResult(null)}>
              <Text>Reset</Text>
            </Button>
          </View>
        ) : null}
      </Spec>
    </PreviewStack>
  );
}

const LIST: {
  id: string;
  leading: NotificationLeading;
  content: React.ReactNode;
  time: string;
}[] = [
  {
    id: 'share',
    leading: ALEX,
    content: (
      <>
        <B>Alex Morgan</B> shared <B>Lease agreement.pdf</B> with you
      </>
    ),
    time: '2 min ago',
  },
  {
    id: 'comment',
    leading: JORDAN,
    content: (
      <>
        <B>Jordan Lee</B> mentioned you in <B>Q2 Results.pdf</B>
      </>
    ),
    time: '25 min ago',
  },
  {
    id: 'upload',
    leading: { type: 'icon', icon: CloudArrowUpIcon },
    content: (
      <>
        <B>Sequence Data.pdf</B> finished uploading
      </>
    ),
    time: '1 h ago',
  },
  {
    id: 'signed',
    leading: RILEY,
    content: (
      <>
        <B>Riley Chen</B> signed <B>NDA – Partner draft.pdf</B>
      </>
    ),
    time: 'Yesterday',
  },
];

function List() {
  const initial = () => new Set(['share', 'comment', 'upload']);
  const [unread, setUnread] = React.useState<Set<string>>(initial);
  const markRead = (id: string) =>
    setUnread((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
  return (
    <PreviewStack>
      <Spec label="◆ List (tap to mark read) · General tab · full-bleed, no divider">
        <View className="flex-row items-center justify-between">
          <Text className="text-muted-foreground text-xs">{`${unread.size} unread`}</Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => setUnread(unread.size ? new Set() : initial())}>
            <Text>{unread.size ? 'Mark all as read' : 'Reset'}</Text>
          </Button>
        </View>
        <View className="-mx-4">
          {LIST.map((n) => (
            <NotificationItem
              key={n.id}
              leading={n.leading}
              content={n.content}
              time={n.time}
              unread={unread.has(n.id)}
              onPress={() => markRead(n.id)}
            />
          ))}
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Status=Unread · Leading=Avatar', component: Status },
  { name: 'Leading=Icon', component: IconLeading },
  { name: 'Show actions', component: Actions },
  { name: '◆ List (tap to mark read)', component: List },
];
