import { CommentItem } from '@/registry/nativewind/components/ui/comment-item';
import { SectionHeader } from '@/registry/nativewind/components/ui/section-header';
import { Separator } from '@/registry/nativewind/components/ui/separator';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { HighlighterIcon } from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

const ROOT = {
  name: 'Alex Morgan',
  date: 'Oct 6, 2026 · 10:24 AM',
  comment:
    'Can we double-check the renewal date in section 4? It looks like it still says 2025, and the notice period should be 60 days, not 30.',
};

const REPLIES = [
  {
    name: 'Jordan Lee',
    date: 'Oct 6, 2026 · 11:02 AM',
    comment: 'Good catch — updated the date. The notice period is 60 days in the signed copy too.',
  },
  {
    name: 'Riley Chen',
    date: 'Oct 6, 2026 · 2:15 PM',
    comment: 'Looks right to me now.',
  },
];

/** Cards grouped under a Section Header per page, as in the Comments list. */
function CardList({ children }: { children: React.ReactNode }) {
  return (
    <View className="-mx-4 gap-2">
      <SectionHeader title="Page 1" />
      <View className="gap-2 px-4">{children}</View>
    </View>
  );
}

function Card() {
  return (
    <PreviewStack>
      <Spec label="Type=Card · Show replies · text clamps to 2 lines">
        <CardList>
          <CommentItem {...ROOT} replies="5 replies" onPress={() => {}} />
          <CommentItem
            name="Jordan Lee"
            date="Oct 5, 2026 · 4:40 PM"
            comment="Highlight: the payment schedule should match the invoice."
            typeIcon={HighlighterIcon}
            typeColor="#fc8d59"
            onPress={() => {}}
          />
        </CardList>
      </Spec>
    </PreviewStack>
  );
}

function CardResolved() {
  return (
    <PreviewStack>
      <Spec label="Type=Card · State=Resolved">
        <CardList>
          <CommentItem
            {...ROOT}
            replies="2 replies"
            resolved
            resolvedBy="Jordan Lee"
            onPress={() => {}}
          />
        </CardList>
      </Spec>
    </PreviewStack>
  );
}

function Thread({
  resolved = false,
  onResolvePress,
}: {
  resolved?: boolean;
  onResolvePress?: () => void;
}) {
  return (
    <View className="-mx-4">
      <CommentItem {...ROOT} type="detail" resolved={resolved} onResolvePress={onResolvePress} />
      <Separator />
      {REPLIES.map((r) => (
        <CommentItem key={r.name} {...r} type="detail" resolved={resolved} showResolve={false} />
      ))}
    </View>
  );
}

function Detail() {
  return (
    <PreviewStack>
      <Spec label="Type=Detail · root + 2 replies (Show resolve=false)">
        <Thread />
      </Spec>
    </PreviewStack>
  );
}

function DetailResolved() {
  return (
    <PreviewStack>
      <Spec label="Type=Detail · State=Resolved">
        <Thread resolved />
      </Spec>
    </PreviewStack>
  );
}

function ResolveDemo() {
  const [resolved, setResolved] = React.useState(false);
  return (
    <PreviewStack>
      <Spec label="◆ Resolve (tap ✓ in the thread head) · the list card follows">
        <Thread resolved={resolved} onResolvePress={() => setResolved((v) => !v)} />
      </Spec>
      <Spec label="Type=Card (Comments list)">
        <CommentItem
          {...ROOT}
          replies="2 replies"
          resolved={resolved}
          resolvedBy="Alex Morgan"
          onPress={() => {}}
        />
        <Text className="text-muted-foreground text-xs">
          {resolved ? 'Thread resolved — tap ✓ again to reopen.' : 'Thread open.'}
        </Text>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Type=Card', component: Card },
  { name: 'Type=Card · State=Resolved', component: CardResolved },
  { name: 'Type=Detail', component: Detail },
  { name: 'Type=Detail · State=Resolved', component: DetailResolved },
  { name: '◆ Resolve (tap)', component: ResolveDemo },
];
