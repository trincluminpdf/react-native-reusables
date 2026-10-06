/**
 * ◆ Lumin in-app — liquid glass surface. Figma: PDF-Mobile-DS › ◆ App Bar / Nav Bar / Toolbar (glass pills).
 * Tokens: 5. Component › glass/* — bg-background/80 · border border-border · backdrop-blur-xl · shadow-lg ·
 * rounded-full · p-1.
 * - iOS 26+: native Liquid Glass (expo-glass-effect GlassView).
 * - iOS < 26: expo-blur BlurView under a bg-background/70 tint.
 * - Android: no reliable backdrop blur → translucent bg-background/90 + border + shadow.
 * - Web: CSS backdrop-filter (backdrop-blur-xl).
 */
import { cn } from '@/registry/nativewind/lib/utils';
import { BlurView } from 'expo-blur';
import { GlassView, isLiquidGlassAvailable } from 'expo-glass-effect';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';

const GLASS_BASE =
  'flex-row items-center rounded-full border border-border p-1 shadow-lg shadow-black/10';

const liquidGlass = Platform.OS === 'ios' && isLiquidGlassAvailable();

function Glass({ className, children, style, ...props }: ViewProps) {
  const { colorScheme } = useColorScheme();

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
    <View
      className={cn(
        GLASS_BASE,
        Platform.select({ web: 'bg-background/80 backdrop-blur-xl', default: 'bg-background/90' }),
        className
      )}
      style={style}
      {...props}>
      {children}
    </View>
  );
}

export { Glass };
