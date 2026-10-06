import { Banner } from '@/registry/nativewind/components/ui/banner';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

const DEFAULT_VIEWER = {
  title: 'Set Lumin as your default PDF viewer',
  description:
    'Open PDFs from any app straight into Lumin. Choose Lumin, then "Always" on the next screen.',
};

function Variants() {
  const [open, setOpen] = React.useState(true);
  return (
    <PreviewStack>
      <Spec label="◆ Show actions=true · Not now dismisses">
        {open ? (
          <Banner
            {...DEFAULT_VIEWER}
            actionLabel="Set as default"
            onActionPress={() => {}}
            onDismiss={() => setOpen(false)}
          />
        ) : (
          <Button variant="outline" onPress={() => setOpen(true)}>
            <Text>Show banner again</Text>
          </Button>
        )}
      </Spec>
      <Spec label="◆ Show actions=false">
        <Banner {...DEFAULT_VIEWER} />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Show actions', component: Variants }];

export { DEFAULT_VIEWER };
