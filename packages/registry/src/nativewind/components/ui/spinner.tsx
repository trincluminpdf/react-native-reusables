/**
 * ◆ Lumin custom — not in RNR.
 * Figma: PDF-Mobile-DS › ◆ Spinner. Tokens: 5. Component › spinner/*
 * Phosphor "Spinner" icon rotating. Sizes size-3 / 4 / 5 / 6 / 8 (12–32px).
 */
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { cn } from '@/registry/nativewind/lib/utils';
import { SpinnerIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Animated, Easing, Platform, View } from 'react-native';

type SpinnerProps = {
  className?: string;
  /** Px size. Prefer className `size-4` etc. */
  size?: number;
  accessibilityLabel?: string;
};

function Spinner({ className, size = 16, accessibilityLabel = 'Loading' }: SpinnerProps) {
  const rotation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    loop.start();
    return () => loop.stop();
  }, [rotation]);

  const rotate = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View role="progressbar" accessibilityLabel={accessibilityLabel}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Icon as={SpinnerIcon} size={size} className={cn('size-4', className)} />
      </Animated.View>
    </View>
  );
}

export { Spinner };
export type { SpinnerProps };
