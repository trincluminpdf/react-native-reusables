/**
 * ◆ Lumin in-app — Annotation Properties (content of the Annotation Sheet). Figma: PDF-Mobile-DS › ◆ Annotation Sheet
 * (Show opacity, Sample text). Host it in ◆ Drawer (phone) or Popover (Tablet).
 * Tokens: 5. Component › annotation-sheet/* — column gap-4 px-4 pb-4 ·
 * Preview h-20 rounded-lg border bg-background, sample text-lg font-semibold over a highlight rect (px-1 py-0.5) ·
 * Color row: label text-sm font-medium + ◆ Color Palette · Separator ·
 * Opacity row gap-3: label · Slider (flex-1) · value Input w-16 + "%" (gap-1.5).
 * Deltas vs source: default highlight = palette highlight/1 (#fee08b) @ 40% (black @ 100% hid the text);
 * the same opacity control (slider + number) as the Color Picker.
 */
import {
  ColorPalette,
  type AnnotationPaletteType,
} from '@/registry/nativewind/components/ui/color-swatch';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Separator } from '@/registry/nativewind/components/ui/separator';
import { Slider } from '@/registry/nativewind/components/ui/slider';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import * as React from 'react';
import { View } from 'react-native';

type AnnotationPropertiesProps = {
  color: string | null;
  onColorChange: (color: string | null) => void;
  /** 0–100 */
  opacity?: number;
  onOpacityChange?: (opacity: number) => void;
  paletteType?: AnnotationPaletteType;
  showNoColor?: boolean;
  sampleText?: string;
  /** How the sample previews the color: highlight behind text, or text color. */
  preview?: 'highlight' | 'text';
  onCustomColorPress?: () => void;
  className?: string;
};

function OpacityRow({
  value,
  onChange,
  label = 'Opacity',
}: {
  value: number;
  onChange: (v: number) => void;
  label?: string;
}) {
  const [draft, setDraft] = React.useState(String(value));
  React.useEffect(() => setDraft(String(value)), [value]);
  return (
    <View className="flex-row items-center gap-3">
      <Text className="text-foreground text-sm font-medium">{label}</Text>
      <Slider
        className="flex-1"
        value={[value]}
        min={0}
        max={100}
        step={1}
        onValueChange={(v) => onChange(v[0] ?? value)}
        accessibilityLabel={label}
      />
      <View className="flex-row items-center gap-1.5">
        <Input
          className="w-16 text-right"
          keyboardType="number-pad"
          value={draft}
          maxLength={3}
          onChangeText={setDraft}
          onBlur={() => {
            const n = Math.max(0, Math.min(100, parseInt(draft, 10)));
            if (Number.isNaN(n)) setDraft(String(value));
            else onChange(n);
          }}
          accessibilityLabel={`${label} percent`}
        />
        <Text className="text-foreground text-sm">%</Text>
      </View>
    </View>
  );
}

function AnnotationProperties({
  color,
  onColorChange,
  opacity = 40,
  onOpacityChange,
  paletteType = 'highlight',
  showNoColor = false,
  sampleText = 'Sample text',
  preview = 'highlight',
  onCustomColorPress,
  className,
}: AnnotationPropertiesProps) {
  return (
    <View className={cn('gap-4 px-4 pb-4', className)}>
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="bg-background border-border h-20 items-center justify-center rounded-lg border">
        <View className="px-1 py-0.5">
          {preview === 'highlight' && color ? (
            <View
              className="absolute inset-0"
              style={{ backgroundColor: color, opacity: opacity / 100 }}
            />
          ) : null}
          <Text
            className="text-foreground text-lg font-semibold"
            style={preview === 'text' && color ? { color, opacity: opacity / 100 } : undefined}>
            {sampleText}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between gap-3">
        <Text className="text-foreground text-sm font-medium">Color</Text>
        <ColorPalette
          type={paletteType}
          value={color}
          onValueChange={onColorChange}
          showNoColor={showNoColor}
          onCustomPress={onCustomColorPress}
          className="shrink justify-end"
        />
      </View>
      {onOpacityChange ? (
        <>
          <Separator />
          <OpacityRow value={opacity} onChange={onOpacityChange} />
        </>
      ) : null}
    </View>
  );
}

export { AnnotationProperties, OpacityRow };
export type { AnnotationPropertiesProps };
