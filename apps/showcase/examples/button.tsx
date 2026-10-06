import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { ArrowRightIcon, CircleDashedIcon, PlusIcon } from 'phosphor-react-native';
import * as React from 'react';

function Variants() {
  return (
    <PreviewStack>
      <Spec row label="Variant=Default">
        <Button>
          <Text>Button</Text>
        </Button>
      </Spec>
      <Spec row label="Variant=PDF ◆ (bg-blue-500 dark:bg-blue-600)">
        <Button variant="pdf">
          <Text>Button</Text>
        </Button>
      </Spec>
      <Spec row label="Variant=Destructive ◆ soft (bg-destructive/10)">
        <Button variant="destructive">
          <Text>Button</Text>
        </Button>
      </Spec>
      <Spec row label="Variant=Outline">
        <Button variant="outline">
          <Text>Button</Text>
        </Button>
      </Spec>
      <Spec row label="Variant=Secondary">
        <Button variant="secondary">
          <Text>Button</Text>
        </Button>
      </Spec>
      <Spec row label="Variant=Ghost">
        <Button variant="ghost">
          <Text>Button</Text>
        </Button>
      </Spec>
      <Spec row label="Variant=Link">
        <Button variant="link">
          <Text>Button</Text>
        </Button>
      </Spec>
    </PreviewStack>
  );
}

function Sizes() {
  return (
    <PreviewStack>
      <Spec label="Size=sm · h-9 (Tablet sm:h-8)" row>
        <Button size="sm">
          <Text>Button</Text>
        </Button>
      </Spec>
      <Spec label="Size=default · h-10 (Tablet sm:h-9)" row>
        <Button>
          <Text>Button</Text>
        </Button>
      </Spec>
      <Spec label="Size=lg · h-11 (Tablet sm:h-10)" row>
        <Button size="lg">
          <Text>Button</Text>
        </Button>
      </Spec>
      <Spec label="Size=icon · size-10 (Tablet sm:size-9)" row>
        <Button size="icon" variant="outline" accessibilityLabel="Add">
          <Icon as={PlusIcon} />
        </Button>
        <Button size="icon" accessibilityLabel="Add">
          <Icon as={PlusIcon} />
        </Button>
      </Spec>
    </PreviewStack>
  );
}

function States() {
  return (
    <PreviewStack>
      <Spec row label="State=Pressed — press to see (RNR active:bg-*/90)">
        <Button>
          <Text>Press me</Text>
        </Button>
      </Spec>
      <Spec row label="State=Loading ◆ — Spinner + opacity-50, press blocked">
        <Button loading>
          <Text>Please wait</Text>
        </Button>
        <Button variant="pdf" loading>
          <Text>Uploading</Text>
        </Button>
      </Spec>
      <Spec row label="State=Disabled · opacity-50">
        <Button disabled>
          <Text>Button</Text>
        </Button>
        <Button variant="outline" disabled>
          <Text>Button</Text>
        </Button>
      </Spec>
    </PreviewStack>
  );
}

function WithIcon() {
  return (
    <PreviewStack>
      <Spec row label="Icon left · Phosphor 14">
        <Button>
          <Icon as={CircleDashedIcon} />
          <Text>Button</Text>
        </Button>
      </Spec>
      <Spec row label="Icon right">
        <Button variant="outline">
          <Text>Continue</Text>
          <Icon as={ArrowRightIcon} />
        </Button>
      </Spec>
      <Spec row label="Touch target — 44 hit area on every size (hitSlop)">
        <Button size="sm" variant="secondary">
          <Text>Small, still 44 to tap</Text>
        </Button>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Variant', component: Variants },
  { name: 'Size', component: Sizes },
  { name: 'State', component: States },
  { name: 'With Icon', component: WithIcon },
];
