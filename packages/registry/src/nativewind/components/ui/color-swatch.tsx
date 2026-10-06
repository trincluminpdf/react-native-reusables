/**
 * ◆ Lumin in-app — Color Swatch + Color Palette. Figma: PDF-Mobile-DS › ◆ Color Swatch
 * (Color Swatch: Type=Color / Add / None × Selected; Color Palette: Type × Show no color, Show custom).
 * Tokens: 5. Component › color-swatch/* (size-8, ring-2 ring-foreground with p-0.5 offset, border-border) and
 * color-palette/gap (gap-0.5). Preset colors = 4. Annotation palette — the SAME hex list as web
 * (LPA-001 › color_palette), so an annotation keeps its color across web and mobile.
 * Swatch box = size-9 (32 + p-0.5); the selected ring is drawn just outside it, so selecting never shifts
 * the row (7 swatches = 264 wide, like Figma). Hit area 44.
 * Deltas vs source: picking a custom color keeps the "+" (custom color shows as its own swatch);
 * "no color" swatch (Show no color) matches web.
 */
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { cn } from '@/registry/nativewind/lib/utils';
import { PlusIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

/** Web annotation presets (LPA-001 › color_palette), in web order. */
const ANNOTATION_PALETTES = {
  fill: ['#000000', '#d73027', '#4575b4', '#5ab4ac', '#fee090', '#e0f3f8'],
  textStamp: ['#ffffff', '#000000', '#a12214', '#da8d19', '#47771b', '#2550a3'],
  highlight: ['#fee08b', '#fc8d59', '#ffffbf', '#e6f598', '#99d594', '#3288bd'],
  comment: ['#035970', '#4575b4', '#5ab4ac', '#7fbf7b', '#d73027', '#fdae6b'],
  stamp: ['#629769', '#c33f3f', '#23348a', '#d59330', '#e2edfa', '#e5f5de'],
  type: ['#000000', '#d73027', '#4575b4', '#5ab4ac', '#fee090', '#e0f3f8'],
  measure: ['#d73027', '#000000', '#4575b4', '#5ab4ac', '#fee090', '#e0f3f8'],
  other: ['#5d7198', '#715d98', '#985d67', '#987a5d', '#5d987a', '#5d8e98'],
} as const;

type AnnotationPaletteType = keyof typeof ANNOTATION_PALETTES;

type ColorSwatchProps = {
  type?: 'color' | 'add' | 'none';
  color?: string;
  selected?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
  /** Visual scale for compact spots (Toolbar Style well, Quick Menu). Default 1. */
  scale?: number;
  className?: string;
};

/** 12-step hue ring used by Type=Add (documented raw-value exception). */
function HueRing({ size }: { size: number }) {
  const r = size / 2 - 1.5;
  const c = size / 2;
  const arcs = Array.from({ length: 12 }, (_, i) => {
    const a0 = (i / 12) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
    const d = `M ${c + r * Math.cos(a0)} ${c + r * Math.sin(a0)} A ${r} ${r} 0 0 1 ${c + r * Math.cos(a1)} ${c + r * Math.sin(a1)}`;
    return <Path key={i} d={d} stroke={`hsl(${i * 30}, 85%, 55%)`} strokeWidth={3} fill="none" />;
  });
  return (
    <Svg width={size} height={size} style={{ position: 'absolute' }} pointerEvents="none">
      {arcs}
    </Svg>
  );
}

function ColorSwatch({
  type = 'color',
  color = '#000000',
  selected = false,
  onPress,
  accessibilityLabel,
  scale = 1,
  className,
}: ColorSwatchProps) {
  const inner = 32 * scale;
  const label =
    accessibilityLabel ??
    (type === 'add' ? 'Custom color' : type === 'none' ? 'No color' : `Color ${color}`);
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      hitSlop={4}
      accessibilityRole={type === 'add' ? 'button' : 'radio'}
      accessibilityLabel={label}
      accessibilityState={{ selected, checked: type === 'add' ? undefined : selected }}
      style={{ width: inner + 4, height: inner + 4 }}
      className={cn('items-center justify-center rounded-full active:opacity-80', className)}>
      {selected ? (
        // ring-2 ring-foreground drawn outside the 36 box, so selecting never shifts the row
        <View
          pointerEvents="none"
          className="border-foreground absolute -inset-0.5 rounded-full border-2"
        />
      ) : null}
      {type === 'color' ? (
        <View
          style={{ width: inner, height: inner, backgroundColor: color }}
          className="border-border rounded-full border"
        />
      ) : type === 'none' ? (
        <View
          style={{ width: inner, height: inner }}
          className="bg-background border-border items-center justify-center overflow-hidden rounded-full border">
          <View style={{ width: inner * 1.2, height: 2 }} className="bg-destructive -rotate-45" />
        </View>
      ) : (
        <View style={{ width: inner, height: inner }} className="items-center justify-center">
          <HueRing size={inner} />
          <View
            style={{ width: inner - 8, height: inner - 8 }}
            className="bg-background items-center justify-center rounded-full">
            <Icon as={PlusIcon} weight="bold" className="text-foreground size-4" />
          </View>
        </View>
      )}
    </Pressable>
  );
}

type ColorPaletteProps = {
  type?: AnnotationPaletteType;
  /** Current color (hex) or null for "no color". */
  value: string | null;
  onValueChange: (value: string | null) => void;
  showNoColor?: boolean;
  showCustom?: boolean;
  onCustomPress?: () => void;
  className?: string;
};

function ColorPalette({
  type = 'highlight',
  value,
  onValueChange,
  showNoColor = false,
  showCustom = true,
  onCustomPress,
  className,
}: ColorPaletteProps) {
  const presets = ANNOTATION_PALETTES[type] as readonly string[];
  const isCustom = value !== null && !presets.includes(value.toLowerCase());
  return (
    <View role="radiogroup" className={cn('flex-row flex-wrap items-center gap-0.5', className)}>
      {showNoColor ? (
        <ColorSwatch type="none" selected={value === null} onPress={() => onValueChange(null)} />
      ) : null}
      {presets.map((c) => (
        <ColorSwatch
          key={c}
          color={c}
          selected={value?.toLowerCase() === c}
          onPress={() => onValueChange(c)}
        />
      ))}
      {isCustom ? (
        <ColorSwatch color={value!} selected accessibilityLabel={`Custom color ${value}`} />
      ) : null}
      {showCustom ? <ColorSwatch type="add" onPress={onCustomPress} /> : null}
    </View>
  );
}

export { ANNOTATION_PALETTES, ColorPalette, ColorSwatch };
export type { AnnotationPaletteType, ColorPaletteProps, ColorSwatchProps };
