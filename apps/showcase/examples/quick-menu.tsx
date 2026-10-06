import { QuickMenu } from '@/registry/nativewind/components/ui/quick-menu';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

function Variants() {
  return (
    <PreviewStack>
      <Spec label="◆ Show color=true (highlight selected)">
        <QuickMenu color="#fee08b" />
      </Spec>
      <Spec label="◆ Show color=false (e.g. a stamp)">
        <QuickMenu />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Show color', component: Variants }];
