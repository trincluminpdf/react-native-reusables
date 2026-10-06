import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { useScrollToTop } from 'expo-router/react-navigation';
import { FlashList, type FlashListRef } from '@shopify/flash-list';
import { BLOCKS, COMPONENTS } from '@showcase/lib/constants';
import { Link, useFocusEffect, type Href } from 'expo-router';
import { CaretRightIcon } from 'phosphor-react-native';
import type { ComponentStatus } from '@showcase/lib/constants';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform, View } from 'react-native';

/**
 * Web: the browser drops the list's scroll position while Home is hidden behind a component
 * page (and reports a scroll to 0 when it comes back), so remember the offset and put it back
 * when Home is focused again (Back). A full reload (logo) starts at the top — memory only.
 */
let savedScrollY = 0;

export default function ComponentsScreen() {
  const [search, setSearch] = React.useState('');
  const [isAtTop, setIsAtTop] = React.useState(true);
  const isAtTopRef = React.useRef(true);
  const flashListRef = React.useRef<FlashListRef<(typeof COMPONENTS)[number]>>(null);
  const isFocusedRef = React.useRef(true);
  const restoreTargetRef = React.useRef<number | null>(null);
  useScrollToTop(flashListRef);

  useFocusEffect(
    React.useCallback(() => {
      isFocusedRef.current = true;
      let timer: ReturnType<typeof setTimeout> | undefined;
      if (Platform.OS === 'web' && savedScrollY > 0) {
        const target = savedScrollY;
        restoreTargetRef.current = target;
        let tries = 0;
        // The list is re-shown and re-measured over a few frames; retry until it sticks.
        const attempt = () => {
          if (restoreTargetRef.current === null) return;
          flashListRef.current?.scrollToOffset({ offset: target, animated: false });
          tries += 1;
          if (tries < 40) timer = setTimeout(attempt, 50);
          else restoreTargetRef.current = null;
        };
        attempt();
      }
      return () => {
        isFocusedRef.current = false;
        restoreTargetRef.current = null;
        if (timer) clearTimeout(timer);
      };
    }, [])
  );

  const data = !search
    ? COMPONENTS
    : COMPONENTS.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View
      className={cn(
        'web:p-4 mx-auto w-full max-w-lg flex-1',
        Platform.select({ android: cn('border-border/0 border-t', !isAtTop && 'border-border') })
      )}>
      <FlashList
        ref={flashListRef}
        data={data}
        onScroll={({ nativeEvent }) => {
          const y = nativeEvent.contentOffset.y;
          if (Platform.OS === 'web' && isFocusedRef.current) {
            const target = restoreTargetRef.current;
            if (target === null) savedScrollY = y;
            else if (Math.abs(y - target) < 2) restoreTargetRef.current = null;
          }
          if (Platform.OS === 'android') {
            const isScrollAtTop = y <= 0;
            if (isScrollAtTop !== isAtTopRef.current) {
              isAtTopRef.current = isScrollAtTop;
              setIsAtTop(isScrollAtTop);
            }
          }
        }}
        scrollEventThrottle={16}
        scrollToOverflowEnabled={Platform.OS === 'ios'}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerClassName="px-4 pb-2"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={Platform.select({
          native: (
            <View className="pb-4">
              <Input
                placeholder="Components"
                clearButtonMode="always"
                onChangeText={setSearch}
                autoCorrect={false}
                enterKeyHint="search"
              />
            </View>
          ),
          web: <HomeTitle />,
        })}
        renderItem={({ item, index }) => (
          <ListItem
            href={`/components/${item.slug}`}
            name={item.name}
            status={item.status}
            isFirst={index === 0}
            isLast={index === data.length - 1}
          />
        )}
        ListFooterComponent={Platform.select({
          // Blocks are web-only in the showcase (used for iframe previews).
          web: <BlocksSection />,
          default: <View className="android:pb-safe" />,
        })}
      />
    </View>
  );
}

function BlocksSection() {
  return (
    <View className="pt-8">
      <SectionTitle>Blocks</SectionTitle>
      {BLOCKS.map((item, index) => (
        <ListItem
          key={item.slug}
          href={`/blocks/${item.slug}`}
          name={item.name}
          isFirst={index === 0}
          isLast={index === BLOCKS.length - 1}
        />
      ))}
    </View>
  );
}

/** Web Home title (the bar above only shows the Lumin logo). */
function HomeTitle() {
  return (
    <View className="gap-1 pb-4">
      <Text className="text-3xl font-semibold">PDF Mobile DS</Text>
      <Text className="text-muted-foreground text-sm">{COMPONENTS.length} components</Text>
    </View>
  );
}

function SectionTitle({ children }: { children: string }) {
  return <Text className="pb-3 text-2xl font-semibold">{children}</Text>;
}

type ListItemProps = {
  href: Href;
  name: string;
  status?: ComponentStatus;
  isFirst: boolean;
  isLast: boolean;
};

function ListItem({ href, name, status, isFirst, isLast }: ListItemProps) {
  const { colorScheme } = useColorScheme();
  return (
    <Link href={href} asChild>
      <Link.Trigger>
        <Button
          variant="outline"
          size="lg"
          unstable_pressDelay={100}
          className={cn(
            'dark:bg-background border-border flex-row justify-between rounded-none border-b-0 pl-4 pr-3.5',
            isFirst && 'rounded-t-lg',
            isLast && 'rounded-b-lg border-b'
          )}>
          <Text className="text-base font-normal">
            {status === 'Custom' || status === 'New' ? (
              <Text className="text-sm text-violet-600 dark:text-violet-400">◆ </Text>
            ) : null}
            {name}
          </Text>
          <View className="flex-row items-center gap-2">
            <Icon as={CaretRightIcon} className="text-muted-foreground size-4" />
          </View>
        </Button>
      </Link.Trigger>
      <Link.Preview style={{ backgroundColor: colorScheme === 'dark' ? 'black' : 'white' }} />
    </Link>
  );
}
