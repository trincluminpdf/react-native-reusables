import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Toggle } from '@/registry/nativewind/components/ui/toggle';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { TextBIcon, TextItalicIcon, TextUnderlineIcon } from 'phosphor-react-native';
import * as React from 'react';

function Examples() {
  const [b, setB] = React.useState(true);
  const [i, setI] = React.useState(false);
  const [u, setU] = React.useState(false);
  return (
    <PreviewStack>
      <Spec label="Variant=Default · Pressed=Off / On" row>
        <Toggle pressed={i} onPressedChange={setI} accessibilityLabel="Italic">
          <Icon as={TextItalicIcon} size={16} />
        </Toggle>
        <Toggle pressed={b} onPressedChange={setB} accessibilityLabel="Bold">
          <Icon as={TextBIcon} size={16} />
        </Toggle>
      </Spec>
      <Spec label="Variant=Outline" row>
        <Toggle variant="outline" pressed={u} onPressedChange={setU} accessibilityLabel="Underline">
          <Icon as={TextUnderlineIcon} size={16} />
        </Toggle>
      </Spec>
      <Spec label="Size=sm · default · lg (h-9 / h-10 / h-11, Tablet −4)" row>
        <Toggle size="sm" variant="outline" pressed onPressedChange={() => {}} accessibilityLabel="Bold">
          <Icon as={TextBIcon} size={16} />
        </Toggle>
        <Toggle variant="outline" pressed onPressedChange={() => {}} accessibilityLabel="Bold">
          <Icon as={TextBIcon} size={16} />
        </Toggle>
        <Toggle size="lg" variant="outline" pressed onPressedChange={() => {}} accessibilityLabel="Bold">
          <Icon as={TextBIcon} size={16} />
        </Toggle>
      </Spec>
      <Spec label="State=Disabled" row>
        <Toggle disabled pressed={false} onPressedChange={() => {}} accessibilityLabel="Bold">
          <Icon as={TextBIcon} size={16} />
        </Toggle>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'Variant · Size', component: Examples }];
