import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/registry/nativewind/components/ui/alert-dialog';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { TrashIcon, WarningIcon } from 'phosphor-react-native';
import * as React from 'react';

function Default() {
  return (
    <PreviewStack>
      <Spec row label="Size=default, Destructive=No · p-6 gap-4, footer flex-col-reverse">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <Text>Show Dialog</Text>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account from our
                servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Text>Cancel</Text>
              </AlertDialogCancel>
              <AlertDialogAction>
                <Text>Continue</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Spec>
    </PreviewStack>
  );
}

function Small() {
  return (
    <PreviewStack>
      <Spec row label="Size=sm ◆ + Media ◆ · max-w-xs, buttons side by side">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <Text>Show small dialog</Text>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia>
                <Icon as={WarningIcon} size={20} />
              </AlertDialogMedia>
              <AlertDialogTitle>Discard changes?</AlertDialogTitle>
              <AlertDialogDescription>Your edits to this page will be lost.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="flex-1">
                <Text>Cancel</Text>
              </AlertDialogCancel>
              <AlertDialogAction className="flex-1">
                <Text>Discard</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Spec>
    </PreviewStack>
  );
}

function Destructive() {
  return (
    <PreviewStack>
      <Spec row label="Destructive=Yes · Media destructive + soft destructive action">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Text>Delete document</Text>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogMedia variant="destructive">
                <Icon as={TrashIcon} size={20} />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete “Contract.pdf”?</AlertDialogTitle>
              <AlertDialogDescription>
                The file moves to Trash and is removed after 30 days.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                <Text>Cancel</Text>
              </AlertDialogCancel>
              <AlertDialogAction variant="destructive">
                <Text>Delete</Text>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Size=default', component: Default },
  { name: 'Size=sm ◆', component: Small },
  { name: 'Destructive=Yes', component: Destructive },
];
