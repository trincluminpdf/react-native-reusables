import { ColorPicker } from '@/registry/nativewind/components/ui/color-picker';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

function Default() {
  const [color, setColor] = React.useState<string | null>('#fee08b');
  const [opacity, setOpacity] = React.useState(40);
  return (
    <PreviewStack>
      <Spec label="◆ Color Picker · Show header=true">
        <View className="border-border rounded-xl border pt-2">
          <ColorPicker
            value={color}
            onValueChange={setColor}
            opacity={opacity}
            onOpacityChange={setOpacity}
            onBack={() => {}}
            onClose={() => {}}
          />
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Default', component: Default }];
