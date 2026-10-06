/**
 * ◆ Lumin custom — not in RNR. Code only (no PDF-Mobile-DS page).
 * Source: Lumin brand loader, variant Lumin ("Lumin animated loaders 2" › snippets/lumin-loader.html).
 * Motion data: lib/lumin-loader-motion.ts (generated from the snippet — don't hand-edit).
 *
 * - Loader: stroke-trim of the Lumin mark, 2.5s linear loop. Default 48px, brand #191C1D
 *   (dark mode: foreground). Size and colour are the only knobs, like the source snippet.
 * - LoaderScreen: Loader centred on bg-background, optional label, appears after `delay`
 *   (150ms) so fast loads never flash it.
 * Use for app launch and opening a whole file. Inline / button loading stays on ◆ Spinner.
 *
 * Web renders the source SVG + CSS keyframes as-is. Native animates the same stops with
 * Reanimated on the UI thread (react-native-svg has no pathLength, so units are scaled by
 * the real path length). Reduced motion → static full mark.
 */
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import {
  LUMIN_LOADER_DURATION_MS,
  LUMIN_LOADER_KEYFRAMES_CSS,
  LUMIN_LOADER_PATH,
  LUMIN_LOADER_PATH_LENGTH,
  LUMIN_LOADER_STOPS,
  LUMIN_LOADER_STROKE_WIDTH,
  LUMIN_LOADER_TRANSLATE,
  LUMIN_LOADER_VIEWBOX,
} from '@/registry/nativewind/lib/lumin-loader-motion';
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { Animated as RNAnimated, Platform, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { G, Path } from 'react-native-svg';

const DEFAULT_COLOR_CLASS = 'text-[#191C1D] dark:text-foreground';

type LoaderProps = {
  /** Size of the mark in px (the box hugs the artwork). Default 48. */
  size?: number;
  /** Text colour class sets the stroke, e.g. `text-primary`. */
  className?: string;
  /** Explicit stroke colour; wins over className. */
  color?: string;
  accessibilityLabel?: string;
};

function Loader({ size = 48, className, color, accessibilityLabel = 'Loading' }: LoaderProps) {
  if (Platform.OS === 'web') {
    return (
      <View
        role="progressbar"
        aria-label={accessibilityLabel}
        className={cn(DEFAULT_COLOR_CLASS, className)}
        style={{ width: size, height: size }}>
        <WebGlyph color={color} />
      </View>
    );
  }
  return (
    <View role="progressbar" accessibilityLabel={accessibilityLabel}>
      <Icon
        as={NativeGlyph}
        size={size}
        className={cn(DEFAULT_COLOR_CLASS, className)}
        {...(color ? { color } : null)}
      />
    </View>
  );
}

/* ---------------------------------- web ---------------------------------- */

const WEB_CSS = `
.lumin-loader-trim { animation: lumin-loader-trim ${LUMIN_LOADER_DURATION_MS}ms linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .lumin-loader-trim { animation: none; stroke-dasharray: 100 100; stroke-dashoffset: 0; stroke-opacity: 1; }
}
${LUMIN_LOADER_KEYFRAMES_CSS}
`;

/** Source snippet markup (react-dom elements; react-native-web renders through react-dom). */
function WebGlyph({ color }: { color?: string }) {
  const h = React.createElement;
  return h(
    React.Fragment,
    null,
    h('style', { dangerouslySetInnerHTML: { __html: WEB_CSS } }),
    h(
      'svg',
      {
        viewBox: LUMIN_LOADER_VIEWBOX,
        xmlns: 'http://www.w3.org/2000/svg',
        'aria-hidden': true,
        style: { display: 'block', width: '100%', height: '100%', overflow: 'visible' },
      },
      h(
        'g',
        { transform: `translate(${LUMIN_LOADER_TRANSLATE})` },
        h('path', {
          className: 'lumin-loader-trim',
          pathLength: 100,
          d: LUMIN_LOADER_PATH,
          fill: 'none',
          stroke: color ?? 'currentColor',
          strokeWidth: LUMIN_LOADER_STROKE_WIDTH,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        })
      )
    )
  );
}

/* --------------------------------- native -------------------------------- */

const AnimatedPath = Animated.createAnimatedComponent(Path);
const UNIT = LUMIN_LOADER_PATH_LENGTH / 100; // pathLength=100 units → real length
const STOPS = LUMIN_LOADER_STOPS;

function NativeGlyph({ size = 48, color = '#191C1D' }: { size?: number | string; color?: string }) {
  const reducedMotion = useReducedMotion();
  const progress = useSharedValue(0);

  React.useEffect(() => {
    if (reducedMotion) return;
    progress.value = 0;
    progress.value = withRepeat(
      withTiming(1, { duration: LUMIN_LOADER_DURATION_MS, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(progress);
  }, [reducedMotion, progress]);

  const animatedProps = useAnimatedProps(() => {
    const p = progress.value;
    let i = 0;
    while (i < STOPS.length - 2 && STOPS[i + 1][0] <= p) i++;
    const a = STOPS[i];
    const b = STOPS[i + 1];
    const t = Math.min(1, Math.max(0, (p - a[0]) / (b[0] - a[0])));
    const dash = (a[1] + (b[1] - a[1]) * t) * UNIT;
    return {
      strokeDasharray: [dash, 100 * UNIT],
      strokeDashoffset: (a[2] + (b[2] - a[2]) * t) * UNIT,
      strokeOpacity: a[3] + (b[3] - a[3]) * t,
    };
  });

  const stroke = {
    d: LUMIN_LOADER_PATH,
    fill: 'none',
    stroke: color,
    strokeWidth: LUMIN_LOADER_STROKE_WIDTH,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <Svg width={size} height={size} viewBox={LUMIN_LOADER_VIEWBOX} style={{ overflow: 'visible' }}>
      <G transform={`translate(${LUMIN_LOADER_TRANSLATE})`}>
        {reducedMotion ? <Path {...stroke} /> : <AnimatedPath {...stroke} animatedProps={animatedProps} />}
      </G>
    </Svg>
  );
}

/* ------------------------------ LoaderScreen ----------------------------- */

type LoaderScreenProps = {
  /** Optional line under the loader, e.g. "Opening file…". */
  label?: string;
  /** ms before the loader fades in (the background shows at once). Default 150. */
  delay?: number;
  size?: number;
  /** Container classes (default fills the parent on bg-background). */
  className?: string;
  loaderClassName?: string;
};

function LoaderScreen({ label, delay = 150, size = 48, className, loaderClassName }: LoaderScreenProps) {
  const opacity = React.useRef(new RNAnimated.Value(0)).current;

  React.useEffect(() => {
    const anim = RNAnimated.timing(opacity, {
      toValue: 1,
      duration: 200,
      delay,
      useNativeDriver: Platform.OS !== 'web',
    });
    anim.start();
    return () => anim.stop();
  }, [delay, opacity]);

  return (
    <View className={cn('bg-background flex-1 items-center justify-center', className)}>
      <RNAnimated.View style={{ opacity, alignItems: 'center', gap: 16 }}>
        <Loader size={size} className={loaderClassName} accessibilityLabel={label ?? 'Loading'} />
        {label ? <Text className="text-muted-foreground text-sm">{label}</Text> : null}
      </RNAnimated.View>
    </View>
  );
}

export { Loader, LoaderScreen };
export type { LoaderProps, LoaderScreenProps };
