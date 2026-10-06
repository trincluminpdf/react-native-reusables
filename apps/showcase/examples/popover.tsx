import { Button } from '@/registry/nativewind/components/ui/button';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Label } from '@/registry/nativewind/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/registry/nativewind/components/ui/popover';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

function Example() {
  return (
    <PreviewStack>
      <Spec row label="w-72 rounded-md border p-4 · opens on press on native">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Text>Open popover</Text>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-72" side="bottom">
            <View className="gap-4">
              <View className="gap-0.5">
                <Text className="text-sm font-medium">Dimensions</Text>
                <Text className="text-muted-foreground text-sm">Set the dimensions for the layer.</Text>
              </View>
              <View className="flex-row items-center gap-4">
                <Label className="w-16">Width</Label>
                <Input defaultValue="100%" className="flex-1" />
              </View>
              <View className="flex-row items-center gap-4">
                <Label className="w-16">Height</Label>
                <Input defaultValue="25px" className="flex-1" />
              </View>
            </View>
          </PopoverContent>
        </Popover>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Popover', component: Example }];
