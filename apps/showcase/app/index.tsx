import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { useScrollToTop } from 'expo-router/react-navigation';
import { FlashList } from '@shopify/flash-list';
import { BLOCKS, COMPONENTS } from '@showcase/lib/constants';
import { Link, type Href } from 'expo-router';
import { CaretRightIcon } from 'phosphor-react-native';
import type { ComponentStatus } from '@showcase/lib/constants';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform, View } from 'react-native';

export default function ComponentsScreen() {
  const [search, setSearch] = React.useState('');
  const [isAtTop, setIsAtTop] = React.useState(true);
  const isAtTopRef = React.useRef(true);
  const flashListRef = React.useRef(null);
  useScrollToTop(flashListRef);

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
        onScroll={Platform.select({
          android: ({ nativeEvent }) => {
            const isScrollAtTop = nativeEvent.contentOffset.y <= 0;
            if (isScrollAtTop !== isAtTopRef.current) {
              isAtTopRef.current = isScrollAtTop;
              setIsAtTop(isScrollAtTop);
            }
          },
        })}
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
          web: <SectionTitle>Components</SectionTitle>,
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
