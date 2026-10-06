/**
 * ◆ Lumin in-app — Color Picker (custom color, opened from the "+" swatch). Figma: PDF-Mobile-DS › ◆ Color Picker
 * (+ private _Color Picker / Grid). Host it in the same ◆ Drawer as the Annotation Sheet (Back returns to it).
 * Tokens: 5. Component › color-picker/* — column gap-4 px-4 pb-4 · Header: Back · title text-base font-semibold · Close ·
 * Presets (◆ Color Palette, no "+") · Custom: 12×9 grid rounded-lg border (grayscale row + 8 tint rows) ·
 * Hex row (Input w-[120px]) · Opacity row (same as the Annotation Sheet).
 * The grid colors are a documented raw-value exception (spectrum, not tokens).
 */
import { OpacityRow } from '@/registry/nativewind/components/ui/annotation-sheet';
import { Button } from '@/registry/nativewind/components/ui/button';
import {
  ColorPalette,
  type AnnotationPaletteType,
} from '@/registry/nativewind/components/ui/color-swatch';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Text } from '@/registry/nativewind/components/ui/text';
import { cn } from '@/registry/nativewind/lib/utils';
import { ArrowLeftIcon, XIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

/** Figma › _Color Picker / Grid (95:6): 9 rows × 12 columns. */
const COLOR_GRID = [
  'ffffff,e8e8e8,d1d1d1,b9b9b9,a2a2a2,8b8b8b,747474,5d5d5d,464646,2e2e2e,171717,000000',
  '08415e,08255e,16085e,3a085e,5e085e,5e0825,5e0808,5e2508,5e3a08,5e5008,5e5e08,335e08',
  '0b628e,0b378e,210b8e,570b8e,8e0b8e,8e0b37,8e0b0b,8e370b,8e570b,8e780b,8e8e0b,4d8e0b',
  '0f83bd,0f49bd,2c0fbd,740fbd,bd0fbd,bd0f49,bd0f0f,bd490f,bd740f,bda00f,bdbd0f,66bd0f',
  '13a4ec,135bec,3713ec,9213ec,ec13ec,ec135b,ec1313,ec5b13,ec9213,ecc813,ecec13,80ec13',
  '42b6f0,427cf0,5f42f0,a742f0,f042f0,f0427c,f04242,f07c42,f0a742,f0d342,f0f042,99f042',
  '71c8f4,719df4,8771f4,bd71f4,f471f4,f4719d,f47171,f49d71,f4bd71,f4de71,f4f471,b2f471',
  'a1daf7,a1bef7,afa1f7,d3a1f7,f7a1f7,f7a1be,f7a1a1,f7bea1,f7d3a1,f7e9a1,f7f7a1,ccf7a1',
  'd0edfb,d0defb,d7d0fb,e9d0fb,fbd0fb,fbd0de,fbd0d0,fbded0,fbe9d0,fbf4d0,fbfbd0,e5fbd0',
].map((row) => row.split(',').map((h) => `#${h}`));

const HEX_RE = /^#?([0-9a-f]{6})$/i;

function ColorGrid({
  value,
  onValueChange,
}: {
  value: string | null;
  onValueChange: (c: string) => void;
}) {
  return (
    <View role="radiogroup" className="border-border overflow-hidden rounded-lg border">
      {COLOR_GRID.map((row, r) => (
        <View key={r} className="h-6 flex-row">
          {row.map((c) => {
            const selected = value?.toLowerCase() === c;
            return (
              <Pressable
                key={c}
                onPress={() => onValueChange(c)}
                accessibilityRole="radio"
                accessibilityLabel={`Color ${c}`}
                accessibilityState={{ checked: selected }}
                style={{ backgroundColor: c }}
                className={cn(
                  'flex-1',
                  selected && 'z-10 border-2 border-white shadow-sm shadow-black/40'
                )}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

type ColorPickerProps = {
  value: string | null;
  onValueChange: (c: string) => void;
  opacity: number;
  onOpacityChange: (o: number) => void;
  paletteType?: AnnotationPaletteType;
  title?: string;
  onBack?: () => void;
  onClose?: () => void;
  /** Hide the header when the host already shows one (Show header=false). */
  showHeader?: boolean;
  className?: string;
};

function ColorPicker({
  value,
  onValueChange,
  opacity,
  onOpacityChange,
  paletteType = 'highlight',
  title = 'Color',
  onBack,
  onClose,
  showHeader = true,
  className,
}: ColorPickerProps) {
  const [hex, setHex] = React.useState((value ?? '').replace('#', '').toUpperCase());
  React.useEffect(() => setHex((value ?? '').replace('#', '').toUpperCase()), [value]);

  return (
    <View className={cn('gap-4 px-4 pb-4', className)}>
      {showHeader ? (
        <View className="h-10 flex-row items-center">
          {onBack ? (
            <Button variant="ghost" size="icon" onPress={onBack} accessibilityLabel="Back">
              <Icon as={ArrowLeftIcon} className="text-foreground size-5" />
            </Button>
          ) : (
            <View className="size-10" />
          )}
          <Text
            role="heading"
            className="text-foreground flex-1 text-center text-base font-semibold">
            {title}
          </Text>
          {onClose ? (
            <Button variant="ghost" size="icon" onPress={onClose} accessibilityLabel="Close">
              <Icon as={XIcon} className="text-foreground size-5" />
            </Button>
          ) : (
            <View className="size-10" />
          )}
        </View>
      ) : null}
      <View className="gap-3">
        <Text className="text-foreground text-sm font-medium">Presets</Text>
        <ColorPalette
          type={paletteType}
          value={value}
          onValueChange={(c) => c && onValueChange(c)}
          showCustom={false}
        />
      </View>
      <View className="gap-3">
        <Text className="text-foreground text-sm font-medium">Custom</Text>
        <ColorGrid value={value} onValueChange={onValueChange} />
      </View>
      <View className="flex-row items-center gap-3">
        <Text className="text-foreground flex-1 text-sm font-medium">Hex</Text>
        <Input
          className="w-[120px] font-mono uppercase"
          value={`#${hex}`}
          autoCapitalize="characters"
          autoCorrect={false}
          maxLength={7}
          onChangeText={(t) =>
            setHex(
              t
                .replace(/[^0-9a-f]/gi, '')
                .slice(0, 6)
                .toUpperCase()
            )
          }
          onBlur={() => {
            const m = HEX_RE.exec(hex);
            if (m) onValueChange(`#${m[1]!.toLowerCase()}`);
            else setHex((value ?? '').replace('#', '').toUpperCase());
          }}
          accessibilityLabel="Hex color"
        />
      </View>
      <OpacityRow value={opacity} onChange={onOpacityChange} />
    </View>
  );
}

export { COLOR_GRID, ColorPicker };
export type { ColorPickerProps };
