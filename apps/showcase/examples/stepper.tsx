import { Label } from '@/registry/nativewind/components/ui/label';
import { Stepper } from '@/registry/nativewind/components/ui/stepper';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

function Default() {
  const [copies, setCopies] = React.useState(2);
  const [width, setWidth] = React.useState(3);
  return (
    <PreviewStack>
      <Spec label="◆ Type=Default · min 1 · max 10 (long-press repeats)">
        <View className="flex-row items-center justify-between">
          <Label nativeID="copies">Copies</Label>
          <Stepper
            value={copies}
            onValueChange={setCopies}
            min={1}
            max={10}
            accessibilityLabel="Copies"
          />
        </View>
      </Spec>
      <Spec label="◆ Type=Compact · value shown beside it (iOS UIStepper look)">
        <View className="flex-row items-center justify-between">
          <Text className="text-foreground text-sm">Stroke width · {width} pt</Text>
          <Stepper
            type="compact"
            value={width}
            onValueChange={setWidth}
            min={1}
            max={12}
            accessibilityLabel="Stroke width"
          />
        </View>
      </Spec>
    </PreviewStack>
  );
}

function States() {
  const noop = () => {};
  return (
    <PreviewStack>
      <Spec label="◆ State=Min (− disabled)" row>
        <Stepper value={1} min={1} onValueChange={noop} />
        <Stepper type="compact" value={1} min={1} onValueChange={noop} />
      </Spec>
      <Spec label="◆ State=Max (+ disabled)" row>
        <Stepper value={99} max={99} onValueChange={noop} />
        <Stepper type="compact" value={99} max={99} onValueChange={noop} />
      </Spec>
      <Spec label="◆ State=Disabled" row>
        <Stepper value={2} disabled onValueChange={noop} />
        <Stepper type="compact" value={2} disabled onValueChange={noop} />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Type', component: Default },
  { name: 'State', component: States },
];
