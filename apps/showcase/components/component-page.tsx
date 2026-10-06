import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { PreviewCarousel } from '@showcase/components/preview-carousel';
import { figmaUrl, getComponent } from '@showcase/lib/constants';
import * as Linking from 'expo-linking';
import { ArrowSquareOutIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

type Preview = { name: string; component: () => React.JSX.Element };

/**
 * One component page = link to its Figma page + carousel of previews.
 * Preview names follow the Figma variant properties so design and code read the same.
 */
function ComponentPage({ slug, previews }: { slug: string; previews: Preview[] }) {
  const meta = getComponent(slug);
  return (
    <View className="flex-1">
      {meta ? (
        <View className="flex-row items-center justify-end px-4 pt-3">
          <Pressable
            onPress={() => Linking.openURL(figmaUrl(meta.figma))}
            className="flex-row items-center gap-1 rounded-md px-2 py-2 active:opacity-60"
            accessibilityRole="link"
            hitSlop={6}>
            <Text className="text-muted-foreground text-xs">Figma</Text>
            <Icon as={ArrowSquareOutIcon} size={12} className="text-muted-foreground" />
          </Pressable>
        </View>
      ) : null}
      <PreviewCarousel previews={previews} />
    </View>
  );
}

export { ComponentPage };
export type { Preview };
