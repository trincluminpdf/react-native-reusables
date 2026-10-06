import { Slider } from '@/registry/nativewind/components/ui/slider';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

function Examples() {
  const [single, setSingle] = React.useState([50]);
  const [range, setRange] = React.useState([25, 75]);
  return (
    <PreviewStack>
      <Spec label={`Range=No · drag the thumb (${single[0]})`}>
        <Slider value={single} onValueChange={setSingle} />
      </Spec>
      <Spec label={`Range=Yes (${range[0]} – ${range[1]})`}>
        <Slider value={range} onValueChange={setRange} />
      </Spec>
      <Spec label="State=Disabled">
        <Slider defaultValue={[30]} disabled />
      </Spec>
      <Text className="text-muted-foreground text-xs">Thumb is 12px — hit area extends to 44.</Text>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Range · State', component: Examples }];
