import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '@/registry/nativewind/components/ui/field';
import { Switch } from '@/registry/nativewind/components/ui/switch';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

function Basic() {
  const [a, setA] = React.useState(true);
  const [b, setB] = React.useState(false);
  const [c, setC] = React.useState(true);
  return (
    <PreviewStack>
      <Spec label="Size=default · Active=Off / On" row>
        <Switch checked={b} onCheckedChange={setB} />
        <Switch checked={a} onCheckedChange={setA} />
      </Spec>
      <Spec label="Size=sm ◆" row>
        <Switch size="sm" checked={!c} onCheckedChange={(v) => setC(!v)} />
        <Switch size="sm" checked={c} onCheckedChange={setC} />
      </Spec>
      <Spec label="State=Disabled · Invalid ◆" row>
        <Switch checked disabled onCheckedChange={() => {}} />
        <Switch checked={false} aria-invalid onCheckedChange={() => {}} />
      </Spec>
    </PreviewStack>
  );
}

function Row({ box, end = true, invalid }: { box?: boolean; end?: boolean; invalid?: boolean }) {
  const [on, setOn] = React.useState(!!box);
  const control = <Switch checked={on} onCheckedChange={setOn} aria-invalid={invalid} />;
  return (
    <Field
      orientation="horizontal"
      variant={box ? 'box' : 'default'}
      checked={on}
      invalid={invalid}
      className="items-center"
      onPress={() => setOn((v) => !v)}>
      {!end && control}
      <FieldContent className="gap-0.5">
        <FieldLabel>Share across devices</FieldLabel>
        <FieldDescription>Focus is shared across devices.</FieldDescription>
      </FieldContent>
      {end && control}
    </Field>
  );
}

function Layouts() {
  return (
    <PreviewStack>
      <Spec label="Label + Description · Control Placement=End">
        <Row />
      </Spec>
      <Spec label="Control Placement=Start">
        <Row end={false} />
      </Spec>
      <Spec label="Type=Box ◆">
        <Row box />
      </Spec>
      <Spec label="State=Invalid ◆">
        <Row invalid />
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Size · Active · State', component: Basic },
  { name: 'Type · Placement', component: Layouts },
];
