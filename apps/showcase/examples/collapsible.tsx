import { Button } from '@/registry/nativewind/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/registry/nativewind/components/ui/collapsible';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { CaretUpDownIcon } from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

function Row({ children }: { children: string }) {
  return (
    <View className="border-border bg-background w-full rounded-md border px-4 py-2">
      <Text className="text-sm">{children}</Text>
    </View>
  );
}

function Example() {
  return (
    <PreviewStack>
      <Spec label="Usage example (trigger Button + content) — RNR primitive, unstyled">
        <Collapsible className="w-full gap-2">
          <View className="flex-row items-center justify-between gap-4 px-4">
            <Text className="text-sm font-semibold">Order #4189</Text>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8 sm:size-8" accessibilityLabel="Toggle details">
                <Icon as={CaretUpDownIcon} size={16} />
              </Button>
            </CollapsibleTrigger>
          </View>
          <Row>Status: Shipped</Row>
          <CollapsibleContent className="gap-2">
            <Row>Price: $100 USD</Row>
            <Row>Location: USA</Row>
          </CollapsibleContent>
        </Collapsible>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Example', component: Example }];
