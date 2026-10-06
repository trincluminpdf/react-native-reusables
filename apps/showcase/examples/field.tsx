import { Button } from '@/registry/nativewind/components/ui/button';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/registry/nativewind/components/ui/field';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Input } from '@/registry/nativewind/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/registry/nativewind/components/ui/input-group';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { MagnifyingGlassIcon } from 'phosphor-react-native';
import * as React from 'react';

function Search({ invalid }: { invalid?: boolean }) {
  return (
    <InputGroup invalid={invalid}>
      <InputGroupAddon>
        <Icon as={MagnifyingGlassIcon} size={16} className="text-foreground" />
      </InputGroupAddon>
      <InputGroupInput placeholder="Placeholder" />
    </InputGroup>
  );
}

function Vertical() {
  return (
    <PreviewStack>
      <Spec label="Orientation=Vertical · Description Placement=Under Input">
        <Field>
          <FieldLabel>Label</FieldLabel>
          <Search />
          <FieldDescription>This is an input description.</FieldDescription>
        </Field>
      </Spec>
      <Spec label="Description Placement=Under Label">
        <Field>
          <FieldLabel>Label</FieldLabel>
          <FieldDescription>This is an input description.</FieldDescription>
          <Search />
        </Field>
      </Spec>
      <Spec label="Data Invalid=True">
        <Field invalid>
          <FieldLabel>Label</FieldLabel>
          <Search invalid />
          <FieldError>Enter a valid value.</FieldError>
        </Field>
      </Spec>
    </PreviewStack>
  );
}

function Responsive() {
  return (
    <PreviewStack>
      <Spec label="Orientation=Responsive · horizontal only on Tablet (≥ 640)">
        <Field orientation="responsive">
          <FieldContent>
            <FieldLabel>Label</FieldLabel>
            <FieldDescription>This is an input description.</FieldDescription>
          </FieldContent>
          <Search />
        </Field>
      </Spec>
    </PreviewStack>
  );
}

function Groups() {
  return (
    <PreviewStack>
      <FieldSet>
        <Spec label="Legend · Field Group (vertical gap-5) · Separator · Buttons">
          <FieldLegend>Create your account</FieldLegend>
          <FieldDescription>Fill in the form below to create your account.</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input placeholder="m@example.com" autoCapitalize="none" />
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input secureTextEntry placeholder="••••••••" />
              <FieldDescription>Must be at least 8 characters long.</FieldDescription>
            </Field>
            <Field className="gap-3">
              <Button>
                <Text>Create account</Text>
              </Button>
              <FieldSeparator>Or continue with</FieldSeparator>
              <Button variant="outline">
                <Text>Sign up with Google</Text>
              </Button>
            </Field>
          </FieldGroup>
        </Spec>
      </FieldSet>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Orientation=Vertical', component: Vertical },
  { name: 'Orientation=Responsive', component: Responsive },
  { name: 'Legend · Group · Separator', component: Groups },
];
