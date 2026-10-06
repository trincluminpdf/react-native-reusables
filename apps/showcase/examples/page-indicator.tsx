import { Button } from '@/registry/nativewind/components/ui/button';
import { PageIndicator } from '@/registry/nativewind/components/ui/page-indicator';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

function Default() {
  const [page, setPage] = React.useState(1);
  return (
    <PreviewStack>
      <Spec label="◆ Page Indicator · Label=1 of 20">
        <PageIndicator page={page} total={20} />
      </Spec>
      <Spec label="Scroll stand-in" row>
        <Button size="sm" variant="outline" onPress={() => setPage((p) => Math.max(1, p - 1))}>
          <Text>Prev</Text>
        </Button>
        <Button size="sm" variant="outline" onPress={() => setPage((p) => Math.min(20, p + 1))}>
          <Text>Next</Text>
        </Button>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Default', component: Default }];
