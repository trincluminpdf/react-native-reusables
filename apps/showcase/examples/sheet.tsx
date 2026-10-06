import { Button } from '@/registry/nativewind/components/ui/button';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Label } from '@/registry/nativewind/components/ui/label';
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/registry/nativewind/components/ui/sheet';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { View } from 'react-native';

function Example({ side }: { side: 'left' | 'right' }) {
  return (
    <PreviewStack>
      <Spec row label={`Position=${side} · w-3/4 max-w-sm (mostly Tablet)`}>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <Text>Open {side}</Text>
            </Button>
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>Make changes to your profile here.</SheetDescription>
            </SheetHeader>
            <SheetBody>
              <View className="gap-2">
                <Label>Name</Label>
                <Input defaultValue="Jordan Lee" />
              </View>
              <View className="gap-2">
                <Label>Username</Label>
                <Input defaultValue="@jordan" autoCapitalize="none" />
              </View>
            </SheetBody>
            <SheetFooter>
              <Button>
                <Text>Save changes</Text>
              </Button>
              <SheetClose asChild>
                <Button variant="outline">
                  <Text>Close</Text>
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Position=right', component: () => <Example side="right" /> },
  { name: 'Position=left', component: () => <Example side="left" /> },
];
