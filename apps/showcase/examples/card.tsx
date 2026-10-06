import { Button } from '@/registry/nativewind/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardImage,
  CardTitle,
} from '@/registry/nativewind/components/ui/card';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Label } from '@/registry/nativewind/components/ui/label';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { DotsThreeIcon } from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

function Login({ size }: { size?: 'default' | 'sm' }) {
  return (
    <Card size={size} className="w-full">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <View className="gap-2">
          <Label>Email</Label>
          <Input placeholder="m@example.com" keyboardType="email-address" autoCapitalize="none" />
        </View>
      </CardContent>
      <CardFooter className="flex-col">
        <Button className="w-full">
          <Text>Login</Text>
        </Button>
      </CardFooter>
    </Card>
  );
}

export const previews: Preview[] = [
  {
    name: 'Size=default',
    component: () => (
      <PreviewStack>
        <Spec label="Size=default · py-6 gap-6, sections px-6 (base kit) · no shadow ◆">
          <Login />
        </Spec>
      </PreviewStack>
    ),
  },
  {
    name: 'Size=sm ◆',
    component: () => (
      <PreviewStack>
        <Spec label="Size=sm ◆ · py-4 gap-4, sections px-4">
          <Login size="sm" />
        </Spec>
      </PreviewStack>
    ),
  },
  {
    name: 'Action + Image ◆',
    component: () => (
      <PreviewStack>
        <Spec label="Header Action ◆ + top Image ◆">
          <Card className="w-full">
            <CardImage
              className="-mt-6"
              source={{ uri: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800' }}
            />
            <CardHeader>
              <CardTitle>Quarterly report.pdf</CardTitle>
              <CardDescription>Edited 2 hours ago</CardDescription>
              <CardAction>
                <Button variant="ghost" size="icon" className="size-8 sm:size-8" accessibilityLabel="More">
                  <Icon as={DotsThreeIcon} size={16} />
                </Button>
              </CardAction>
            </CardHeader>
            <CardFooter>
              <Button variant="pdf" size="sm">
                <Text>Open</Text>
              </Button>
            </CardFooter>
          </Card>
        </Spec>
      </PreviewStack>
    ),
  },
];
