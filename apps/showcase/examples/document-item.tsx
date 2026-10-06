import { DocumentItem } from '@/registry/nativewind/components/ui/document-item';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { DEMO_DOCS } from '@showcase/examples/in-app-shared';
import * as React from 'react';
import { View } from 'react-native';

function List() {
  return (
    <PreviewStack>
      <Spec label="◆ Layout=List · Starred / not starred · press = State=Pressed">
        <View className="-mx-4">
          {DEMO_DOCS.slice(0, 4).map((d, i, a) => (
            <DocumentItem key={d.title} {...d} last={i === a.length - 1} onPress={() => {}} />
          ))}
        </View>
      </Spec>
    </PreviewStack>
  );
}

function Grid() {
  return (
    <PreviewStack>
      <Spec label="◆ Layout=Grid · 2 columns, meta = date only">
        <View className="gap-4">
          {[0, 2].map((start) => (
            <View key={start} className="flex-row gap-3">
              {DEMO_DOCS.slice(start, start + 2).map((d) => (
                <DocumentItem key={d.title} {...d} layout="grid" onPress={() => {}} />
              ))}
            </View>
          ))}
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Layout=List', component: List },
  { name: 'Layout=Grid', component: Grid },
];
