import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

function Headings() {
  return (
    <PreviewStack>
      <Spec label="H1 (Mobile)">
        <Text variant="h1">Sign anywhere</Text>
      </Spec>
      <Spec label="H2">
        <Text variant="h2">Your documents</Text>
      </Spec>
      <Spec label="H3 · H4">
        <Text variant="h3">Recent files</Text>
        <Text variant="h4">Shared with you</Text>
      </Spec>
    </PreviewStack>
  );
}

function Body() {
  return (
    <PreviewStack>
      <Spec label="P">
        <Text variant="p" className="mt-0 sm:mt-0">
          Lumin lets you edit, sign and share PDFs from any device.
        </Text>
      </Spec>
      <Spec label="Lead · Large ◆ medium · Small ◆ normal · Muted">
        <Text variant="lead">A modal dialog that interrupts the user.</Text>
        <Text variant="large">Are you absolutely sure?</Text>
        <Text variant="small">Email address</Text>
        <Text variant="muted">Enter your email address.</Text>
      </Spec>
      <Spec label="Blockquote · pl-3 (Tablet sm:pl-6)">
        <Text variant="blockquote" className="mt-0 sm:mt-0">
          “After all,” he said, “everyone enjoys a good joke.”
        </Text>
      </Spec>
      <Spec label="Inline code · List ◆ (View + bullets)">
        <Text variant="code" className="self-start">
          npx expo install
        </Text>
        <View className="w-full gap-2 pl-2">
          {['1st level of puns: 5 gold coins', '2nd level of jokes: 10 gold coins', '3rd level of one-liners: 20 gold coins'].map(
            (l) => (
              <View key={l} className="flex-row gap-2">
                <Text>•</Text>
                <Text className="flex-1">{l}</Text>
              </View>
            )
          )}
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Headings', component: Headings },
  { name: 'Body · Blockquote · List', component: Body },
];
