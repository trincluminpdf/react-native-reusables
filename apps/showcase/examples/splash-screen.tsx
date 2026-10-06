import { Button } from '@/registry/nativewind/components/ui/button';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { LuminMark } from '@showcase/components/lumin-mark';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { SPLASH } from '@showcase/lib/lumin-mark';
import * as React from 'react';
import { Animated, Modal, Pressable, View, useWindowDimensions } from 'react-native';

/** Phone-sized thumbnail of the splash (390×844 pt screen ratio). */
function SplashThumb({ width = 180 }: { width?: number }) {
  return (
    <View
      className="items-center justify-center overflow-hidden rounded-[28px] border border-border"
      style={{ width, aspectRatio: 390 / 844, backgroundColor: SPLASH.background }}>
      <LuminMark size={width * SPLASH.markWidthRatio} color={SPLASH.markColor} />
    </View>
  );
}

/** Full-screen splash, held for `hold` ms then faded out — the same sequence as app launch / web boot. */
function SplashReplay({ open, onDone, hold = 1200 }: { open: boolean; onDone: () => void; hold?: number }) {
  const { width } = useWindowDimensions();
  const opacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (!open) return;
    opacity.setValue(1);
    const t = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => onDone());
    }, hold);
    return () => clearTimeout(t);
  }, [open, hold, onDone, opacity]);

  return (
    <Modal visible={open} transparent statusBarTranslucent animationType="none" onRequestClose={onDone}>
      <Animated.View style={{ flex: 1, opacity, backgroundColor: SPLASH.background }}>
        <Pressable
          className="flex-1 items-center justify-center"
          onPress={onDone}
          accessibilityLabel="Close splash preview">
          <LuminMark size={Math.min(width * SPLASH.markWidthRatio, 160)} color={SPLASH.markColor} />
        </Pressable>
      </Animated.View>
    </Modal>
  );
}

function Default() {
  const [open, setOpen] = React.useState(false);
  const close = React.useCallback(() => setOpen(false), []);
  return (
    <PreviewStack>
      <Spec label="◆ Splash · white Lumin mark (35% width) on #0A0A0A">
        <View className="items-center">
          <SplashThumb />
        </View>
      </Spec>
      <Spec label="Launch: app icon → splash → first screen. Web boot shows ◆ Loader instead">
        <Button variant="outline" onPress={() => setOpen(true)}>
          <Text>Replay splash</Text>
        </Button>
      </Spec>
      <SplashReplay open={open} onDone={close} />
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Default', component: Default }];
