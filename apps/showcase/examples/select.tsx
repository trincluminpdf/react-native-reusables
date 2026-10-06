import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/registry/nativewind/components/ui/select';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FRUITS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
];

function Example({
  size,
  invalid,
  disabled,
  filled,
}: {
  size?: 'default' | 'sm';
  invalid?: boolean;
  disabled?: boolean;
  filled?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Select defaultValue={filled ? FRUITS[1] : undefined} disabled={disabled} className="w-full">
      <SelectTrigger size={size} aria-invalid={invalid} className="w-full">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent
        insets={{ top: insets.top, bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }), left: 12, right: 12 }}
        className="w-[260px]">
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {FRUITS.slice(0, 3).map((f) => (
            <SelectItem key={f.value} label={f.label} value={f.value} />
          ))}
          <SelectSeparator />
          {FRUITS.slice(3).map((f) => (
            <SelectItem key={f.value} label={f.label} value={f.value} />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function States() {
  return (
    <PreviewStack>
      <Spec label="State=Default · Size=default h-10 (Tablet sm:h-9)">
        <Example />
      </Spec>
      <Spec label="State=Filled · tap → Focus ◆ (ring while open)">
        <Example filled />
      </Spec>
      <Spec label="Size=sm · h-8">
        <Example size="sm" />
      </Spec>
      <Spec label="State=Disabled">
        <Example disabled />
      </Spec>
      <Spec label="State=Invalid ◆">
        <Example invalid />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [{ name: 'State · Size', component: States }];
