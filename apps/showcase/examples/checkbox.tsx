import { Checkbox } from '@/registry/nativewind/components/ui/checkbox';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/registry/nativewind/components/ui/field';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';

function Checked() {
  const [a, setA] = React.useState(false);
  const [b, setB] = React.useState(true);
  return (
    <PreviewStack>
      <Spec label="Checked=No / Yes / Indeterminate ◆" row>
        <Checkbox checked={a} onCheckedChange={setA} />
        <Checkbox checked={b} onCheckedChange={setB} />
        <Checkbox checked={false} indeterminate onCheckedChange={() => {}} />
      </Spec>
      <Spec label="State=Invalid ◆ / Disabled" row>
        <Checkbox checked={false} aria-invalid onCheckedChange={() => {}} />
        <Checkbox checked aria-invalid onCheckedChange={() => {}} />
        <Checkbox checked={false} disabled onCheckedChange={() => {}} />
        <Checkbox checked disabled onCheckedChange={() => {}} />
      </Spec>
    </PreviewStack>
  );
}

function Row({
  box,
  end,
  invalid,
  label = 'Accept terms and conditions',
}: {
  box?: boolean;
  end?: boolean;
  invalid?: boolean;
  label?: string;
}) {
  const [checked, setChecked] = React.useState(!!box);
  const control = (
    <Checkbox checked={checked} onCheckedChange={setChecked} aria-invalid={invalid} className="mt-0.5" />
  );
  return (
    <Field
      orientation="horizontal"
      variant={box ? 'box' : 'default'}
      checked={checked}
      invalid={invalid}
      onPress={() => setChecked((v) => !v)}>
      {!end && control}
      <FieldContent>
        <FieldLabel>{label}</FieldLabel>
        <FieldDescription>By clicking this checkbox, you agree to the terms.</FieldDescription>
      </FieldContent>
      {end && control}
    </Field>
  );
}

function Layouts() {
  return (
    <PreviewStack>
      <Spec label="Label + Description (compose with ◆ Field)">
        <Row />
      </Spec>
      <Spec label="Type=Box ◆">
        <Row box />
      </Spec>
      <Spec label="Control Placement=End ◆">
        <Row end />
      </Spec>
      <Spec label="State=Invalid ◆">
        <Row invalid />
      </Spec>
    </PreviewStack>
  );
}

function Group() {
  return (
    <PreviewStack>
      <Spec label="Checkbox Group · gap-3">
        <FieldGroup className="gap-3">
          {['Comments', 'Mentions', 'Signature requests'].map((l) => (
            <Row key={l} label={l} />
          ))}
        </FieldGroup>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Checked · State', component: Checked },
  { name: 'Type · Placement ◆', component: Layouts },
  { name: 'Checkbox Group', component: Group },
];
