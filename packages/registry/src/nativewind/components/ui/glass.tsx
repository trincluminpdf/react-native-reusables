/**
 * ◆ Lumin in-app — liquid glass surface. Figma: PDF-Mobile-DS › ◆ App Bar / Nav Bar / Toolbar (glass pills).
 * Tokens: 5. Component › glass/* — bg-background/80 · border border-border · backdrop-blur-xl · shadow-lg ·
 * rounded-full · p-1.
 * - iOS 26+: native Liquid Glass (expo-glass-effect GlassView).
 * - iOS < 26: expo-blur BlurView under a bg-background/70 tint.
 * - Android: no reliable backdrop blur → translucent bg-background/90 + border + shadow.
 * - Web (live preview): follows the preview's iOS | Android switch (lib/preview-platform) —
 *   iOS = Liquid Glass look-alike (CSS blur + saturation, bright rim, soft shadow; no lensing),
 *   Android = the same translucent surface as on device (no blur).
 */
import { usePreviewPlatform } from '@/registry/nativewind/lib/preview-platform';
import { cn } from '@/registry/nativewind/lib/utils';
import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

const GLASS_SHAPE = 'flex-row items-center rounded-full p-1';
const GLASS_BASE = cn(GLASS_SHAPE, 'border border-border shadow-lg shadow-black/10');
/** Android (device and web preview): translucent, no backdrop blur. */
const ANDROID_SURFACE = 'bg-background/90';
/**
 * Web preview of iOS 26+ Liquid Glass (regular). No `shadow-black/10` here: a shadow colour utility
 * would recolour the inset highlights too.
 */
const IOS_WEB_GLASS = cn(
  GLASS_SHAPE,
  'border border-white/70 bg-background/50 backdrop-blur-[14px] backdrop-saturate-[1.8]',
  'shadow-[0_10px_30px_-8px_rgba(0,0,0,0.22),0_1px_3px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9),inset_0_-1px_1px_rgba(255,255,255,0.35)]',
  'dark:border-white/15 dark:bg-background/40 dark:shadow-[0_10px_30px_-8px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.22),inset_0_-1px_1px_rgba(255,255,255,0.06)]'
);

const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

function Glass({ className, children, style, ...props }: ViewProps) {
  const { colorScheme } = useColorScheme();
  const previewOS = usePreviewPlatform();

  if (Platform.OS === 'web') {
    return (
      <View
        className={cn(
          previewOS === 'ios' ? IOS_WEB_GLASS : cn(GLASS_BASE, ANDROID_SURFACE),
          className
        )}
        style={style}
        {...props}>
        {children}
      </View>
    );
  }

  if (liquidGlass) {
    return (
      <View
        className={cn(GLASS_BASE, 'border-transparent bg-transparent', className)}
        style={style}
        {...props}>
        <GlassView
          glassEffectStyle="regular"
          isInteractive
          style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
        />
        {children}
      </View>
    );
  }

  if (Platform.OS === 'ios') {
    return (
      <View className={cn(GLASS_BASE, 'overflow-hidden', className)} style={style} {...props}>
        <BlurView
          intensity={40}
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <View className="bg-background/70 absolute inset-0" pointerEvents="none" />
        {children}
      </View>
    );
  }

  return (
    <View className={cn(GLASS_BASE, ANDROID_SURFACE, className)} style={style} {...props}>
      {children}
    </View>
  );
}

export { Glass };
