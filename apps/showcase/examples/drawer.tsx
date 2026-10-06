import { Button } from '@/registry/nativewind/components/ui/button';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/registry/nativewind/components/ui/drawer';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Label } from '@/registry/nativewind/components/ui/label';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { MinusIcon, PlusIcon } from 'phosphor-react-native';
import * as React from 'react';
import { Pressable, View } from 'react-native';

function Statistic() {
  const [goal, setGoal] = React.useState(350);
  return (
    <PreviewStack>
      <Spec row label="Direction=bottom · Example Content=Statistic">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">
              <Text>Open Drawer</Text>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Move Goal</DrawerTitle>
              <DrawerDescription>Set your daily activity goal.</DrawerDescription>
            </DrawerHeader>
            <DrawerBody>
              <View className="flex-row items-center justify-center gap-4 py-4">
                <StepButton icon={MinusIcon} onPress={() => setGoal((g) => Math.max(200, g - 10))} />
                <View className="flex-1 items-center">
                  <Text className="text-6xl font-bold tracking-tighter">{goal}</Text>
                  <Text className="text-muted-foreground text-xs uppercase">Calories/day</Text>
                </View>
                <StepButton icon={PlusIcon} onPress={() => setGoal((g) => Math.min(500, g + 10))} />
              </View>
            </DrawerBody>
            <DrawerFooter>
              <Button>
                <Text>Submit</Text>
              </Button>
              <DrawerClose asChild>
                <Button variant="outline">
                  <Text>Cancel</Text>
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Spec>
    </PreviewStack>
  );
}

function StepButton({ icon, onPress }: { icon: typeof PlusIcon; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      className="border-input bg-background dark:bg-input/30 size-8 items-center justify-center rounded-full border active:opacity-60">
      <Icon as={icon} size={16} />
    </Pressable>
  );
}

function Form() {
  return (
    <PreviewStack>
      <Spec row label="Example Content=Form">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">
              <Text>Edit profile</Text>
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit profile</DrawerTitle>
              <DrawerDescription>Make changes to your profile here.</DrawerDescription>
            </DrawerHeader>
            <DrawerBody className="gap-4">
              <View className="gap-2">
                <Label>Name</Label>
                <Input defaultValue="Jordan Lee" />
              </View>
              <View className="gap-2">
                <Label>Username</Label>
                <Input defaultValue="@jordan" autoCapitalize="none" />
              </View>
            </DrawerBody>
            <DrawerFooter>
              <Button>
                <Text>Save changes</Text>
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Statistic', component: Statistic },
  { name: 'Form', component: Form },
];
