import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from '@/registry/nativewind/components/ui/avatar';
import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { UploadSimpleIcon, UserIcon } from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

const IMG = 'https://github.com/shadcn.png';
const SIZES = ['xs', 'sm', 'default', 'lg', 'xl'] as const;

function Sizes() {
  return (
    <PreviewStack>
      <Spec label="Type=Image · Size=xs / sm / default / lg / xl ◆" row>
        {SIZES.map((s) => (
          <Avatar key={s} size={s} alt="Avatar">
            <AvatarImage source={{ uri: IMG }} />
            <AvatarFallback>
              <Text>CN</Text>
            </AvatarFallback>
          </Avatar>
        ))}
      </Spec>
      <Spec label="Type=Fallback" row>
        {SIZES.map((s) => (
          <Avatar key={s} size={s} alt="Avatar">
            <AvatarFallback>
              <Text>CN</Text>
            </AvatarFallback>
          </Avatar>
        ))}
      </Spec>
      <Spec label="Type=Icon ◆" row>
        {SIZES.map((s) => (
          <Avatar key={s} size={s} alt="Avatar">
            <AvatarFallback>
              <Icon as={UserIcon} className="text-muted-foreground size-1/2" />
            </AvatarFallback>
          </Avatar>
        ))}
      </Spec>
    </PreviewStack>
  );
}

function Extras() {
  return (
    <PreviewStack>
      <Spec label="Avatar Badge ◆ (status dot)" row>
        <Avatar size="lg" alt="Avatar">
          <AvatarImage source={{ uri: IMG }} />
          <AvatarFallback>
            <Text>CN</Text>
          </AvatarFallback>
          <AvatarBadge size="3" />
        </Avatar>
        <Avatar alt="Avatar">
          <AvatarFallback>
            <Text>TN</Text>
          </AvatarFallback>
          <AvatarBadge size="2.5" className="bg-muted-foreground" />
        </Avatar>
      </Spec>
      <Spec label="Avatar Group ◆">
        <AvatarGroup>
          {['CN', 'TN', 'LP'].map((t) => (
            <Avatar key={t} alt={t}>
              <AvatarFallback>
                <Text>{t}</Text>
              </AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </Spec>
      <Spec label="Form Field ◆ (upload row)">
        <View className="flex-row items-center gap-4">
          <Avatar size="xl" alt="Avatar">
            <AvatarFallback>
              <Icon as={UserIcon} size={20} className="text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <Button size="sm" variant="outline" className="h-8 gap-1.5 px-2.5">
            <Icon as={UploadSimpleIcon} />
            <Text>Upload photo</Text>
          </Button>
        </View>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Type × Size', component: Sizes },
  { name: 'Badge · Group · Form Field ◆', component: Extras },
];
