import { Button } from '@/registry/nativewind/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/registry/nativewind/components/ui/dialog';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Label } from '@/registry/nativewind/components/ui/label';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

function Form() {
  return (
    <PreviewStack>
      <Spec row label="Example Content=Form · p-6 gap-4 rounded-lg, 342 wide on a 390 phone">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Text>Rename document</Text>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename document</DialogTitle>
              <DialogDescription>Give your PDF a name people will recognise.</DialogDescription>
            </DialogHeader>
            <View className="gap-2">
              <Label>Name</Label>
              <Input defaultValue="Contract.pdf" />
            </View>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  <Text>Cancel</Text>
                </Button>
              </DialogClose>
              <Button>
                <Text>Save changes</Text>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Spec>
    </PreviewStack>
  );
}

function TextContent() {
  return (
    <PreviewStack>
      <Spec row label="Example Content=Text · close X has a 44 hit area">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Text>What’s new</Text>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>What’s new in Lumin</DialogTitle>
              <DialogDescription>Version 3.2</DialogDescription>
            </DialogHeader>
            <Text className="text-sm leading-6">
              Sign documents faster with saved signatures, request signatures from anyone with an
              email address, and pick up where you left off on any device.
            </Text>
          </DialogContent>
        </Dialog>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Form', component: Form },
  { name: 'Text', component: TextContent },
];
