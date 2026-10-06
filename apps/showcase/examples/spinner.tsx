import { Button } from '@/registry/nativewind/components/ui/button';
import { Spinner } from '@/registry/nativewind/components/ui/spinner';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

function Sizes() {
  return (
    <PreviewStack>
      <Spec label="Size=3 / 4 / 5 / 6 / 8 (12–32px) · Phosphor Spinner" row>
        <Spinner size={12} className="size-3" />
        <Spinner size={16} className="size-4" />
        <Spinner size={20} className="size-5" />
        <Spinner size={24} className="size-6" />
        <Spinner size={32} className="size-8" />
      </Spec>
      <Spec label="In a Button (State=Loading)">
        <Button loading>
          <Text>Loading</Text>
        </Button>
      </Spec>
      <Spec label="Color follows text (text-muted-foreground)" row>
        <Spinner size={20} className="text-muted-foreground size-5" />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Size', component: Sizes }];
