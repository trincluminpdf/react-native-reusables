import { Icon } from '@/registry/nativewind/components/ui/icon';
import { ToggleGroup, ToggleGroupItem } from '@/registry/nativewind/components/ui/toggle-group';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { TextBIcon, TextItalicIcon, TextUnderlineIcon } from 'phosphor-react-native';
import * as React from 'react';

const ITEMS = [
  { value: 'bold', icon: TextBIcon, label: 'Bold' },
  { value: 'italic', icon: TextItalicIcon, label: 'Italic' },
  { value: 'underline', icon: TextUnderlineIcon, label: 'Underline' },
];

function Group({
  fill,
  spacing,
  vertical,
  labels,
}: {
  fill?: boolean;
  spacing?: boolean;
  vertical?: boolean;
  labels?: boolean;
}) {
  const [value, setValue] = React.useState<string[]>(['bold']);
  return (
    <ToggleGroup
      type="multiple"
      value={value}
      onValueChange={setValue}
      variant="outline"
      fill={fill}
      spacing={spacing}
      orientation={vertical ? 'vertical' : 'horizontal'}>
      {ITEMS.map((it, i) => (
        <ToggleGroupItem
          key={it.value}
          value={it.value}
          isFirst={i === 0}
          isLast={i === ITEMS.length - 1}
          accessibilityLabel={it.label}>
          <Icon as={it.icon} size={16} />
          {labels ? <Text>{it.label}</Text> : null}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

function Types() {
  return (
    <PreviewStack>
      <Spec label="Type=Default (base-kit joined items)">
        <Group />
      </Spec>
      <Spec label="Type=Fill ◆ (items stretch)">
        <Group fill />
      </Spec>
      <Spec label="Type=With Spacing ◆ (gap-2)">
        <Group spacing />
      </Spec>
    </PreviewStack>
  );
}

function Vertical() {
  return (
    <PreviewStack>
      <Spec label="Orientation=Vertical ◆ (gap-1)">
        <Group vertical labels />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Type', component: Types },
  { name: 'Orientation=Vertical ◆', component: Vertical },
];
