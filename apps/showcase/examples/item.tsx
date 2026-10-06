import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/registry/nativewind/components/ui/item';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { CaretRightIcon, FilePdfIcon, FolderSimpleIcon } from 'phosphor-react-native';
import * as React from 'react';

function Row({
  variant,
  size,
}: {
  variant?: 'default' | 'outline' | 'muted';
  size?: 'default' | 'sm' | 'xs';
}) {
  return (
    <Item variant={variant} size={size} className="w-full">
      <ItemMedia variant="icon">
        <Icon as={FolderSimpleIcon} size={16} />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Item title</ItemTitle>
        <ItemDescription>Item description goes here</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="outline" size="sm">
          <Text>Action</Text>
        </Button>
      </ItemActions>
    </Item>
  );
}

function Variants() {
  return (
    <PreviewStack>
      <Spec label="Variant=Default">
        <Row />
      </Spec>
      <Spec label="Variant=Outline">
        <Row variant="outline" />
      </Spec>
      <Spec label="Variant=Muted">
        <Row variant="muted" />
      </Spec>
      <Spec label="Size=xs · description text-xs">
        <Row variant="outline" size="xs" />
      </Spec>
    </PreviewStack>
  );
}

function Group() {
  const files = ['Contract.pdf', 'Invoice-0921.pdf', 'Proposal v2.pdf'];
  return (
    <PreviewStack>
      <Spec label="ItemGroup · pressable rows (≥ 44 high)">
        <ItemGroup className="border-border w-full gap-0 rounded-lg border">
          {files.map((f, i) => (
            <React.Fragment key={f}>
              {i > 0 ? <ItemSeparator /> : null}
              <Item onPress={() => {}} className="rounded-none">
                <ItemMedia variant="icon">
                  <Icon as={FilePdfIcon} size={16} />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{f}</ItemTitle>
                  <ItemDescription>Edited {i + 1}h ago</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Icon as={CaretRightIcon} size={16} className="text-muted-foreground" />
                </ItemActions>
              </Item>
            </React.Fragment>
          ))}
        </ItemGroup>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Variant · Size', component: Variants },
  { name: 'ItemGroup', component: Group },
];
