import { Alert, AlertAction, AlertDescription, AlertTitle } from '@/registry/nativewind/components/ui/alert';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { InfoIcon, WarningCircleIcon } from 'phosphor-react-native';
import * as React from 'react';

function Variants() {
  return (
    <PreviewStack>
      <Spec label="Variant=Default">
        <Alert icon={InfoIcon}>
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>This is an alert description.</AlertDescription>
        </Alert>
      </Spec>
      <Spec label="Variant=Destructive">
        <Alert icon={WarningCircleIcon} variant="destructive">
          <AlertTitle>Alert Title</AlertTitle>
          <AlertDescription>This is an alert description.</AlertDescription>
        </Alert>
      </Spec>
      <Spec label="Title only / no icon (show/hide toggles)">
        <Alert icon={InfoIcon}>
          <AlertTitle>Your changes were saved.</AlertTitle>
        </Alert>
        <Alert>
          <AlertDescription className="pl-0">Description without icon or title.</AlertDescription>
        </Alert>
      </Spec>
    </PreviewStack>
  );
}

function WithAction() {
  return (
    <PreviewStack>
      <Spec label="Action Button ◆ (AlertAction)">
        <Alert icon={InfoIcon}>
          <AlertTitle className="pr-20">Update available</AlertTitle>
          <AlertDescription className="pr-20">Restart to use the latest version.</AlertDescription>
          <AlertAction>
            <Button size="sm" variant="outline">
              <Text>Restart</Text>
            </Button>
          </AlertAction>
        </Alert>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Variant', component: Variants },
  { name: 'With Action ◆', component: WithAction },
];
