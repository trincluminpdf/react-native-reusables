import { BadgeNumber } from '@/registry/nativewind/components/ui/badge';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/registry/nativewind/components/ui/tabs';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { ClockIcon, FilesIcon, StarIcon } from 'phosphor-react-native';
import * as React from 'react';

function Example({ variant }: { variant: 'default' | 'line' }) {
  const [value, setValue] = React.useState('recent');
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList variant={variant}>
        <TabsTrigger value="recent">
          <Text>Recent</Text>
        </TabsTrigger>
        <TabsTrigger value="starred">
          <Text>Starred</Text>
        </TabsTrigger>
        <TabsTrigger value="shared">
          <Text>Shared</Text>
        </TabsTrigger>
        <TabsTrigger value="trash" disabled>
          <Text>Trash</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent value={value}>
        <Text className="text-muted-foreground text-sm">Showing {value} documents.</Text>
      </TabsContent>
    </Tabs>
  );
}

function WithIcons() {
  const [value, setValue] = React.useState('all');
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList variant="line">
        <TabsTrigger value="all">
          <Icon as={FilesIcon} size={16} />
          <Text>All</Text>
        </TabsTrigger>
        <TabsTrigger value="recent">
          <Icon as={ClockIcon} size={16} />
          <Text>Recent</Text>
          <BadgeNumber variant="secondary">
            <Text>8</Text>
          </BadgeNumber>
        </TabsTrigger>
        <TabsTrigger value="starred">
          <Icon as={StarIcon} size={16} />
          <Text>Starred</Text>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export const previews: Preview[] = [
  {
    name: 'Variant=Default',
    component: () => (
      <PreviewStack>
        <Spec label="Variant=Default (base-kit segmented) · Active / Disabled">
          <Example variant="default" />
        </Spec>
      </PreviewStack>
    ),
  },
  {
    name: 'Variant=Line ◆',
    component: () => (
      <PreviewStack>
        <Spec label="Variant=Line ◆ (underline)">
          <Example variant="line" />
        </Spec>
      </PreviewStack>
    ),
  },
  {
    name: 'Icon + Badge ◆',
    component: () => (
      <PreviewStack>
        <Spec label="Icon + Badge Number inside trigger ◆">
          <WithIcons />
        </Spec>
      </PreviewStack>
    ),
  },
];
