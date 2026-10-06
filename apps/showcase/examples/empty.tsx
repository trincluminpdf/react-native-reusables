import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
} from '@/registry/nativewind/components/ui/avatar';
import { Button } from '@/registry/nativewind/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/registry/nativewind/components/ui/empty';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Input } from '@/registry/nativewind/components/ui/input';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { ArrowRightIcon, FolderSimpleIcon } from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

function Header({ media = 'icon' }: { media?: 'icon' | 'avatar' | 'group' }) {
  return (
    <EmptyHeader>
      {media === 'icon' ? (
        <EmptyMedia variant="icon">
          <Icon as={FolderSimpleIcon} size={16} />
        </EmptyMedia>
      ) : media === 'avatar' ? (
        <EmptyMedia>
          <Avatar size="lg" alt="Jordan">
            <AvatarFallback>
              <Text>JL</Text>
            </AvatarFallback>
          </Avatar>
        </EmptyMedia>
      ) : (
        <EmptyMedia>
          <AvatarGroup>
            {['JL', 'AK', 'MP'].map((t) => (
              <Avatar key={t} alt={t}>
                <AvatarFallback>
                  <Text>{t}</Text>
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </EmptyMedia>
      )}
      <EmptyTitle>No projects yet</EmptyTitle>
      <EmptyDescription>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit interdum hendrerit ex vitae sodales.
      </EmptyDescription>
    </EmptyHeader>
  );
}

function LearnMore() {
  return (
    <Button variant="link" size="sm">
      <Text className="text-muted-foreground">Learn more</Text>
      <Icon as={ArrowRightIcon} className="text-muted-foreground" />
    </Button>
  );
}

function OneButton() {
  return (
    <PreviewStack>
      <Spec label="Media=Icon · Content=Button">
        <Empty className="border-border w-full border border-dashed">
          <Header />
          <EmptyContent>
            <Button>
              <Text>Create project</Text>
            </Button>
            <LearnMore />
          </EmptyContent>
        </Empty>
      </Spec>
    </PreviewStack>
  );
}

function TwoButtons() {
  return (
    <PreviewStack>
      <Spec label="Media=Avatar · Content=2 Buttons (Horizontal)">
        <Empty className="border-border w-full border border-dashed">
          <Header media="avatar" />
          <EmptyContent>
            <View className="flex-row gap-2">
              <Button>
                <Text>Create project</Text>
              </Button>
              <Button variant="outline">
                <Text>Import</Text>
              </Button>
            </View>
          </EmptyContent>
        </Empty>
      </Spec>
    </PreviewStack>
  );
}

function WithInput() {
  return (
    <PreviewStack>
      <Spec label="Media=AvatarGroup · Content=Input + Description">
        <Empty className="border-border w-full border border-dashed">
          <Header media="group" />
          <EmptyContent>
            <Input placeholder="Search projects" className="w-full" />
            <EmptyDescription>Need help? Contact support.</EmptyDescription>
          </EmptyContent>
        </Empty>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Content=Button', component: OneButton },
  { name: 'Content=2 Buttons', component: TwoButtons },
  { name: 'Content=Input + Description', component: WithInput },
];
