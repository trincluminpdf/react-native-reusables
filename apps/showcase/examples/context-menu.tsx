import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/registry/nativewind/components/ui/context-menu';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FILE_MENU } from './menu-items';

/** Web: touch screens get the long-press label, mouse gets right-click. */
function useCoarsePointer() {
  const [coarse, setCoarse] = React.useState(false);
  React.useEffect(() => {
    if (Platform.OS !== 'web' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);
  return coarse;
}

function Menu() {
  const insets = useSafeAreaInsets();
  const coarse = useCoarsePointer();
  return (
    <PreviewStack>
      <Spec label="Long-press on touch · right-click with a mouse · same items as Dropdown Menu">
        <ContextMenu className="h-[150px] w-full">
          <ContextMenuTrigger
            onLongPress={() => Platform.OS !== 'web' && Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            className="border-border web:outline-none web:cursor-default flex h-full w-full items-center justify-center rounded-md border border-dashed">
            <Text className="text-sm">
              {Platform.OS === 'web' && !coarse ? 'Right click here' : 'Long press here'}
            </Text>
          </ContextMenuTrigger>
          <ContextMenuContent
            className="w-56"
            insets={{ top: insets.top, bottom: insets.bottom, left: 12, right: 12 }}>
            <ContextMenuLabel>{FILE_MENU.label}</ContextMenuLabel>
            <ContextMenuSeparator />
            {FILE_MENU.items.map((i) => (
              <ContextMenuItem key={i}>
                <Text>{i}</Text>
              </ContextMenuItem>
            ))}
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">
              <Text>{FILE_MENU.destructive}</Text>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Menu', component: Menu }];
