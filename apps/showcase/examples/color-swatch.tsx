import {
  ANNOTATION_PALETTES,
  ColorPalette,
  ColorSwatch,
  type AnnotationPaletteType,
} from '@/registry/nativewind/components/ui/color-swatch';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

function Swatch() {
  return (
    <PreviewStack>
      <Spec label="◆ Type=Color · Selected=false / true" row>
        <ColorSwatch color="#fee08b" />
        <ColorSwatch color="#fee08b" selected />
      </Spec>
      <Spec label="◆ Type=None · Selected=false / true (no color)" row>
        <ColorSwatch type="none" />
        <ColorSwatch type="none" selected />
      </Spec>
      <Spec label="◆ Type=Add (opens Color Picker)" row>
        <ColorSwatch type="add" onPress={() => {}} />
      </Spec>
    </PreviewStack>
  );
}

function PaletteRow({ type, noColor }: { type: AnnotationPaletteType; noColor?: boolean }) {
  const [value, setValue] = React.useState<string | null>(ANNOTATION_PALETTES[type][0]);
  return (
    <Spec label={`◆ Type=${type} · Show no color=${noColor ? 'True' : 'False'}`}>
      <ColorPalette
        type={type}
        value={value}
        onValueChange={setValue}
        showNoColor={noColor}
        onCustomPress={() => {}}
      />
    </Spec>
  );
}

function Palette() {
  return (
    <PreviewStack>
      {(Object.keys(ANNOTATION_PALETTES) as AnnotationPaletteType[]).map((t) => (
        <PaletteRow key={t} type={t} />
      ))}
      <PaletteRow type="fill" noColor />
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Color Swatch', component: Swatch },
  { name: 'Color Palette (web presets)', component: Palette },
];
