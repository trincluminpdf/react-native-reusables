import { Button } from '@/registry/nativewind/components/ui/button';
import { Text } from '@/registry/nativewind/components/ui/text';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/registry/nativewind/components/ui/tooltip';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { Platform } from 'react-native';

function Example() {
  return (
    <PreviewStack className="items-center">
      <Spec row label="bg-primary rounded-md px-3 py-2 (Tablet sm:py-1.5) · opens on press on native">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">
              <Text>{Platform.select({ web: 'Hover', default: 'Press' })}</Text>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <Text>Add to library</Text>
          </TooltipContent>
        </Tooltip>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Tooltip', component: Example }];
