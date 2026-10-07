import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { PlatformSwitch } from '@showcase/components/platform-switch';
import { PreviewCarousel } from '@showcase/components/preview-carousel';
import { componentFigmaUrl, getComponent, hasNativeParts } from '@showcase/lib/constants';
import { isShellFrame } from '@showcase/lib/desktop-frame';
import {
  choosePreviewPlatform,
  usePreviewPlatform,
  type PreviewOS,
} from '@showcase/lib/preview-platform';
import * as Linking from 'expo-linking';
import { ArrowSquareOutIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';

type Preview = {
  name: string;
  component: () => React.JSX.Element;
  fullBleed?: boolean;
  /** Only shown for this OS (web: the iOS | Android switch; native: the device). */
  platform?: PreviewOS;
};

/**
 * One component page = link to its Figma page + carousel of previews.
 * Preview names follow the Figma variant properties so design and code read the same.
 * Pages with a native part (`native` in lib/constants.ts) get the iOS | Android switch on phone web;
 * inside the desktop phone frame the shell's top bar has it instead.
 */
function ComponentPage({ slug, previews }: { slug: string; previews: Preview[] }) {
  const meta = getComponent(slug);
  const os = usePreviewPlatform();
  // Inside the desktop shell's phone frame the side panel already links to Figma.
  const [inShell, setInShell] = React.useState(false);
  React.useEffect(() => setInShell(isShellFrame()), []);

  const visible = React.useMemo(
    () => previews.filter((p) => !p.platform || p.platform === os),
    [previews, os]
  );
  // Switching OS swaps the platform-only previews; stay on the same position (iOS Inline ↔ Android M3).
  const [index, setIndex] = React.useState(0);
  const listKey = visible.map((p) => p.name).join('|');

  const showSwitch = Platform.OS === 'web' && hasNativeParts(meta);

  return (
    <View className="flex-1">
      {meta && !inShell ? (
        <View
          className={cn(
            'flex-row items-center gap-2 px-4 pt-3',
            showSwitch ? 'justify-between' : 'justify-end'
          )}>
          {showSwitch ? <PlatformSwitch value={os} onChange={choosePreviewPlatform} /> : null}
          {componentFigmaUrl(meta) ? (
            <Pressable
              onPress={() => Linking.openURL(componentFigmaUrl(meta)!)}
              className="flex-row items-center gap-1 rounded-md px-2 py-2 active:opacity-60"
              accessibilityRole="link"
              hitSlop={6}>
              <Text className="text-muted-foreground text-xs">Figma</Text>
              <Icon as={ArrowSquareOutIcon} size={12} className="text-muted-foreground" />
            </Pressable>
          ) : (
            // Code-only component: no Figma page to link to.
            <Text className="text-muted-foreground px-2 py-2 text-xs">Code only</Text>
          )}
        </View>
      ) : null}
      <PreviewCarousel
        key={listKey}
        previews={visible}
        initialIndex={Math.min(index, visible.length - 1)}
        onIndexChange={setIndex}
      />
    </View>
  );
}

export { ComponentPage };
export type { Preview };
