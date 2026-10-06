import { Checkbox } from '@/registry/nativewind/components/ui/checkbox';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Label } from '@/registry/nativewind/components/ui/label';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

function Example() {
  const [checked, setChecked] = React.useState(false);
  return (
    <PreviewStack>
      <Spec label="State=Default · text-sm medium, leading-normal ◆ (base kit: leading-none)">
        <View className="w-full gap-2">
          <Label nativeID="email">Email</Label>
          <Input aria-labelledby="email" placeholder="m@example.com" />
        </View>
      </Spec>
      <Spec label="Paired with Checkbox (press the label)">
        <View className="flex-row items-center gap-2">
          <Checkbox checked={checked} onCheckedChange={setChecked} />
          <Label onPress={() => setChecked((v) => !v)}>Remember me</Label>
        </View>
      </Spec>
      <Spec label="State=Disabled · opacity-50">
        <Label disabled>Disabled label</Label>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Label', component: Example }];
