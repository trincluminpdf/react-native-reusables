import { Button } from '@/registry/nativewind/components/ui/button';
import { Toast, toast } from '@/registry/nativewind/components/ui/sonner';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

function Static() {
  return (
    <PreviewStack>
      <Spec label="State=Default · title only">
        <Toast title="Title Text" />
      </Spec>
      <Spec label="Description + Action (Default) / Cancel (Secondary)">
        <Toast
          title="Document moved to Trash"
          description="Contract.pdf"
          action={{ label: 'Undo' }}
          cancel={{ label: 'Cancel' }}
        />
      </Spec>
      <Spec label="Icon=Success · Error · Info · Warning · Loading">
        <Toast type="success" title="Saved" />
        <Toast type="error" title="Upload failed" />
        <Toast type="info" title="Syncing in background" />
        <Toast type="warning" title="Storage almost full" />
        <Toast type="loading" title="Uploading…" />
      </Spec>
    </PreviewStack>
  );
}

function Live() {
  return (
    <PreviewStack>
      <Spec row label="toast() — appears at the top, auto-dismiss 4s">
        <Button
          variant="outline"
          onPress={() =>
            toast('Document shared', {
              description: 'Anyone with the link can view.',
              action: { label: 'Undo' },
            })
          }>
          <Text>Show toast</Text>
        </Button>
        <Button variant="outline" onPress={() => toast.success('Signature saved')}>
          <Text>toast.success</Text>
        </Button>
        <Button variant="outline" onPress={() => toast.error('Could not upload file')}>
          <Text>toast.error</Text>
        </Button>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Toast', component: Static },
  { name: 'toast()', component: Live },
];
