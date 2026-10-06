import { cn } from '@/registry/nativewind/lib/utils';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
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

type Preview = { name: string; component: (props: unknown) => React.JSX.Element };

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
      return (
        <View
          className="native:flex-1 items-center justify-center px-4"
          // On web a horizontal list doesn't stretch its items vertically, so size them explicitly.
          style={{ width, height: Platform.OS === 'web' && height ? height : undefined }}>
          <Component />
        </View>
      );
    },
    [width, height]
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
      <View className="mb-safe absolute bottom-0 left-0 right-0 flex-row items-center justify-between gap-3 px-4 pb-3">
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

function keyExtractor(item: { name: string }) {
  return item.name;
}
