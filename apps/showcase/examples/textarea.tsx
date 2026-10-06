import { Textarea } from '@/registry/nativewind/components/ui/textarea';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

function States() {
  return (
    <PreviewStack>
      <Spec label="State=Default · min-h-16 px-3 py-2">
        <Textarea placeholder="Type your message here." />
      </Spec>
      <Spec label="State=Filled · tap → Focus ◆">
        <Textarea defaultValue="Please review and sign by Friday." />
      </Spec>
      <Spec label="State=Disabled">
        <Textarea placeholder="Disabled" editable={false} />
      </Spec>
      <Spec label="State=Error ◆">
        <Textarea defaultValue="Too short" aria-invalid />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'State', component: States }];
