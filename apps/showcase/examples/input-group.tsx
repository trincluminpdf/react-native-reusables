import { Button } from '@/registry/nativewind/components/ui/button';
import { Icon } from '@/registry/nativewind/components/ui/icon';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/registry/nativewind/components/ui/input-group';
import { Spinner } from '@/registry/nativewind/components/ui/spinner';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import {
  ArrowUpIcon,
  CheckCircleIcon,
  InfoIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from 'phosphor-react-native';
import * as React from 'react';

function States() {
  return (
    <PreviewStack>
      <Spec label="Type=Input, State=Default">
        <InputGroup>
          <InputGroupAddon>
            <Icon as={MagnifyingGlassIcon} size={16} className="text-foreground" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Placeholder" />
          <InputGroupAddon align="inline-end">
            <Icon as={MagnifyingGlassIcon} size={16} className="text-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </Spec>
      <Spec label="State=Focus ◆ — tap the field">
        <InputGroup>
          <InputGroupAddon>
            <Icon as={MagnifyingGlassIcon} size={16} className="text-foreground" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search documents" />
        </InputGroup>
      </Spec>
      <Spec label="State=Disabled · Invalid">
        <InputGroup disabled>
          <InputGroupAddon>
            <Icon as={MagnifyingGlassIcon} size={16} className="text-foreground" />
          </InputGroupAddon>
          <InputGroupInput placeholder="Disabled" />
        </InputGroup>
        <InputGroup invalid>
          <InputGroupAddon>
            <Icon as={MagnifyingGlassIcon} size={16} className="text-foreground" />
          </InputGroupAddon>
          <InputGroupInput defaultValue="Invalid value" />
        </InputGroup>
      </Spec>
    </PreviewStack>
  );
}

function Addons() {
  return (
    <PreviewStack>
      <Spec label="Addon Inline=Text">
        <InputGroup>
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="example.com" autoCapitalize="none" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>.com</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Spec>
      <Spec label="Addon Inline=Spinner · Check Circle">
        <InputGroup>
          <InputGroupInput defaultValue="Uploading…" />
          <InputGroupAddon align="inline-end">
            <Spinner size={16} />
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput defaultValue="lumin-team" />
          <InputGroupAddon align="inline-end">
            <Icon as={CheckCircleIcon} size={16} className="text-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </Spec>
      <Spec label="Addon Inline=Button · Tooltip">
        <InputGroup>
          <InputGroupInput placeholder="Invite by email" autoCapitalize="none" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="secondary">
              <Text>Invite</Text>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput placeholder="API key" />
          <InputGroupAddon align="inline-end">
            <Icon as={InfoIcon} size={16} className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </Spec>
    </PreviewStack>
  );
}

function TextareaBlock() {
  return (
    <PreviewStack>
      <Spec label="Type=Textarea · Addon Block (Align=End)">
        <InputGroup>
          <InputGroupTextarea placeholder="Ask, search or chat…" />
          <InputGroupAddon align="block-end">
            <InputGroupButton size="icon" variant="outline" className="rounded-full" accessibilityLabel="Add">
              <Icon as={PlusIcon} size={14} />
            </InputGroupButton>
            <Button size="icon" className="size-6 rounded-full sm:size-6" accessibilityLabel="Send">
              <Icon as={ArrowUpIcon} size={14} />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'State', component: States },
  { name: 'Addon Inline', component: Addons },
  { name: 'Textarea + Addon Block', component: TextareaBlock },
];
