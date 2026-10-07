import { PageControl } from '@/registry/nativewind/components/ui/page-control';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { ScrollView, View, type LayoutChangeEvent } from 'react-native';

const SLIDES = [
  { title: 'Edit any PDF', body: 'Highlight, comment and sign on the go.', tint: 'bg-sky-500/15' },
  { title: 'Sign in seconds', body: 'Add your signature anywhere.', tint: 'bg-violet-500/15' },
  { title: 'AI tools', body: 'Summarize long documents in one tap.', tint: 'bg-amber-500/15' },
  { title: 'Works offline', body: 'Keep files on your device.', tint: 'bg-emerald-500/15' },
];

function Pager() {
  const [page, setPage] = React.useState(0);
  const [width, setWidth] = React.useState(0);
  const ref = React.useRef<ScrollView>(null);
  const goTo = (p: number) => {
    setPage(p);
    ref.current?.scrollTo({ x: p * width, animated: true });
  };
  return (
    <PreviewStack>
      <Spec label="◆ Style=Minimal · swipe the pager or tap left / right of the current dot">
        <View
          className="border-border overflow-hidden rounded-xl border"
          onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}>
          <ScrollView
            ref={ref}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) =>
              width && setPage(Math.round(e.nativeEvent.contentOffset.x / width))
            }
            onScroll={(e) => {
              if (!width) return;
              const p = Math.round(e.nativeEvent.contentOffset.x / width);
              if (p !== page) setPage(p);
            }}
            scrollEventThrottle={32}>
            {SLIDES.map((s) => (
              <View
                key={s.title}
                style={{ width: width || 1 }}
                className={`h-48 justify-end p-4 ${s.tint}`}>
                <Text className="text-foreground text-lg font-semibold">{s.title}</Text>
                <Text className="text-muted-foreground text-sm">{s.body}</Text>
              </View>
            ))}
          </ScrollView>
          <View className="items-center py-2">
            <PageControl
              count={SLIDES.length}
              page={page}
              onPageChange={goTo}
              accessibilityLabel="Onboarding"
            />
          </View>
        </View>
      </Spec>
    </PreviewStack>
  );
}

function Styles() {
  const [a, setA] = React.useState(1);
  const [b, setB] = React.useState(2);
  return (
    <PreviewStack>
      <Spec label="◆ Style=Minimal · Current=2">
        <PageControl count={5} page={a} onPageChange={setA} />
      </Spec>
      <Spec label="◆ Style=Prominent (glass, over images) · Current=3">
        <View className="h-32 items-center justify-end rounded-xl bg-sky-500/40 pb-3">
          <PageControl count={5} page={b} onPageChange={setB} variant="prominent" />
        </View>
      </Spec>
      <Spec label="◆ Show dot 4 / 5 = false (3 pages)">
        <PageControl count={3} page={0} />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Pager', component: Pager },
  { name: 'Style', component: Styles },
];
