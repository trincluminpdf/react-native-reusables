import { TextSelection } from '@/registry/nativewind/components/ui/text-selection';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { FakePdfPage } from '@showcase/examples/in-app-shared';
import * as React from 'react';
import { View } from 'react-native';

function Default() {
  return (
    <PreviewStack>
      <Spec label="◆ Text Selection · two lines selected on a page">
        <View>
          <FakePdfPage>
            <TextSelection
              rects={[
                { x: 20, y: 18, width: 268, height: 14 },
                { x: 20, y: 36, width: 126, height: 14 },
              ]}
            />
          </FakePdfPage>
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Default', component: Default }];
