import { Loader, LoaderScreen } from '@/registry/nativewind/components/ui/loader';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { Modal, Pressable, View } from 'react-native';

function Default() {
  return (
    <PreviewStack>
      <Spec label="◆ Lumin loader · 48px (default) · #191C1D, foreground in dark">
        <View className="items-center py-4">
          <Loader />
        </View>
      </Spec>
      <Spec label="Size=32 / 48 / 72" row>
        <Loader size={32} />
        <Loader size={48} />
        <Loader size={72} />
      </Spec>
      <Spec label="Colour follows text class (text-primary, text-muted-foreground)" row>
        <Loader size={32} className="text-primary" />
        <Loader size={32} className="text-muted-foreground" />
      </Spec>
    </PreviewStack>
  );
}

function Screen() {
  return (
    <PreviewStack>
      <Spec label="LoaderScreen · fills its parent on bg-background, fades in after 150ms">
        <View className="border-border h-80 overflow-hidden rounded-xl border">
          <LoaderScreen label="Opening file…" />
        </View>
      </Spec>
    </PreviewStack>
  );
}

function FullScreen() {
  const [open, setOpen] = React.useState(false);
  return (
    <PreviewStack>
      <Spec label="Full screen — tap anywhere to close">
        <Button variant="outline" onPress={() => setOpen(true)}>
          <Text>Show loading screen</Text>
        </Button>
      </Spec>
      <Spec label="Web boot screen uses the same loader until the app is ready">
        <Text className="text-muted-foreground text-sm">Reload the page to see it.</Text>
      </Spec>
      <Modal visible={open} transparent={false} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable className="flex-1" onPress={() => setOpen(false)} accessibilityLabel="Close loading screen">
          <LoaderScreen label="Opening file…" />
        </Pressable>
      </Modal>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Default', component: Default },
  { name: 'Screen', component: Screen },
  { name: 'Full screen', component: FullScreen },
];
