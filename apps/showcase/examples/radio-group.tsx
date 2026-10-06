import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/registry/nativewind/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/registry/nativewind/components/ui/radio-group';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

const OPTIONS = [
  { value: 'default', label: 'Default', description: 'Standard spacing for most use cases.' },
  { value: 'comfortable', label: 'Comfortable', description: 'More space between elements.' },
  { value: 'compact', label: 'Compact', description: 'Minimal spacing for dense layouts.' },
];

function Options({ box, end, invalid }: { box?: boolean; end?: boolean; invalid?: boolean }) {
  const [value, setValue] = React.useState('comfortable');
  return (
    <RadioGroup value={value} onValueChange={setValue} className="w-full">
      {OPTIONS.map((o) => {
        const control = <RadioGroupItem value={o.value} aria-invalid={invalid} className="mt-0.5" />;
        return (
          <Field
            key={o.value}
            orientation="horizontal"
            variant={box ? 'box' : 'default'}
            checked={value === o.value}
            invalid={invalid}
            onPress={() => setValue(o.value)}>
            {!end && control}
            <FieldContent>
              <FieldLabel>{o.label}</FieldLabel>
              <FieldDescription>{o.description}</FieldDescription>
            </FieldContent>
            {end && control}
          </Field>
        );
      })}
    </RadioGroup>
  );
}

function Simple() {
  const [value, setValue] = React.useState('a');
  return (
    <PreviewStack>
      <Spec label="Active=Off / On · State=Disabled" row>
        <RadioGroup value={value} onValueChange={setValue} className="flex-row gap-4">
          <RadioGroupItem value="a" />
          <RadioGroupItem value="b" />
          <RadioGroupItem value="c" disabled />
        </RadioGroup>
      </Spec>
      <Spec label="Label + Description · Radio Group gap-3">
        <Options />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Active · Label + Description', component: Simple },
  {
    name: 'Type=Box ◆',
    component: () => (
      <PreviewStack>
        <Spec label="Type=Box ◆">
          <Options box />
        </Spec>
      </PreviewStack>
    ),
  },
  {
    name: 'Placement=End · Invalid ◆',
    component: () => (
      <PreviewStack>
        <Spec label="Control Placement=End ◆">
          <Options end />
        </Spec>
        <Spec label="State=Invalid ◆">
          <Options invalid />
        </Spec>
      </PreviewStack>
    ),
  },
];
