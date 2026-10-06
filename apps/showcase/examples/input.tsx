import { Icon } from '@/registry/nativewind/components/ui/icon';
import { Input } from '@/registry/nativewind/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/registry/nativewind/components/ui/input-group';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { EyeIcon, EyeSlashIcon } from 'phosphor-react-native';
import * as React from 'react';

function States() {
  return (
    <PreviewStack>
      <Spec label="State=Default · h-10 (Tablet sm:h-9), text-base">
        <Input placeholder="Email" />
      </Spec>
      <Spec label="State=Filled">
        <Input defaultValue="m@example.com" />
      </Spec>
      <Spec label="State=Focus ◆ — tap: border-ring + ring on native too">
        <Input placeholder="Tap to focus" />
      </Spec>
      <Spec label="State=Disabled · bg-input/50 + opacity-50">
        <Input placeholder="Email" editable={false} />
      </Spec>
      <Spec label="State=Invalid ◆">
        <Input defaultValue="not-an-email" aria-invalid />
      </Spec>
    </PreviewStack>
  );
}

function Password() {
  const [show, setShow] = React.useState(false);
  return (
    <PreviewStack>
      <Spec label="Variant=Password ◆ · secureTextEntry + eye Button (Input Group)">
        <InputGroup>
          <InputGroupInput placeholder="Password" secureTextEntry={!show} defaultValue="hunter2hunter2" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon"
              onPress={() => setShow((v) => !v)}
              accessibilityLabel={show ? 'Hide password' : 'Show password'}>
              <Icon as={show ? EyeSlashIcon : EyeIcon} size={16} className="text-muted-foreground" />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'State', component: States },
  { name: 'Variant=Password ◆', component: Password },
];
