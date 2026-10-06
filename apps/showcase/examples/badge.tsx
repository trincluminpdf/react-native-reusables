import { Badge, BadgeNumber } from '@/registry/nativewind/components/ui/badge';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { ArrowRightIcon, SealCheckIcon } from 'phosphor-react-native';
import * as React from 'react';

function Variants() {
  return (
    <PreviewStack>
      <Spec label="Variant=Default · Secondary · Outline" row>
        <Badge>
          <Text>Badge</Text>
        </Badge>
        <Badge variant="secondary">
          <Text>Badge</Text>
        </Badge>
        <Badge variant="outline">
          <Text>Badge</Text>
        </Badge>
      </Spec>
      <Spec label="Variant=Destructive ◆ soft" row>
        <Badge variant="destructive">
          <Text>Badge</Text>
        </Badge>
      </Spec>
      <Spec label="Variant=Verified ◆ · Ghost ◆" row>
        <Badge variant="verified">
          <Icon as={SealCheckIcon} size={12} />
          <Text>Verified</Text>
        </Badge>
        <Badge variant="ghost">
          <Text>Badge</Text>
        </Badge>
      </Spec>
      <Spec label="Left / Right icon (compose <Icon size={12} />)" row>
        <Badge variant="secondary">
          <Text>Next</Text>
          <Icon as={ArrowRightIcon} size={12} />
        </Badge>
      </Spec>
    </PreviewStack>
  );
}

function Numbers() {
  return (
    <PreviewStack>
      <Spec label="Badge Number ◆ · h-5 min-w-5 (used in Tabs)" row>
        <BadgeNumber>
          <Text>8</Text>
        </BadgeNumber>
        <BadgeNumber variant="secondary">
          <Text>8</Text>
        </BadgeNumber>
        <BadgeNumber variant="outline">
          <Text>8</Text>
        </BadgeNumber>
        <BadgeNumber variant="destructive">
          <Text>99+</Text>
        </BadgeNumber>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Variant', component: Variants },
  { name: 'Badge Number ◆', component: Numbers },
];
