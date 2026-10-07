import { cn } from '@/registry/nativewind/lib/utils';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { isShellFrame, SHELL_SAFE_BOTTOM } from '@showcase/lib/desktop-frame';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react-native';
import * as React from 'react';
import { useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Preview = {
  name: string;
  component: (props: unknown) => React.JSX.Element;
  /** Fill the page edge to edge (whole-screen demos) instead of centering with side padding. */
  fullBleed?: boolean;
};

type PreviewCarouselProps = {
  previews: Preview[];
  removeBottomSafeArea?: boolean;
};

function PreviewCarousel({ previews, removeBottomSafeArea = false }: PreviewCarouselProps) {
  const [index, setIndex] = useState(0);
  const ref = React.useRef<FlatList>(null);
  // Track the live window width so swiping/paging stays aligned after rotation or resize.
  const { width } = useWindowDimensions();
  const [height, setHeight] = useState(0);
  // Keep the bottom bar clear of the home indicator: device safe area, or the simulated one
  // inside the desktop phone frame (its iframe reports 0).
  const insets = useSafeAreaInsets();
  const [inShell, setInShell] = useState(false);
  React.useEffect(() => setInShell(isShellFrame()), []);
  const bottomInset = Math.max(insets.bottom, inShell ? SHELL_SAFE_BOTTOM : 0);
  // The variant bar floats over the list; previews keep clear of it using its measured height
  // (it grows with the safe area, so a fixed margin is not enough).
  const [barHeight, setBarHeight] = useState(0);

  function onScroll(ev: NativeSyntheticEvent<NativeScrollEvent>) {
    if (!width) return;
    const next = Math.round(ev.nativeEvent.contentOffset.x / width);
    setIndex(Math.max(0, Math.min(previews.length - 1, next)));
  }

  function goTo(next: number) {
    ref.current?.scrollToIndex({ index: next, animated: true });
    setIndex(next);
  }

  function onPreviousPress() {
    goTo(Math.max(0, index - 1));
  }

  function onNextPress() {
    goTo(Math.min(previews.length - 1, index + 1));
  }

  const renderItem = React.useCallback(
    ({ item }: ListRenderItemInfo<Preview>) => {
      const Component = item.component;
      // Web: reserve the whole bar. Native: the list already pads pb-12 + safe area below.
      const reserved =
        Platform.OS === 'web'
          ? barHeight
          : item.fullBleed && !removeBottomSafeArea
            ? Math.max(0, barHeight - 48 - insets.bottom)
            : 0;
      return (
        <View
          className={cn(
            'native:flex-1',
            // No side padding here: PreviewStack's ScrollView spans the full page and pads its content,
            // otherwise the scroll view's edge clips focus rings / shadows of full-width controls.
            item.fullBleed ? 'items-stretch' : 'items-center justify-center'
          )}
          // On web a horizontal list doesn't stretch its items vertically, so size them explicitly.
          style={{
            width,
            height: Platform.OS === 'web' && height ? height : undefined,
            paddingBottom: reserved,
          }}>
          <Component />
        </View>
      );
    },
    [width, height, barHeight, insets.bottom, removeBottomSafeArea]
  );

  const getItemLayout = React.useCallback(
    (_: unknown, i: number) => ({ length: width, offset: width * i, index: i }),
    [width]
  );

  return (
    <>
      <FlatList
        key={width}
        ref={ref}
        className="flex-1"
        onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
        data={previews}
        renderItem={renderItem}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialScrollIndex={index}
        horizontal
        pagingEnabled
        snapToInterval={width}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerClassName={cn(!removeBottomSafeArea && 'native:pb-12 mb-safe')}
      />
      <View
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between gap-3 px-4 pt-3"
        onLayout={(e) => setBarHeight(e.nativeEvent.layout.height)}
        style={{ paddingBottom: bottomInset + BAR_GAP }}>
        <View className="bg-background rounded-md">
          <Button
            variant="outline"
            size="icon"
            className="size-11"
            disabled={index === 0}
            onPress={onPreviousPress}
            accessibilityLabel="Previous variant">
            <Icon as={ChevronLeftIcon} className="size-5" />
          </Button>
        </View>
        <View className="bg-background border-border flex-1 items-center rounded-md border px-3 py-1.5">
          <Text className="text-sm font-medium" numberOfLines={1}>
            {previews[index]?.name}
          </Text>
          <Text className="text-muted-foreground text-xs">
            {index + 1} / {previews.length}
          </Text>
        </View>
        <View className="bg-background rounded-md">
          <Button
            variant="outline"
            size="icon"
            className="size-11"
            disabled={index === previews.length - 1}
            onPress={onNextPress}
            accessibilityLabel="Next variant">
            <Icon as={ChevronRightIcon} className="size-5" />
          </Button>
        </View>
      </View>
    </>
  );
}

export { PreviewCarousel };

/** Space between the bar and the safe-area edge. */
const BAR_GAP = 16;

function keyExtractor(item: { name: string }) {
  return item.name;
}
