import { Separator } from '@/registry/nativewind/components/ui/separator';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

function Example() {
  return (
    <PreviewStack>
      <Spec label="Horizontal · h-px bg-border">
        <View>
          <Text className="text-sm font-medium">Lumin PDF</Text>
          <Text className="text-muted-foreground text-sm">Edit, sign and share documents.</Text>
        </View>
        <Separator className="my-2" />
        <Spec label="Vertical · h-5" row>
          <View className="h-5 flex-row items-center gap-4">
            <Text className="text-sm">Files</Text>
            <Separator orientation="vertical" />
            <Text className="text-sm">Shared</Text>
            <Separator orientation="vertical" />
            <Text className="text-sm">Trash</Text>
          </View>
        </Spec>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Orientation', component: Example }];
