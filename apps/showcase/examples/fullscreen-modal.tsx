import { Button } from '@/registry/nativewind/components/ui/button';
import {
  FullscreenModal,
  FullscreenModalAction,
  FullscreenModalBody,
  FullscreenModalClose,
  FullscreenModalContent,
  FullscreenModalHeader,
  FullscreenModalTitle,
  FullscreenModalTrigger,
} from '@/registry/nativewind/components/ui/fullscreen-modal';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Label } from '@/registry/nativewind/components/ui/label';
import { Separator } from '@/registry/nativewind/components/ui/separator';
import { Text } from '@/registry/nativewind/components/ui/text';
import { Textarea } from '@/registry/nativewind/components/ui/textarea';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import * as React from 'react';
import { ScrollView, View } from 'react-native';

function Task() {
  const [open, setOpen] = React.useState(false);
  return (
    <PreviewStack>
      <Spec row label="Type=Task · multi-step task (e.g. Request signature)">
        <FullscreenModal open={open} onOpenChange={setOpen}>
          <FullscreenModalTrigger asChild>
            <Button variant="outline">
              <Text>Request signature</Text>
            </Button>
          </FullscreenModalTrigger>
          <FullscreenModalContent type="task">
            <FullscreenModalHeader>
              <FullscreenModalClose />
              <FullscreenModalTitle>Request signature</FullscreenModalTitle>
              <FullscreenModalAction onPress={() => setOpen(false)}>Done</FullscreenModalAction>
            </FullscreenModalHeader>
            <Separator />
            <FullscreenModalBody>
              <ScrollView contentContainerClassName="gap-4 p-4">
                <View className="gap-2">
                  <Label>Recipient email</Label>
                  <Input placeholder="name@company.com" autoCapitalize="none" keyboardType="email-address" />
                </View>
                <View className="gap-2">
                  <Label>Message</Label>
                  <Textarea placeholder="Please sign this document." />
                </View>
              </ScrollView>
            </FullscreenModalBody>
          </FullscreenModalContent>
        </FullscreenModal>
      </Spec>
    </PreviewStack>
  );
}

function Immersive() {
  const [open, setOpen] = React.useState(false);
  return (
    <PreviewStack>
      <Spec row label="Type=Immersive · bg-black, text-white (viewer, camera, signature pad)">
        <FullscreenModal open={open} onOpenChange={setOpen}>
          <FullscreenModalTrigger asChild>
            <Button variant="outline">
              <Text>Open viewer</Text>
            </Button>
          </FullscreenModalTrigger>
          <FullscreenModalContent type="immersive">
            <FullscreenModalHeader>
              <FullscreenModalClose />
              <FullscreenModalTitle>Contract.pdf</FullscreenModalTitle>
              <FullscreenModalAction onPress={() => setOpen(false)}>Done</FullscreenModalAction>
            </FullscreenModalHeader>
            <FullscreenModalBody className="items-center justify-center p-4">
              <View className="aspect-[3/4] w-full max-w-sm rounded-md bg-white" />
              <Text className="mt-3 text-xs text-white/70">Page 1 of 4</Text>
            </FullscreenModalBody>
          </FullscreenModalContent>
        </FullscreenModal>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Type=Task', component: Task },
  { name: 'Type=Immersive', component: Immersive },
];
