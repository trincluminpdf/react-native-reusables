import { Button } from '@/registry/nativewind/components/ui/button';
import { PageThumbnail } from '@/registry/nativewind/components/ui/page-thumbnail';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

/** Tiny grey-bar stand-in for a rendered PDF page (white in both themes, like a real page). */
function MiniPage({ landscape, variant = 0 }: { landscape?: boolean; variant?: number }) {
  const lines = landscape ? [4, 3] : [5, 4, 3];
  return (
    <View className={cn('flex-1 bg-white', landscape ? 'gap-1.5 p-2' : 'gap-2 p-2.5')}>
      <View className="gap-1">
        <View className="h-1.5 w-4/5 rounded-sm bg-neutral-300" />
        {variant % 2 === 0 ? <View className="h-1.5 w-2/5 rounded-sm bg-neutral-300" /> : null}
      </View>
      {lines.map((n, p) => (
        <View key={p} className="gap-1">
          {Array.from({ length: n - (variant % 2) }, (_, i) => (
            <View
              key={i}
              className={cn('h-1 rounded-sm bg-neutral-200', i === n - 1 ? 'w-3/5' : 'w-full')}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function Caption({ children }: { children: string }) {
  return <Text className="text-muted-foreground text-center text-xs">{children}</Text>;
}

function States() {
  return (
    <PreviewStack>
      <Spec label="State=Default · Current · Selected · Orientation=Portrait">
        <View className="flex-row flex-wrap gap-2">
          <View className="gap-1.5">
            <PageThumbnail page={1} onPress={() => {}}>
              <MiniPage />
            </PageThumbnail>
            <Caption>Default</Caption>
          </View>
          <View className="gap-1.5">
            <PageThumbnail page={2} state="current" onPress={() => {}}>
              <MiniPage variant={1} />
            </PageThumbnail>
            <Caption>Current</Caption>
          </View>
          <View className="gap-1.5">
            <PageThumbnail page={3} state="selected" onPress={() => {}}>
              <MiniPage variant={2} />
            </PageThumbnail>
            <Caption>Selected</Caption>
          </View>
        </View>
      </Spec>
      <Spec label="Show checkbox=true · State=Default / Current (select mode)">
        <View className="flex-row flex-wrap gap-2">
          <PageThumbnail page={4} selectable onPress={() => {}}>
            <MiniPage variant={3} />
          </PageThumbnail>
          <PageThumbnail page={5} state="current" selectable onPress={() => {}}>
            <MiniPage />
          </PageThumbnail>
        </View>
      </Spec>
    </PreviewStack>
  );
}

function Landscape() {
  return (
    <PreviewStack>
      <Spec label="Orientation=Landscape · State=Default / Current / Selected">
        <View className="flex-row flex-wrap gap-2">
          <PageThumbnail page={1} orientation="landscape" onPress={() => {}}>
            <MiniPage landscape />
          </PageThumbnail>
          <PageThumbnail page={2} orientation="landscape" state="current" onPress={() => {}}>
            <MiniPage landscape variant={1} />
          </PageThumbnail>
          <PageThumbnail page={3} orientation="landscape" state="selected" onPress={() => {}}>
            <MiniPage landscape />
          </PageThumbnail>
        </View>
      </Spec>
      <Spec label="◆ Mixed document · portrait + landscape pages">
        <View className="flex-row flex-wrap items-end gap-2">
          <PageThumbnail page={4} onPress={() => {}}>
            <MiniPage />
          </PageThumbnail>
          <PageThumbnail page={5} orientation="landscape" onPress={() => {}}>
            <MiniPage landscape variant={1} />
          </PageThumbnail>
        </View>
      </Spec>
    </PreviewStack>
  );
}

const PAGES = [1, 2, 3, 4, 5, 6];

function SelectMode() {
  const [selecting, setSelecting] = React.useState(true);
  const [selected, setSelected] = React.useState<number[]>([2, 5]);
  const [current, setCurrent] = React.useState(1);

  const toggle = (p: number) =>
    setSelected((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));

  return (
    <PreviewStack>
      <Spec label="◆ Select mode (tap to toggle) · long-press a page to start selecting">
        <View className="flex-row items-center justify-between">
          <Text className="text-muted-foreground text-sm">
            {selecting ? `${selected.length} selected` : `Page ${current} of ${PAGES.length}`}
          </Text>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => {
              setSelecting((v) => !v);
              if (selecting) setSelected([]);
            }}>
            <Text>{selecting ? 'Done' : 'Select'}</Text>
          </Button>
        </View>
        <View className="flex-row flex-wrap justify-center gap-2">
          {PAGES.map((p) => (
            <PageThumbnail
              key={p}
              page={p}
              selectable={selecting}
              bookmarked={p === 4}
              state={
                selecting && selected.includes(p)
                  ? 'selected'
                  : p === current
                    ? 'current'
                    : 'default'
              }
              onPress={() => (selecting ? toggle(p) : setCurrent(p))}
              onLongPress={() => {
                if (!selecting) {
                  setSelecting(true);
                  setSelected([p]);
                }
              }}>
              <MiniPage variant={p} />
            </PageThumbnail>
          ))}
        </View>
      </Spec>
    </PreviewStack>
  );
}

function Bookmark() {
  return (
    <PreviewStack>
      <Spec label="Show bookmark=true · State=Default / Current">
        <View className="flex-row flex-wrap gap-2">
          <PageThumbnail page={1} bookmarked onPress={() => {}}>
            <MiniPage />
          </PageThumbnail>
          <PageThumbnail page={2} bookmarked state="current" onPress={() => {}}>
            <MiniPage variant={1} />
          </PageThumbnail>
        </View>
      </Spec>
      <Spec label="Show bookmark=true · Show checkbox=true (select mode)">
        <View className="flex-row flex-wrap gap-2">
          <PageThumbnail page={3} bookmarked selectable onPress={() => {}}>
            <MiniPage variant={2} />
          </PageThumbnail>
          <PageThumbnail page={4} bookmarked state="selected" onPress={() => {}}>
            <MiniPage variant={3} />
          </PageThumbnail>
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'State', component: States },
  { name: 'Orientation=Landscape', component: Landscape },
  { name: '◆ Select mode (tap to toggle)', component: SelectMode },
  { name: 'Show bookmark', component: Bookmark },
];
