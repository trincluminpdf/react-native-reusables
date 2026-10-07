import { Chip, ChipGroup } from '@/registry/nativewind/components/ui/chip';
import { Text } from '@/registry/nativewind/components/ui/text';
import type { Preview } from '@showcase/components/component-page';
import { PreviewStack, Spec } from '@showcase/components/spec';
import { MagicWandIcon, SignatureIcon, TextTIcon, UserIcon } from 'phosphor-react-native';
import * as React from 'react';
import { View } from 'react-native';

function Assist() {
  const [last, setLast] = React.useState<string | null>(null);
  return (
    <PreviewStack>
      <Spec label="◆ Assist Chip · Show icon=true">
        <ChipGroup>
          <Chip
            label="Add signature"
            icon={SignatureIcon}
            onPress={() => setLast('Add signature')}
          />
          <Chip label="Summarize" icon={MagicWandIcon} onPress={() => setLast('Summarize')} />
          <Chip label="Add text" icon={TextTIcon} onPress={() => setLast('Add text')} />
        </ChipGroup>
      </Spec>
      <Spec label="◆ Assist Chip · Show icon=false (suggestion chip)">
        <ChipGroup>
          <Chip label="Fill this form" onPress={() => setLast('Fill this form')} />
          <Chip label="Translate" onPress={() => setLast('Translate')} />
        </ChipGroup>
      </Spec>
      <Spec label="◆ Assist Chip · State=Disabled">
        <Chip label="Add signature" icon={SignatureIcon} disabled />
      </Spec>
      {last ? <Text className="text-muted-foreground text-sm">Tapped: {last}</Text> : null}
    </PreviewStack>
  );
}

const SIGNERS = ['signer1@example.com', 'signer2@example.com', 'reviewer@example.com'];

function Input() {
  const [signers, setSigners] = React.useState<string[]>(SIGNERS);
  return (
    <PreviewStack>
      <Spec label="◆ Input Chip · recipients field (tap X to remove)">
        <View className="border-input bg-background dark:bg-input/30 min-h-10 rounded-md border p-1.5">
          <ChipGroup className="gap-1.5">
            {signers.map((s) => (
              <Chip
                key={s}
                variant="input"
                label={s}
                icon={UserIcon}
                onRemove={() => setSigners((list) => list.filter((x) => x !== s))}
              />
            ))}
            {signers.length === 0 ? (
              <Text className="text-muted-foreground px-1.5 py-2 text-sm">Add signers…</Text>
            ) : null}
          </ChipGroup>
        </View>
        {signers.length < SIGNERS.length ? (
          <Text className="text-primary text-sm underline" onPress={() => setSigners(SIGNERS)}>
            Reset
          </Text>
        ) : null}
      </Spec>
      <Spec label="◆ Input Chip · Show leading icon=false / State=Disabled">
        <ChipGroup>
          <Chip variant="input" label="Contracts" onRemove={() => {}} />
          <Chip variant="input" label="Archived" onRemove={() => {}} disabled />
        </ChipGroup>
      </Spec>
    </PreviewStack>
  );
}

export const previews: Preview[] = [
  { name: 'Assist Chip', component: Assist },
  { name: 'Input Chip', component: Input },
];
